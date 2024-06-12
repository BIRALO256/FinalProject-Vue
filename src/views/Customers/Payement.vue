<template>
  <div class="stripe-form">
    <form @submit.prevent="submitPayment">
      <div id="card-element"><!-- Stripe Card Element will be inserted here --></div>
      <button type="submit" :disabled="!stripeReady">Pay ${{ calculateSubtotal / 100 }}</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { db, auth } from '@/firebase'; // Import Firebase

export default {
  setup() {
    const stripe = ref(null);
    const elements = ref(null);
    const stripeReady = ref(false);
    const calculateSubtotal = 1000; // Example amount in cents

    const cardStyle = {
      style: {
        base: {
          color: "#32325d",
        },
      },
    };

    onMounted(async () => {
      stripe.value = await loadStripe('your-public-key'); // Replace with your Stripe public key
      elements.value = stripe.value.elements();
      const cardElement = elements.value.create('card', cardStyle);
      cardElement.mount('#card-element');
      stripeReady.value = true;
    });

    const submitPayment = async () => {
      const cardElement = elements.value.getElement('card');

      // Call your backend to create the PaymentIntent
      const response = await fetch('https://your-cloud-function-url/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: calculateSubtotal }),
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
