<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
    <CustomersNavbar />
    <div class="text-center p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
      <p class="text-lg text-gray-700 mb-6">Oops! The page you are looking for has vanished or does not exist.</p>
      <router-link to="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Homepage
      </router-link>
      <router-link to="/about" class="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Learn More About Us
      </router-link>
    </div>
  </div>
</template>

<script>
import CustomersNavbar from '@/components/CustomersNavbar.vue';

export default {
  components: {
    CustomersNavbar
  }
}
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>