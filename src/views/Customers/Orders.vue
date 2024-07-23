    <template>
        <div class="min-h-screen bg-gray-100">
        <CustomersNavbar />
        <div class="container mx-auto p-4 max-w-4xl ">
            <h3 class="text-lg font-bold">Rate the Products:</h3>
    
            <!-- Product Ratings Section -->
            <div v-for="order in orders" :key="order.id" class="bg-white p-6 rounded-lg shadow-lg mb-4">
            <div v-if="order.status === 'paid'" class="mb-4">
                <div v-for="item in order.items" :key="item.id">
                <ProductRating :productId="item.id" :orderId="order.id" />
                </div>
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
                <p class="text-lg text-left md:text-center font-bold mb-2">{{ question.text }}</p>
                <div v-if="question.type === 'star'" class="flex md:justify-center">
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
    
                <div v-else-if="question.type === 'radio'" class="flex flex-col lg:flex-row justify-center lg:space-x-4">
                    <div v-for="option in question.options" :key="option.label" class="mb-2 flex flex-col md:flex-row md:justify-center">
                    <label class="inline-flex items-center mr-4">
                        <input
                        type="radio"
                        :name="'question-' + index"
                        :value="option.label"
                        v-model="responses[index].value"
                        class="form-radio text-blue-500"
                        />
                        <span class="ml-2">{{ option.label }}</span>
                    </label>
                    </div>
                </div>
    
                <div v-else-if="question.type === 'checkbox'" class="flex flex-col lg:flex-row justify-center lg:space-x-4 flex-wrap">
                    <div v-for="option in question.options" :key="option.label" class="mb-2 flex flex-col md:flex-row md:justify-center">
                    <label class="inline-flex items-center mr-4">
                        <input
                        type="checkbox"
                        :value="option.label"
                        :checked="responses[index].value.includes(option.label)"
                        @change="updateCheckboxResponse(index, option.label)"
                        class="form-checkbox text-blue-500"
                        />
                        <span class="ml-2">{{ option.label }}</span>
                    </label>
                    </div>
                </div>
    
                <div v-else-if="question.type === 'text'" class="flex justify-center">
                    <textarea
                    v-model="responses[index].value"
                    class="border rounded p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    rows="4"
                    ></textarea>
                </div>
    
                <div v-else-if="question.type === 'file'" class="flex justify-center">
                    <input
                    type="file"
                    @change="handleFileChange(index, $event)"
                    class="border rounded p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
    
                <div v-else-if="question.type === 'date'" class="flex justify-center">
                    <input
                    type="date"
                    v-model="responses[index].value"
                    class="border rounded p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div v-else-if="question.type === 'time'" class="flex justify-center">
                    <input
                    type="time"
                    v-model="responses[index].value"
                    class="border rounded p-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                </div>
    
                <!-- Submit Button -->
                <button
                @click="submitSurvey"
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
                <!-- Notification for Empty Feedback -->
                <transition name="fade">
                <div v-if="showError" class="fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded shadow-lg">
                    Please answer all questions before submitting.
                </div>
                </transition>
            </div>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router'; // Import useRoute
    import { db, storage } from '@/firebase'; // Import storage
    import { collection, doc, getDoc, getDocs, addDoc } from 'firebase/firestore';
    import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage methods
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    import ProductRating from '@/components/ProductRating.vue';
    
    export default {
        components: {
        CustomersNavbar,
        ProductRating
        },
        setup() {
        const route = useRoute(); // Access route parameters
        const orderId = route.params.id; // Get orderId from route parameters
    
        const orders = ref([]);
        const questions = ref([]);
        const responses = ref([]);
        const hoverRating = ref([]);
        const showFeedback = ref(false);
        const showError = ref(false);
    
        const fetchOrders = async () => {
            orders.value = []; // Clear previous orders
            try {
            // Reference to the specific order document
            const orderDocRef = doc(db, 'order', orderId);
            const orderDoc = await getDoc(orderDocRef);
    
            if (orderDoc.exists()) {
                orders.value.push({ id: orderDoc.id, ...orderDoc.data() });
            } else {
                console.log("No such order!");
            }
            } catch (error) {
            console.error("Error fetching order:", error);
            }
        };
    
        const fetchQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, 'forms'));
            questions.value = querySnapshot.docs.flatMap(doc => doc.data().questions);
    
            // Initialize responses based on questions
            responses.value = questions.value.map(question => {
            if (question.type === 'text') {
                return { type: 'text', value: '' }; // For text questions
            } else if (question.type === 'checkbox') {
                return { type: 'checkbox', value: [] }; // For multiple-choice questions
            } else if (question.type === 'radio') {
                return { type: 'radio', value: '' }; // For single-choice (radio) questions
            } else if (question.type === 'star') {
                return { type: 'star', value: 0 }; // For star rating questions, initialize with 0
            } else if (question.type === 'file') {
                return { type: 'file', value: null }; // For file uploads
            } else if (question.type === 'date') {
                return { type: 'date', value: '' }; // For date selection
            }else if (question.type === 'time') {
                return { type: 'time', value: '' }; // For time selection
            }
            return { type: 'text', value: '' }; // Default case
            });
        };
    
        const rateQuestion = (index, rating) => {
            responses.value[index].value = rating;
        };
    
        const updateCheckboxResponse = (index, optionText) => {
            const currentResponses = responses.value[index].value;
            if (currentResponses.includes(optionText)) {
            responses.value[index].value = currentResponses.filter(item => item !== optionText);
            } else {
            responses.value[index].value = [...currentResponses, optionText];
            }
        };
    
        const handleFileChange = (index, event) => {
            const file = event.target.files[0];
            responses.value[index].value = file;
        };
    
                const submitSurvey = async () => {
        const incomplete = responses.value.some(response => {
            if (response.type === 'checkbox' && response.value.length === 0) {
            return true;
            }
            if (response.type !== 'checkbox' && !response.value) {
            return true;
            }
            return false;
        });

        if (incomplete) {
            showError.value = true;
            setTimeout(() => (showError.value = false), 3000);
            return;
        }

        try {
            const feedbackResponses = await Promise.all(responses.value.map(async (response, index) => {
            if (response.type === 'file' && response.value) {
                const file = response.value;
                const storageReference = storageRef(storage, `feedback_files/${orderId}_${index}_${file.name}`);
                const snapshot = await uploadBytes(storageReference, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                return { type: response.type, value: downloadURL };
            }
            return response;
            }));

            await addDoc(collection(db, 'feedback'), {
            orderId,
            responses: feedbackResponses,
            timestamp: new Date()
            });

            // Reset form responses
            responses.value = questions.value.map(question => {
            if (question.type === 'text') {
                return { type: 'text', value: '' }; // For text questions
            } else if (question.type === 'checkbox') {
                return { type: 'checkbox', value: [] }; // For multiple-choice questions
            } else if (question.type === 'radio') {
                return { type: 'radio', value: '' }; // For single-choice (radio) questions
            } else if (question.type === 'star') {
                return { type: 'star', value: 0 }; // For star rating questions, initialize with 0
            } else if (question.type === 'file') {
                return { type: 'file', value: null }; // For file uploads
            } else if (question.type === 'date') {
                return { type: 'date', value: '' }; // For date selection
                
            }else if (question.type === 'time') {
                return { type: 'time', value: '' }; // For time selection
                
            }
            return { type: 'text', value: '' }; // Default case
            });

            // Clear hover ratings
            hoverRating.value = [];

            showFeedback.value = true;
            setTimeout(() => (showFeedback.value = false), 3000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
        };

    
        onMounted(() => {
            fetchOrders();
            fetchQuestions();
        });
    
        return {
            orders,
            questions,
            responses,
            hoverRating,
            showFeedback,
            showError,
            rateQuestion,
            updateCheckboxResponse,
            handleFileChange,
            submitSurvey
        };
        }
    };
    </script>
    
    <style scoped>
    /* Add your styles here */
    </style>
    