<template>
    <CustomersNavbar/>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Your Cart</h1>
      <div v-if="cart.length > 0">
        <div class="cart-items">
          <div v-for="item in cart" :key="item.id" class="flex items-center justify-between mb-4 p-4 border border-gray-300 rounded-lg">
            <img :src="item.imageUrl" alt="Product Image" class="w-24 h-24 object-cover rounded">
            <div class="flex-grow px-4">
              <h2 class="text-lg font-bold">{{ item.name }}</h2>
              <p class="text-xl font-semibold">${{ item.price }} x {{ item.quantity }}</p>
            </div>
            <div class="flex items-center">
              <button @click="decrementQuantity(item)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                -
              </button>
              <button @click="incrementQuantity(item)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                +
              </button>
              <button @click="removeFromCart(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            </div>
          </div>
        </div>
        <div class="cart-summary mt-6">
          <p class="text-lg font-bold">Subtotal: ${{ calculateSubtotal }}</p>
          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
            Proceed to Checkout
          </button>
          <button @click="clearCart" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4">
            Clear Cart
          </button>
        </div>
      </div>
      <p v-else class="text-lg font-semibold text-center mt-4">Your cart is empty.</p>
      <div v-if="message" class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded">
        {{ message }}
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
  
      const calculateSubtotal = computed(() => {
        return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
      });
  
      return { cart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, calculateSubtotal, message };
    }
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS is utility-first, so most styling is done in the template with class attributes. */
  </style>