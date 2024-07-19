  <template>
    <div class="min-h-screen bg-gray-100">
      <CustomersNavbar />
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h1>
        <div class="stripe-form bg-white p-6 rounded-lg shadow-lg">
          <form @submit.prevent="submitPayment">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center"
            >
              <span v-if="!isSubmitting">Save Order ${{ (calculateSubtotal / 100).toFixed(2) }}</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Processing...
              </span>
            </button>
          </form>
        </div>
        <transition name="fade">
          <div v-if="showSuccessMessage" class="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
            Order saved successfully!
          </div>
        </transition>
      </div>
    </div>
  </template>

  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import CustomersNavbar from '@/components/CustomersNavbar.vue';
  import { db } from '@/firebase';  // Import the Firestore instance
  import { collection, addDoc } from 'firebase/firestore';  // Import Firestore methods

  export default {
    components: {
      CustomersNavbar,
    },
    setup() {
      const store = useStore();
      const isSubmitting = ref(false);
      const showSuccessMessage = ref(false);

      // Compute the subtotal from the Vuex store
      const calculateSubtotal = computed(() => {
        return store.state.cart.reduce((total, item) => {
          return total + item.price * item.quantity * 100; // Convert to cents
        }, 0);
      });

      const submitPayment = async () => {
        if (isSubmitting.value) return;
        isSubmitting.value = true;

        await saveOrder();
      };

      const saveOrder = async () => {
        const order = {
          userId: store.state.user.uid,
          items: store.state.cart,
          total: calculateSubtotal.value / 100,
          status: 'paid',
          createdAt: new Date().toISOString(),
        };

        try {
          const docRef = await addDoc(collection(db, 'order'), order);
          console.log('Document written with ID: ', docRef.id);
          store.dispatch('clearCart');
          showSuccessMessage.value = true;
          setTimeout(() => {
            showSuccessMessage.value = false;
          }, 3000);
        } catch (error) {
          console.error('Error saving order:', error);
        } finally {
          isSubmitting.value = false;
        }
      };

      return { submitPayment, calculateSubtotal: calculateSubtotal.value, isSubmitting, showSuccessMessage };
    }
  };
  </script>

  <style scoped>
  .stripe-form {
    max-width: 500px;
    margin: auto;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
