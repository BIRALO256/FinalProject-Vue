<template>
  <nav class="bg-gray-800 text-white p-4 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center max-w-7xl">
      <!-- Logo and main links -->
      <div class="flex items-center space-x-4">
        <router-link :to="{ name: 'about' }" class="text-lg hover:text-gray-300 flex items-center">
          <font-awesome-icon icon="list" class="mr-2" />{{ $t('navbar.products') }}
        </router-link>
        <div class="relative flex items-center">
          <router-link :to="{ name: 'cart' }" class="text-lg hover:text-gray-300 flex items-center">
            <font-awesome-icon icon="shopping-cart" class="mr-2" />{{ $t('navbar.cart') }}
            <span v-if="cartCount > 0" class="ml-2 bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs">
              {{ cartCount }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Mobile menu toggle button -->
      <button class="md:hidden text-lg hover:text-gray-300" @click="toggleMenu">
        <font-awesome-icon icon="bars" />
      </button>

      <!-- Menu items (desktop & mobile) -->
      <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="w-full md:flex md:w-auto md:items-center md:space-x-4 mt-4 md:mt-0">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <!-- User greeting -->
          <span v-if="user" class="text-lg">{{ $t('navbar.hello') }} {{ user.displayName }}</span>
          <!-- Checkout -->
          <router-link :to="{ name: 'checkout' }" class="text-lg hover:text-gray-300 flex items-center">
            <font-awesome-icon icon="cash-register" class="mr-2" />{{ $t('navbar.checkout') }}
          </router-link>

          <router-link :to="{ name: 'Order' }" class="text-lg hover:text-gray-300 flex items-center">
              Orders
            </router-link>
          <!-- Profile & Logout -->
          <template v-if="user">
            <router-link :to="{ name: 'profile' }" class="text-lg hover:text-gray-300 flex items-center">
              <font-awesome-icon icon="user" class="mr-2" />
            </router-link>
            
            <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center">
              <font-awesome-icon icon="sign-out-alt" class="mr-2" />
              <!-- {{ $t('navbar.logout') }} -->
            </button>
          </template>

          <!-- Sign Up -->
          <router-link v-else :to="{ name: 'signup' }" class="text-lg hover:text-gray-300 flex items-center">
            <font-awesome-icon icon="user-plus" class="mr-2" />{{ $t('navbar.signUp') }}
          </router-link>

          <!-- Language Selector -->
          <LanguageSelector />
          <CurrencySelector/>
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
import { useI18n } from 'vue-i18n'; // Import useI18n hook for translation

import LanguageSelector from './LanguageSelector.vue';
import CurrencySelector from './CurrencySelector.vue';

export default {
  components: {
    LanguageSelector,
    CurrencySelector,
  },
  setup() {
    const { t } = useI18n(); // Access translation function t() from useI18n hook
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

    return { user, logout, cartCount, isMenuOpen, toggleMenu, t };
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
