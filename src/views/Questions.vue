<template>
    <AdminNavbar />
    <div class="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
        <h1 class="text-2xl font-bold text-center mb-6">Create Form</h1>
        <div class="w-full max-w-2xl p-6 rounded-lg">
            <div v-for="(question, qIndex) in questions" :key="qIndex" class="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div class="flex flex-col sm:flex-row items-center mb-3 space-y-4 sm:space-y-0 sm:space-x-4">
                    <span class="font-semibold text-gray-700">{{ qIndex + 1 }}.</span>
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
                        class="draggable-list"
                        @dragover.prevent
                        @drop="handleDrop(qIndex)"
                    >
                        <div
                            v-for="(option, optIndex) in question.options"
                            :key="option.id"
                            class="flex items-center mb-1"
                            draggable="true"
                            @dragstart="handleDragStart(qIndex, optIndex)"
                        >
                            <input
                                v-model="option.label"
                                @input="updateKey(option)"
                                type="text"
                                placeholder="Option text"
                                class="form-input flex-1 border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-200"
                            />
                            <button @click="removeOption(qIndex, optIndex)" class="ml-3 p-1 text-red-500 hover:text-red-700 transition duration-200">
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
                    </div>

                    <button
                        @click="addOption(qIndex)"
                        class="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-lg transition duration-200"
                    >
                        Add Option
                    </button>
                </div>
                <div class="flex flex-row justify-end space-x-2">
                    <button
                        @click="duplicateQuestion(qIndex)"
                        class="ml-3 p-1 text-green-500 hover:text-green-700 transition duration-200"
                    >
                        <i class="fas fa-copy h-5 w-5"></i>
                    </button>
                    <button
                        @click="removeQuestion(qIndex)"
                        class="ml-3 p-1 text-red-500 hover:text-red-700 transition duration-200"
                    >
                        <i class="fas fa-trash-alt h-5 w-5"></i>
                    </button>
                    <!-- Required Toggle -->
                    <label class="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            v-model="question.required"
                            class="form-checkbox h-4 w-4 text-blue-600 transition duration-200"
                        />
                        <span class="text-sm text-gray-600">Required</span>
                    </label>
                </div>
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
                Create Form
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import AdminNavbar from "@/components/AdminNavbar.vue";

// Function to generate a random ID
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default {
    components: {
        AdminNavbar,
    },
    setup() {
        const questions = ref([
            { text: "", type: "text", options: [], required: false }, // Initial question setup
        ]);

        // Function to generate a key from the label
        const generateKey = (label) => {
            return label.trim().replace(/\s+/g, "_").toUpperCase();
        };

        // Function to add a new question
        const addQuestion = () => {
            questions.value.push({
                index: questions.value.length + 1,
                text: "",
                type: "text",
                options: [],
                required: false,
            });
        };

        // Function to duplicate a specific question
        const duplicateQuestion = (index) => {
            const questionToDuplicate = questions.value[index];
            // Create a copy of the question
            const duplicatedQuestion = {
                ...questionToDuplicate,
                options: questionToDuplicate.options.map((option) => ({ ...option })),
            };
            // Insert the duplicated question after the original one
            questions.value.splice(index + 1, 0, duplicatedQuestion);
        };

        // Function to remove a specific question
        const removeQuestion = (index) => {
            questions.value.splice(index, 1);
            // Update indexes of the remaining questions
            questions.value.forEach((question, idx) => (question.index = idx + 1));
        };

        // Function to add an option to a question
        const addOption = (questionIndex) => {
            questions.value[questionIndex].options.push({ id: generateId(), label: "", key: "" }); // Add unique ID
        };

        // Function to remove a specific option from a question
        const removeOption = (questionIndex, optionIndex) => {
            questions.value[questionIndex].options.splice(optionIndex, 1);
        };

        // Update option key
        const updateKey = (option) => {
            option.key = generateKey(option.label);
        };

        // Handle Drag Start
        const handleDragStart = (questionIndex, optionIndex) => {
            const item = {
                questionIndex,
                optionId: questions.value[questionIndex].options[optionIndex].id, // Use option ID
            };
            event.dataTransfer.dropEffect = 'move'; // this controls the visual feedback the user gets during drag and drop operation
            event.dataTransfer.effectAllowed = 'move'; // this tells the drag and drop API that we want to move the item instead of creating a copy
            event.dataTransfer.setData("application/json", JSON.stringify(item)); // Use application/json as MIME type
        };

        // Handle Drop
        const handleDrop = (questionIndex) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("application/json");
            if (!data) return;

            const item = JSON.parse(data);
            const options = questions.value[questionIndex].options;

            const draggedIndex = options.findIndex(opt => opt.id === item.optionId); // Find the index of the dragged option
            if (draggedIndex === -1 || item.questionIndex !== questionIndex) return;

            const [movedOption] = options.splice(draggedIndex, 1); // Remove the option from its original position

            const targetElement = event.target.closest(".flex.items-center");
            if (!targetElement) return;

            const targetIndex = Array.from(targetElement.parentNode.children).indexOf(targetElement);
            options.splice(targetIndex, 0, movedOption); // Insert the option into the target position
        };

        // Submit Form
        const submitForm = async () => {
            try {
                await addDoc(collection(db, "forms"), { questions: questions.value });
                alert("Form submitted successfully!");
                // Reset the form
                questions.value = [{ text: "", type: "text", options: [], required: false }];
            } catch (error) {
                console.error("Error submitting form: ", error);
            }
        };

        return {
            questions,
            addQuestion,
            duplicateQuestion,
            removeQuestion,
            addOption,
            removeOption,
            handleDragStart,
            handleDrop,
            updateKey,
            submitForm,
        };
    },
};
</script>

<style scoped>
.draggable-list {
    min-height: 100px;
    border: 2px dashed #ccc;
    padding: 10px;
}
.draggable-list .draggable-item {
    cursor: grab;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 5px;
    margin-bottom: 5px;
}
</style>
