    <template>
        <AdminNavbar />
        <div class="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
        <h1 class="text-2xl font-bold text-center mb-6">
            {{ formExists ? 'Edit Form' : 'Create Form' }}
        </h1>
        <div class="w-full max-w-2xl p-6 rounded-lg">
            <div
            v-for="(question, index) in questions"
            :key="index"
            class="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
            >

        <div class="flex flex-col sm:flex-row items-center mb-3 space-y-4 sm:space-y-0 sm:space-x-4">
                <span class="font-semibold text-gray-700">{{ index + 1 }}.</span>
                <input
                v-model="question.text"
                type="text"
                placeholder="Enter question"
                class="form-input flex-1 border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200"
                />
                <div class="w-full sm:w-auto">
                <select
                    v-model="question.type"
                    class="form-select border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200 w-full"
                >
                    <option value="text">Text</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio Button</option>
                    <option value="star">Rating</option>
                    <option value="date">Date</option>
                    <option value="file">File</option>
                    <option value="time">Time</option>
                </select>
                </div>
            </div>

            <div v-if="question.type === 'checkbox' || question.type === 'radio'" class="mb-3">
                <div
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                class="flex items-center mb-1"
                >
                <input
                    v-model="option.text"
                    type="text"
                    placeholder="Option text"
                    class="form-input flex-1 border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200"
                />
                <button
                    @click="removeOption(index, optIndex)"
                    class="ml-3 p-1 text-red-500 hover:text-red-700 transition duration-200"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                </div>
                <button
                @click="addOption(index)"
                class="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-lg transition duration-200"
                >
                Add Option
                </button>
                
                

            </div>
            <button
                    @click="removeQuestion(index)"
                    class="ml-3 p-1 text-red-500 hover:text-red-700 transition duration-200 flex flex-row justify-end "
                >
                    <i class="fas fa-trash-alt h-5 w-5"></i>
            </button>
            </div>
            <button
            @click="addQuestion"
            class="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg transition duration-200 mb-4"
            >
            Add Question
            </button>
            <button
            @click="submitForm"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-lg transition duration-200"
            >
            {{ formExists ? 'Update Form' : 'Create Form' }}
            </button>
        </div>
        </div>
    </template>
    
    <script>
    import { ref, onMounted } from 'vue';
    import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
    import { db } from '@/firebase';
    import AdminNavbar from '@/components/AdminNavbar.vue';
    
    export default {
        components: {
        AdminNavbar,
        },
        setup() {
        const questions = ref([]);
        const formId = ref(null);
        const formExists = ref(false);
    
        const fetchQuestions = async () => {
            try {
            const formsCollection = collection(db, 'forms');
            const querySnapshot = await getDocs(formsCollection);
    
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                formId.value = docSnap.id;
                questions.value = docSnap.data().questions;
                formExists.value = true;
            } else {
                questions.value = [{ text: '', type: 'text', options: [] }];
                formExists.value = false;
            }
            } catch (e) {
            console.error('Error fetching documents: ', e);
            }
        };
    
        const addQuestion = () => {
            questions.value.push({ index: questions.value.length + 1, text: '', type: 'text', options: [] });
        };
    
        const removeQuestion = (index) => {
            questions.value.splice(index, 1);
            // Update indexes of the remaining questions
            questions.value.forEach((question, idx) => question.index = idx + 1);
        };
    
        const addOption = (questionIndex) => {
            questions.value[questionIndex].options.push({ text: '' });
        };
    
        const removeOption = (questionIndex, optionIndex) => {
            questions.value[questionIndex].options.splice(optionIndex, 1);
        };
    
        const submitForm = async () => {
            try {
            const docRef = formId.value ? doc(db, 'forms', formId.value) : doc(collection(db, 'forms'));
            if (formExists.value) {
                await updateDoc(docRef, { questions: questions.value });
                alert('Form updated successfully!');
            } else {
                await setDoc(docRef, { questions: questions.value });
                formId.value = docRef.id;
                formExists.value = true;
                alert('Form created successfully!');
            }
            } catch (e) {
            console.error('Error saving document: ', e);
            }
        };
    
        onMounted(() => {
            fetchQuestions();
        });
    
        return {
            questions,
            formExists,
            addQuestion,
            removeQuestion,
            addOption,
            removeOption,
            submitForm,
        };
        },
    };
    </script>
    
    <style scoped>
    .form-input {
        border: 1px solid #ddd;
        padding: 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
    }
    
    .form-select {
        border: 1px solid #ddd;
        padding: 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
    }
    
    button {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
    
    @media (min-width: 640px) {
        .form-input {
        padding: 0.5rem;
        }
    
        .form-select {
        padding: 0.5rem;
        }
    }
    </style>
    