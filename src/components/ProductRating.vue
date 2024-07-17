    <template>
        <div class="flex items-center flex-col">
        <!-- Rating Section -->
        <div class="flex items-center mb-4">
            <span class="mr-2">Rate this product:</span>
            <div class="flex">
            <!-- Loop to display 5 stars -->
            <template v-for="star in 5" :key="star">
                <svg
                @click="rateProduct(star)"
                @mouseover="hoverRating = star"
                @mouseleave="hoverRating = 0"
                :class="{
                    'text-yellow-500': (hoverRating || rating) >= star,
                    'text-gray-400': (hoverRating || rating) < star
                }" 
                class="w-6 h-6 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.7 5.245a1 1 0 00.95.691h5.484c.969 0 1.372 1.24.588 1.81l-4.44 3.236a1 1 0 00-.364 1.118l1.7 5.245c.3.921-.755 1.688-1.54 1.118l-4.44-3.236a1 1 0 00-1.176 0l-4.44 3.236c-.785.57-1.84-.197-1.54-1.118l1.7-5.245a1 1 0 00-.364-1.118L.649 10.673c-.784-.57-.381-1.81.588-1.81h5.484a1 1 0 00.95-.691l1.7-5.245z"/>
                </svg>
            </template>
            </div>
        </div>
        <!-- Comment Section -->
        <textarea
            v-model="comment"
            placeholder="Leave a comment..."
            class="border rounded p-2 w-full mb-4"
            rows="4"
        ></textarea>
        <!-- Submit Button -->
        <button
            @click="submitRating"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Submit Rating
        </button>
        </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { db } from '@/firebase';
    import { collection, addDoc } from 'firebase/firestore';
    import { useStore } from 'vuex';
    
    // Define props to receive productId from parent component
    const props = defineProps({
        productId: String,
    });
    
    // Reactive variable to store rating
    const rating = ref(0);
    
    // Reactive variable to store hover rating for visual feedback
    const hoverRating = ref(0);
    
    // Reactive variable to store comment
    const comment = ref('');
    
    // Get Vuex store instance
    const store = useStore();
    
    // Function to handle star rating
    const rateProduct = (star) => {
        rating.value = star;  // Set rating
    };
    
    // Function to handle submitting the rating and comment
    const submitRating = async () => {
        if (!rating.value || !comment.value) {
        alert('Please provide a rating and a comment.');
        return;
        }
        try {
        await addDoc(collection(db, 'productRatings'), {
            productId: props.productId,  // Product ID
            rating: rating.value,  // Rating value
            comment: comment.value,  // User comment
            userId: store.state.user.uid,  // User ID from store
            createdAt: new Date().toISOString(),  // Timestamp
        });
        alert('Rating submitted successfully.');
        // Reset the rating and comment
        rating.value = 0;
        comment.value = '';
        } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating.');
        }
    };
    </script>
    
    <style scoped>
    /* Add any custom styles if necessary */
    </style>
    