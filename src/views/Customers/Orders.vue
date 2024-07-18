    <template>
        <div class="min-h-screen bg-gray-100">
            <CustomersNavbar />
            <div class="container mx-auto p-4">
                <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">My Orders</h1>

                <!-- Product Ratings Section -->
                <div v-for="order in orders" :key="order.id" class="bg-white p-6 rounded-lg shadow-lg mb-4">
                    <p><span class="text-xl font-bold text-gray-800 mb-2">Status:</span> {{ order.status }}</p>

                    <div v-if="order.status === 'paid'" class="mb-4">
                        <h3 class="text-lg font-bold">Rate the Products:</h3>
                        <div v-for="item in order.items" :key="item.id">
                            <ProductRating :productId="item.id" :orderId="order.id" />
                        </div>
                    </div>

                    <!-- Survey Section -->
                    <div class="flex items-center justify-center bg-gray-100 min-h-screen">
                        <div class="flex items-center flex-col bg-white p-6 rounded-lg shadow-lg mb-4 w-full">
                            <div class="w-full mb-6 text-center">
                                <h2 class="text-3xl font-extrabold text-blue-600 sm:w-full lg:w-auto">
                                    Your Feedback Matters to Us!
                                </h2>
                            </div>

                            <!-- Questions Section -->
                            <div v-for="(question, index) in questions" :key="index" class="mb-6 w-full">
                                <p class="text-lg font-bold mb-2">{{ question.text }}</p>
                                <div v-if="question.type === 'star'" class="flex justify-center">
                                    <template v-for="star in 5" :key="star">
                                        <svg
                                            @click="rateQuestion(index, star)"
                                            @mouseover="hoverRating[index] = star"
                                            @mouseleave="hoverRating[index] = 0"
                                            :class="{
                                                'text-yellow-500': (hoverRating[index] || responses[index].value) >= star,
                                                'text-gray-400': (hoverRating[index] || responses[index].value) < star,
                                            }"
                                            class="w-8 h-8 cursor-pointer mx-1 transition-transform transform hover:scale-110"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.7 5.245a1 1 0 00.95.691h5.484c.969 0 1.372 1.24.588 1.81l-4.44 3.236a1 1 0 00-.364 1.118l1.7 5.245c.3.921-.755 1.688-1.54 1.118l-4.44-3.236a1 1 0 00-1.176 0l-4.44 3.236c-.785.57-1.84-.197-1.54-1.118l1.7-5.245a1 1 0 00-.364-1.118L.649 10.673c-.784-.57-.381-1.81.588-1.81h5.484a1 1 0 00.95-.691l1.7-5.245z" />
                                        </svg>
                                    </template>
                                </div>
                                <div v-else-if="question.maximumAnswers === '1'" class="flex flex-col lg:flex-row justify-center lg:space-x-4">
                                    <div v-for="option in question.options" :key="option" class="mb-2">
                                        <label class="inline-flex items-center mr-4">
                                            <input type="radio" :name="'question-' + index" :value="option" v-model="responses[index].value" class="form-radio text-blue-500" />
                                            <span class="ml-2">{{ option }}</span>
                                        </label>
                                    </div>
                                </div>
                                <div v-else-if="question.maximumAnswers === '2'" class="flex flex-col lg:flex-row justify-center lg:space-x-4 flex-wrap">
                                    <div v-for="option in question.options" :key="option" class="mb-2">
                                        <label class="inline-flex items-center mr-4">
                                            <input type="checkbox" :value="option" :checked="responses[index].value.includes(option)" @change="updateCheckboxResponse(index, option)" class="form-checkbox text-blue-500" />
                                            <span class="ml-2">{{ option }}</span>
                                        </label>
                                    </div>
                                </div>
                                <div v-else-if="question.type === 'text'" class="flex justify-center">
                                    <textarea v-model="responses[index].value" class="border rounded p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" rows="4"></textarea>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <button
                                @click="submitSurvey(order.id)"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
                            >
                                Submit Feedback
                            </button>

                            <!-- Notification for Feedback -->
                            <transition name="fade">
                                <div v-if="showFeedback" class="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
                                    Thank you for your feedback!
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <script>
    import { ref, onMounted } from 'vue';
    import { db } from '@/firebase';
    import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    import ProductRating from '@/components/ProductRating.vue';
    import { useStore } from 'vuex';

    export default {
        components: {
            CustomersNavbar,
            ProductRating,
        },
        setup() {
            const store = useStore();
            const orders = ref([]);
            const questions = ref([]);
            const responses = ref([]);
            const hoverRating = ref([]);
            const ratingLabels = ref([]);
            const showFeedback = ref(false);

            const fetchOrders = async () => {
                const userId = store.state.user.uid;
                orders.value = []; // Clear previous orders
                const q = query(collection(db, 'order'), where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    orders.value.push({ id: doc.id, ...doc.data() });
                });
            };

            const fetchQuestions = async () => {
                const querySnapshot = await getDocs(collection(db, 'surveyQuestions'));
                questions.value = querySnapshot.docs.map(doc => doc.data());
                // Initialize responses based on questions
                responses.value = questions.value.map(question => {
                    if (question.type === 'text') {
                        return { type: 'text', value: '' }; // For text questions
                    } else if (question.maximumAnswers === '2') {
                        return { type: 'checkbox', value: [] }; // For multiple-choice questions
                    } else if (question.maximumAnswers === '1') {
                        return { type: 'radio', value: '' }; // For single-choice (radio) questions
                    } else if (question.type === 'star') {
                        return { type: 'star', value: 0 }; // For star rating questions, initialize with 0
                    }
                    return { type: 'undefined', value: undefined }; // Default case (handle as needed)
                });
                hoverRating.value = questions.value.map(() => 0);
            };

            const fetchRatingLabels = async () => {
                const querySnapshot = await getDocs(collection(db, 'ratingLabels'));
                ratingLabels.value = querySnapshot.docs.map(doc => doc.data().value);
            };

            const rateQuestion = (index, star) => {
                responses.value[index].value = star;
            };

            const updateCheckboxResponse = (index, option) => {
                const isChecked = responses.value[index].value.includes(option);
                if (isChecked) {
                    responses.value[index].value = responses.value[index].value.filter(item => item !== option);
                } else {
                    responses.value[index].value.push(option);
                }
            };

            const submitSurvey = async (orderId) => {
                // Simply submit without validation
                console.log('Submitting survey with responses:', responses.value);
                console.log('OrderId:', orderId);

                try {
                    await addDoc(collection(db, 'surveyResponses'), {
                        orderId: orderId,
                        responses: responses.value,
                        submittedAt: new Date(),
                    });

                    // Reset responses
                    responses.value = questions.value.map(question => {
                        if (question.type === 'text') {
                            return { type: 'text', value: '' }; // For text questions
                        } else if (question.maximumAnswers === '2') {
                            return { type: 'checkbox', value: [] }; // For multiple-choice questions
                        } else if (question.maximumAnswers === '1') {
                            return { type: 'radio', value: '' }; // For single-choice (radio) questions
                        } else if (question.type === 'star') {
                            return { type: 'star', value: 0 }; // For star rating questions, initialize with 0
                        }
                        return { type: 'undefined', value: undefined }; // Default case (handle as needed)
                    });

                    // Reset hover ratings
                    hoverRating.value = questions.value.map(() => 0);

                    // Show feedback notification
                    showFeedback.value = true;
                    setTimeout(() => {
                        showFeedback.value = false;
                    }, 3000);
                } catch (error) {
                    console.error('Error submitting survey:', error);
                }
            };

            onMounted(() => {
                fetchOrders();
                fetchQuestions();
                fetchRatingLabels();
            });

            return {
                orders,
                questions,
                responses,
                hoverRating,
                ratingLabels,
                showFeedback,
                rateQuestion,
                updateCheckboxResponse,
                submitSurvey,
            };
        },
    };
    </script>

    <style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
    </style>
