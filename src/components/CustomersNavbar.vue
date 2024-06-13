<template>
  <nav class="bg-gray-800 text-white p-4 sticky top-0 z-50">
    <div class="container mx-auto flex flex-wrap justify-between items-center max-w-4xl">
      <div class="flex items-center justify-between w-full md:w-auto">
        <div class="flex space-x-4">
          <router-link :to="{ name: 'about' }" class="text-lg hover:text-gray-300">
            <font-awesome-icon icon="list" class="mr-2" />Products
          </router-link>
          <div class="relative">
            <router-link :to="{ name: 'cart' }" class="text-lg hover:text-gray-300 flex items-center">
              <font-awesome-icon icon="shopping-cart" class="mr-2" />Cart
              <span v-if="cartCount > 0" class="ml-2 bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs">
                {{ cartCount }}
              </span>
            </router-link>
          </div>

        </div>
        <button class="md:hidden text-lg hover:text-gray-300" @click="toggleMenu">
          <font-awesome-icon icon="bars" />
        </button>
      </div>
      <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="w-full md:flex md:w-auto md:items-center md:space-x-4 mt-4 md:mt-0">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <span v-if="user" class="text-lg">Hello, {{ user.displayName }}</span>
          <router-link :to="{ name: 'checkout' }" class="text-lg hover:text-gray-300">
            <font-awesome-icon icon="cash-register" class="mr-2" /> Check out
          </router-link>
          <router-link v-if="user" :to="{ name: 'profile' }" class="text-lg hover:text-gray-300">
            <font-awesome-icon icon="user" class="mr-2" />Profile
          </router-link>
          <button v-if="user" @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
            <font-awesome-icon icon="sign-out-alt" class="mr-2" />
          </button>
          <router-link v-else :to="{ name: 'signup' }" class="text-lg hover:text-gray-300">
            <font-awesome-icon icon="user-plus" class="mr-2" /> Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const cartCount = computed(() => store.state.cart.reduce((acc, item) => acc + item.quantity, 0));
    const isMenuOpen = ref(false);

    const logout = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        store.dispatch('clearUser');
        router.push({ name: 'signup' });
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    return { user, logout, cartCount, isMenuOpen, toggleMenu };
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
