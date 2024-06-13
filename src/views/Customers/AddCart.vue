<template>
  <div>
    <CustomersNavbar/>
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="mr-2"/> Your Cart
      </h1>
      <div v-if="cart.length > 0">
        <div class="cart-items space-y-4">
          <div v-for="item in cart" :key="item.id" class="flex flex-col md:flex-row items-center md:justify-between p-4 bg-white shadow-md rounded-lg">
            <img :src="item.imageUrl" alt="Product Image" class="w-24 h-24 object-cover rounded mb-4 md:mb-0">
            <div class="flex-grow px-4 text-center md:text-left">
              <h2 class="text-xl font-semibold">{{ item.name }}</h2>
              <p class="text-lg text-gray-700">
                ${{ item.price }} x {{ item.quantity }}
              </p>
            </div>
            <div class="flex items-center space-x-2 mt-4 md:mt-0">
              <button @click="decrementQuantity(item)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'minus']"/>
              </button>
              <button @click="incrementQuantity(item)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'plus']"/>
              </button>
              <button @click="removeFromCart(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'trash']"/>
              </button>
            </div>
          </div>
        </div>
        <div class="cart-summary mt-8 text-center md:text-right">
          <p class="text-2xl font-bold">
          Subtotal: ${{ calculateSubtotal }}
          </p>
          <div class="mt-4 space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center md:justify-end">
            <button @click="clearCart" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'times-circle']" class="mr-1"/> Clear Cart
            </button>
            <router-link to="/Checkout" class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded transition duration-300 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-1"/> Proceed to Checkout
            </router-link>
          </div>
        </div>
      </div>
      <p v-else class="text-xl font-semibold text-center mt-4">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="mr-2"/> Your cart is empty.
      </p>
      <div v-if="message" class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import CustomersNavbar from '../../components/CustomersNavbar.vue';

export default {
  components: {
    CustomersNavbar,
  },
  setup() {
    const store = useStore();
    const cart = computed(() => store.state.cart);
    const message = ref('');

    const showMessage = (msg) => {
      message.value = msg;
      setTimeout(() => message.value = '', 3000); // Message disappears after 3 seconds
    };

    const incrementQuantity = (product) => {
      store.dispatch('addToCart', product);
      showMessage('Added more to your cart!');
    };

    const decrementQuantity = (product) => {
      if (product.quantity > 1) {
        store.dispatch('decrementQuantity', product.id);
        showMessage('Decreased product quantity!');
      } else {
        removeFromCart(product.id);
      }
    };

    const removeFromCart = (productId) => {
      store.dispatch('removeFromCart', productId);
      showMessage('Item removed from your cart.');
    };

    const clearCart = () => {
      store.dispatch('clearCart');
      showMessage('Cart cleared.');
    };

    const proceedToCheckout = () => {
      // Placeholder for checkout logic
      showMessage('Proceeding to checkout...');
    };

    const calculateSubtotal = computed(() => {
      return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
    });

    return { cart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, calculateSubtotal, message, proceedToCheckout };
  }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
