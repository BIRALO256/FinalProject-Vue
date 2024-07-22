    <template>
        <div class="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg mb-4">
            <div class="flex flex-col md:flex-row items-start md:items-center">
                <div class="flex flex-row items-center w-full mb-4 md:mb-0">
                    <div class="flex-shrink-0 w-24 h-24 flex justify-center items-center mb-4 md:mb-0">
                        <img :src="product.imageUrl" alt="Product Image" class="h-full w-full object-cover shadow-md rounded" />
                    </div>
                    <div class="flex-grow px-2 md:px-4 text-left">
                        <h3 class="text-sm md:text-base font-bold text-gray-800 mb-1">{{ truncatedName }}</h3>
                        <p class="text-xs md:text-sm text-gray-600 mb-2 w-2/5">{{ truncatedDescription }}</p>
                    </div>
                </div>
                <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0 relative">
                    <h2 class="text-sm md:text-base font-bold text-gray-800 mb-2 text-left">Rating</h2>
                    <div class="flex items-center mb-2 md:mb-4 relative">
                        <div class="flex">
                            <template v-for="star in 5" :key="star">
                                <svg
                                    @click="rateProduct(star)"
                                    @mouseover="hoverRating = star"
                                    @mouseleave="hoverRating = 0"
                                    :class="{
                                        'text-yellow-500': (hoverRating || rating) >= star,
                                        'text-gray-400': (hoverRating || rating) < star,
                                    }"
                                    class="w-6 h-6 cursor-pointer transition-transform transform hover:scale-110"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.7 5.245a1 1 0 00.95.691h5.484c.969 0 1.372 1.24.588 1.81l-4.44 3.236a1 1 0 00-.364 1.118l1.7 5.245c.3.921-.755 1.688-1.54 1.118l-4.44-3.236a1 1 0 00-1.176 0l-4.44 3.236c-.785.57-1.84-.197-1.54-1.118l1.7-5.245a1 1 0 00-.364-1.118L.649 10.673c-.784-.57-.381-1.81.588-1.81h5.484a1 1 0 00.95-.691l1.7-5.245z"
                                    />
                                </svg>
                                <div v-if="hoverRating === star || rating === star"
                                    class="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-no-wrap
                                    top-full left-1/3 transform -translate-x-1/2 mt-2 ">
                                    {{ getRatingDescription(star) }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/4 px-4">
                    <div class="flex items-center space-x-2">
                        <h2 class="text-sm md:text-base font-bold text-gray-800 mb-2 md:pt-0 pt-2">Leave a comment:</h2>
                        <input type="checkbox" id="commentCheckbox" @change="toggleCommentTextArea">
                    </div>
                    <div class="mb-4 border border-gray-300 rounded-lg">
                        <textarea v-if="showCommentTextArea" v-model="comment" id="comment" name="comment" rows="2" class="form-textarea mt-1 block w-full p-4" placeholder="Enter your comment here..."></textarea>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    @click="submitRating"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
                >
                    {{ buttonText }}
                </button>
            </div>

            <transition name="modal">
                <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50" v-if="modalVisible">
                    <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-md mx-auto">
                        <div class="px-4 py-2 bg-gray-800 text-white flex justify-between items-center">
                            <h3 class="text-lg">{{ modalTitle }}</h3>
                            <button @click="closeModal" class="text-white">x</button>
                        </div>
                        <div class="px-4 py-2">
                            <p>{{ modalMessage }}</p>
                        </div>
                        <div class="px-4 py-2 flex justify-end">
                            <button @click="closeModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">OK</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </template>

    <script setup>
    import { ref, onMounted, computed } from 'vue';
    import { setDoc } from 'firebase/firestore';
    import { db } from '@/firebase';
    import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
    import { useStore } from 'vuex';

    const props = defineProps({
        productId: String,
        orderId: String,
    });

    const rating = ref(0);
    const hoverRating = ref(0);
    const comment = ref('');
    const product = ref({ imageUrl: '', name: '', description: '' });

    const ratingExisting = ref(false);

    const truncatedName = computed(() => {
        const maxLength = 12;
        return product.value.name.length > maxLength
            ? product.value.name.substring(0, maxLength) + '...'
            : product.value.name;
    });

    const truncatedDescription = computed(() => {
        const maxLength = 30;
        return product.value.description.length > maxLength
            ? product.value.description.substring(0, maxLength) + '.....'
            : product.value.description;
    });

    const store = useStore();
    const showCommentTextArea = ref(false);

    const modalVisible = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');

    const fetchProductDetails = async () => {
        try {
            const productDoc = await getDoc(doc(db, 'products', props.productId));
            if (productDoc.exists()) {
                product.value = productDoc.data();
            } else {
                showModal('Error', 'No such product!');
            }
        } catch (error) {
            showModal('Error', 'Error fetching product details.');
        }
    };

    const fetchUserRating = async () => {
        try {
            const q = query(collection(db, 'productRatings'), where('productId', '==', props.productId), where('userId', '==', store.state.user.uid), where('orderId', '==', props.orderId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userRating = querySnapshot.docs[0].data();
                rating.value = userRating.rating;
                comment.value = userRating.comment || '';
                ratingExisting.value = true;
            } else {
                ratingExisting.value = false;
            }
        } catch (error) {
            showModal('Error', 'Error fetching user rating.');
        }
    };

    const showModal = (title, message) => {
        modalTitle.value = title;
        modalMessage.value = message;
        modalVisible.value = true;
    };

    const closeModal = () => {
        modalVisible.value = false;
    };

    const rateProduct = (star) => {
        rating.value = star;
    };

    const getRatingDescription = (star) => {
        const descriptions = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        return descriptions[star - 1];
    };

    const toggleCommentTextArea = (event) => {
        showCommentTextArea.value = event.target.checked;
    };

    const submitRating = async () => {
        if (!rating.value) {
            showModal('Error', 'Please provide a rating.');
            return;
        }

        try {
            const ratingDocRef = doc(db, 'productRatings', `${props.productId}-${store.state.user.uid}`);
            await setDoc(ratingDocRef, {
                productId: props.productId,
                userId: store.state.user.uid,
                rating: rating.value,
                comment: comment.value,
                orderId: props.orderId,
            }, { merge: true });

            showModal('Success', ratingExisting.value ? 'Rating updated successfully!' : 'Rating submitted successfully!');
        } catch (error) {
            showModal('Error', 'Error submitting rating.');
        }
    };

    const buttonText = computed(() => ratingExisting.value ? 'Update' : 'Submit');

    onMounted(() => {
        fetchProductDetails();
        fetchUserRating();
    });
    </script>

    <style scoped>
    /* Add styles here */
    </style>
