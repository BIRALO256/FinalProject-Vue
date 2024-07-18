    <template>
        <div class="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg mb-4">
        <div class="flex flex-col md:flex-row items-start md:items-center">
            <!-- Column 1: Product Image -->
            <div class="w-full md:w-1/4 mb-4 md:mb-0 md:mr-6">
            <img
                :src="product.imageUrl"
                alt="Product Image"
                class="w-full h-auto md:h-24 md:w-24 object-cover shadow-md rounded mb-4 md:mb-0"
            />
            </div>
    
            <!-- Column 2: Product Name and Truncated Description -->
            <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-4">{{ truncatedDescription }}</p>
            </div>
    
            <!-- Column 3: Rating Section -->
            <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0">
            <div class="flex items-center mb-2 md:mb-4">
                <span class="mr-2 text-gray-700">Rate Product:</span>
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
                </template>
                </div>
            </div>
            <div class="mb-2 md:mb-4">
                <h2 class="inline-block text-gray-700 mr-2">Leave a comment:</h2>
                <input type="checkbox" id="commentCheckbox" @change="toggleCommentTextArea">
                <label for="commentCheckbox" class="ml-2 cursor-pointer text-gray-700">Yes</label>
            </div>
            </div>
    
            <!-- Column 4: Comment Section and Submit Button -->
            <div class="w-full md:w-1/4 px-4">
            <div v-if="showCommentTextArea" class="mb-4 border border-gray-300 rounded-lg p-4">
                <label for="comment" class="text-gray-700">Comment below</label>
                <textarea v-model="comment" id="comment" name="comment" rows="4" class="form-textarea mt-1 block w-full"></textarea>
            </div>
            <div class="flex justify-end">
                <button
                @click="submitRating"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
                >
                Submit
                </button>
            </div>
            </div>
        </div>
    
        <!-- Modal Component -->
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
    import { db } from '@/firebase';
    import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
    import { useStore } from 'vuex';
    
    const props = defineProps({
        productId: String,
        orderId: String, // transaction id
    });
    
    const rating = ref(0);
    const hoverRating = ref(0);
    const comment = ref('');
    const product = ref({ imageUrl: '', name: '', description: '' });
    
    const truncatedDescription = computed(() => {
        const maxLength = 100;
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
    
    const toggleCommentTextArea = () => {
        showCommentTextArea.value = !showCommentTextArea.value;
    };
    
    const rateProduct = (star) => {
        rating.value = star; // Set the rating value based on the selected star
    };
    
    const submitRating = async () => {
        if (!rating.value) {
        showModal('Error', 'Please provide a rating.');
        return;
        }
    
        try {
        const { supplierId } = product.value;
    
        await addDoc(collection(db, 'productRatings'), {
            productId: props.productId,
            rating: rating.value,
            comment: comment.value || 'No comment provided.',
            userId: store.state.user.uid,
            merchantId: supplierId,
            orderId: props.orderId,
            createdAt: new Date().toISOString(),
        });
    
        showModal('Success', 'Rating submitted successfully.');
    
        rating.value = 0;
        comment.value = '';
        } catch (error) {
        showModal('Error', 'Failed to submit rating.');
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
    
    onMounted(fetchProductDetails);
    </script>
    
    <style scoped>
    /* Add any additional styling for your component here */
    </style>
    