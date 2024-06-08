<template>
    <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center max-w-4xl">
        <div>
            <router-link :to="{name:'feed'}" class="text-lg hover:text-gray-300 mr-4">Products</router-Link>
            <router-link :to="{name: 'users'}" class="text-lg hover:text-gray-300">System Users</router-Link>
        </div>
        <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Logout
        </button>
    </div>
   </nav>
  </template>
  
  <script>
  import { getAuth, signOut } from 'firebase/auth';
  
  export default {
    methods: {
      logout() {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Redirect to login page or do other cleanup
          this.$router.push({ name: 'signup' });
        }).catch((error) => {
          console.error('Logout failed:', error);
        });
      }
    }
  }
  </script>
  
  <style>




  </style>