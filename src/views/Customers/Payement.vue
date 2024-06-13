<template>
  <div class="min-h-screen bg-gray-100">
    <CustomersNavbar />
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h1>
      <div class="stripe-form bg-white p-6 rounded-lg shadow-lg">
        <form @submit.prevent="submitPayment">
          <div id="card-element" class="mb-4"><!-- Stripe Card Element will be inserted here --></div>
          <button
            type="submit"
            :disabled="!stripeReady"
            class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full"
          >
            Pay ${{ (calculateSubtotal / 100).toFixed(2) }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useStore } from 'vuex';
import CustomersNavbar from '@/components/CustomersNavbar.vue';

export default {
  components: {
    CustomersNavbar,
  },
  setup() {
    const store = useStore();
    const stripe = ref(null);
    const elements = ref(null);
    const stripeReady = ref(false);

    // Compute the subtotal from the Vuex store
    const calculateSubtotal = computed(() => {
      return store.state.cart.reduce((total, item) => {
        return total + item.price * item.quantity * 100; // Convert to cents
      }, 0);
    });

    const cardStyle = {
      style: {
        base: {
          color: "#32325d",
        },
      },
    };

    onMounted(async () => {
      stripe.value = await loadStripe('pk_test_51PQUla2MAGtg9B9CJl0dk6UnCllaAP7iXZVx7FnpTax3jSlJB6XRq61sybxLppSYNdr0FWVZsF9d6hzwzFqQm6Dc008iL6JSbA'); // this is my stripe publishable key
      elements.value = stripe.value.elements();
      const cardElement = elements.value.create('card', cardStyle);
      cardElement.mount('#card-element');
      stripeReady.value = true;
    });

    const submitPayment = async () => {
      const cardElement = elements.value.getElement('card');

      // Call for my backend to create the PaymentIntent
      const response = await fetch('https://my-cloud-function-url/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: calculateSubtotal.value }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Payment successful:', paymentIntent);
      }
    };

    return { submitPayment, cardStyle, stripeReady, calculateSubtotal };
  }
};
</script>

<style scoped>
.stripe-form {
  max-width: 500px;
  margin: auto;
}
</style>
