<template>
  <nav class="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
    <div class="container mx-auto flex justify-between items-center max-w-4xl">
      <div>
        <router-link :to="{name:'feed'}" class="text-lg hover:text-gray-300 mr-4">Products</router-link>
        <router-link :to="{name: 'users'}" class="text-lg hover:text-gray-300 mr-4">System Users</router-link>
      </div>
      <div class="flex items-center">
        <span v-if="user" class="mr-4">Hello, {{ user.displayName }}</span>
        <router-link v-if="user" :to="{ name: 'profile' }" class="text-lg hover:text-gray-300 mr-4">Profile</router-link>
        <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
          Logout
        </button>
      </div>
    </div>
  </nav>
  <!-- Adding a placeholder div to offset the height of the fixed navbar -->
  <div class="h-16"></div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);

    const logout = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        store.dispatch('clearUser');
        router.push({ name: 'signup' });
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    };

    return { user, logout };
  }
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
