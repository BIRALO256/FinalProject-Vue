<template>
  <div class="min-h-screen bg-gray-100">
    <CustomersNavbar />
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h1>
      <div class="stripe-form bg-white p-6 rounded-lg shadow-lg">
        <form @submit.prevent="submitPayment">
          
          <button
            type="submit"
          
            class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full"
          >
            Save Order ${{ (calculateSubtotal / 100).toFixed(2) }}
          </button>
        </form>
      </div>
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
    

    // Compute the subtotal from the Vuex store
    const calculateSubtotal = computed(() => {
      console.log('Calculating subtotal...');
      return store.state.cart.reduce((total, item) => {
        return total + item.price * item.quantity * 100; // Convert to cents
      }, 0);
    });

    const submitPayment = async () => {
      console.log('submitPayment function called');
      await saveOrder();
    };

    const saveOrder = async () => {
      console.log('saveOrder function called');
      console.log('User ID:', store.state.user.id);
      console.log('Cart Items:', store.state.cart);
      console.log('Total:', calculateSubtotal.value / 100);
      const order = {
        userId: store.state.user.uid,
        items: store.state.cart,
        total: calculateSubtotal.value / 100,
        status: 'paid',
        createdAt: new Date().toISOString()
      };

      try {
        const docRef = await addDoc(collection(db, 'order'),order);
        console.log('Document written with ID: ', docRef.id);
        store.dispatch('clearCart');
        console.log('Order saved successfully');
      } catch (error) {
        console.error('Error saving order:', error);
      }
    };

    return { submitPayment, calculateSubtotal };
  }
};
</script>

<style scoped>
.stripe-form {
  max-width: 500px;
  margin: auto;
}
</style>
