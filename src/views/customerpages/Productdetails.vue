<template>
    <div>
      <h1>Product Details</h1>
      <!-- Display product details here -->
    </div>
  </template>
  
  <script>
  export default {
    props: ['id'], // Receive the id as a prop
  
    mounted() {
      console.log('Product ID:', this.id);
      // Fetch product details using this.id
    }
  };
  </script>