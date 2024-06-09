<template>
  <nav class="bg-gray-800 text-white p-4 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center max-w-4xl">
      <div class="flex space-x-4">
        <router-link :to="{name:'about'}" class="text-lg hover:text-gray-300">All products</router-link>
        <div class="relative">
          <router-link :to="{name: 'cart'}" class="text-lg hover:text-gray-300 flex items-center">
            Cart
            <span v-if="cartCount > 0" class="ml-2 bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs">
              {{ cartCount }}
            </span>
          </router-link>
        </div>
        <router-link :to="{name: 'checkout'}" class="text-lg hover:text-gray-300">Check out</router-link>   
      </div>
      <div class="flex items-center space-x-4">
        <span v-if="user" class="text-lg">Hello, {{ user.displayName }}</span>
        <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  setup() {
    const store = useStore();
    const router = useRouter(); // Get the router instance
    const user = computed(() => store.state.user);
    const cartCount = computed(() => store.state.cart.reduce((acc, item) => acc + item.quantity, 0));

    const logout = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        store.dispatch('clearUser');
        router.push({ name: 'signup' }); // Use router instance to navigate
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    };

    return { user, logout, cartCount };
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>