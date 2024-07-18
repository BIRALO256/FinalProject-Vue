<template>
  <nav class="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
    <div class="container mx-auto flex justify-between items-center max-w-7xl">
      <div>
        <router-link :to="{name:'feed'}" class="text-lg hover:text-gray-300 mr-4 hidden md:inline">{{ $t('navbar.products') }}</router-link>
        <router-link :to="{name: 'users'}" class="text-lg hover:text-gray-300 mr-4 hidden md:inline">{{ $t('navbar.systemUsers') }}</router-link>
      </div>
      <div class="flex items-center">
        <span v-if="user" class="mr-4 hidden md:inline">{{ $t('navbar.hello') }} {{ user.displayName }}</span>
        <router-link v-if="user" :to="{ name: 'profile' }" class="text-lg hover:text-gray-300 mr-4 hidden md:inline">{{ $t('navbar.profile') }}</router-link>
        <button v-if="user" @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out hidden md:inline">
          {{ $t('navbar.logout') }}
        </button>
        <LanguageSelector class="hidden md:inline" />
        <button @click="toggleMenu" class="md:hidden">
          <span v-if="!menuOpen">☰</span>
          <span v-else>✖</span>
        </button>
      </div>
    </div>
    <div v-if="menuOpen" class="md:hidden">
      <router-link @click="toggleMenu" :to="{name:'feed'}" class="block text-lg hover:text-gray-300 p-4">{{ $t('navbar.products') }}</router-link>
      <router-link @click="toggleMenu" :to="{name: 'users'}" class="block text-lg hover:text-gray-300 p-4">{{ $t('navbar.systemUsers') }}</router-link>
      <span v-if="user" class="block text-lg p-4">{{ $t('navbar.hello') }} {{ user.displayName }}</span>
      <router-link @click="toggleMenu" v-if="user" :to="{ name: 'profile' }" class="block text-lg hover:text-gray-300 p-4">{{ $t('navbar.profile') }}</router-link>
      <button @click="logout" class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full">
        {{ $t('navbar.logout') }}
      </button>
      <LanguageSelector class="p-4" />
    </div>
  </nav>
  <!-- Adding a placeholder div to offset the height of the fixed navbar -->
  <div class="h-16"></div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import LanguageSelector from './LanguageSelector.vue';

export default {
  components: {
    LanguageSelector,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const menuOpen = ref(false);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const logout = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        store.dispatch('clearUser');
        router.push({ name: 'signup' });
        menuOpen.value = false;
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    };

    return { user, logout, menuOpen, toggleMenu };
  }
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
