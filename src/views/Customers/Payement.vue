<template>
  <div class="min-h-screen bg-gray-100">
    <CustomersNavbar/>
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
        <div v-if="cart.length > 0">
          <ul class="mb-4">
            <li v-for="item in cart" :key="item.id" class="flex justify-between border-b py-2">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>${{ item.price * item.quantity }}</span>
            </li>
          </ul>
          <p class="text-xl font-bold">Total: ${{ calculateSubtotal }}</p>
          <div class="mt-6">
            <h3 class="text-lg font-bold mb-2">Payment Details</h3>
            <form @submit.prevent="processPayment" class="space-y-4">
              <input type="text" placeholder="Card Number" class="form-input" required>
              <input type="text" placeholder="Card Holder Name" class="form-input" required>
              <div class="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Expiry Date (MM/YY)" class="form-input" required>
                <input type="text" placeholder="CVV" class="form-input" required>
              </div>
              <button type="submit" class="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                Pay ${{ calculateSubtotal }}
              </button>
            </form>
          </div>
        </div>
        <p v-else class="text-center text-lg">Your cart is empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import CustomersNavbar from '../../components/CustomersNavbar.vue';

export default {
  components: {
    CustomersNavbar,
  },
  setup() {
    const store = useStore();
    const cart = computed(() => store.state.cart);
    const calculateSubtotal = computed(() => {
      return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
    });

    const processPayment = () => {
      alert('Payment processing is not implemented yet.');
      // Implement payment processing logic here
    };

    return { cart, calculateSubtotal, processPayment };
  }
};
</script>

<style scoped>
.form-input {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 100%;
}
</style>