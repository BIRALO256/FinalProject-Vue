<template>
  <div>
    <CustomersNavbar/>

    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to Our Store</h1>
      <div v-if="loading" class="text-center">
        <p>Loading products...</p> <!-- Consider replacing with a spinner -->
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="border p-4 rounded-lg shadow-lg bg-white">
          <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
          <h2 class="text-lg font-bold text-gray-900">{{ product.name }}</h2>
          <p class="text-xl font-semibold text-gray-800">${{ product.price }}</p>
          <button @click="addToCart(product)" class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded block w-full text-center mt-2">
            Add to Cart
          </button>
          <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="mt-2 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded block text-center">
            Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import CustomersNavbar from '../../components/CustomersNavbar.vue';


export default {

    components: {
      CustomersNavbar,
      
    },

    setup() {
    const products = ref([]);
    const loading = ref(false);  // Initialize loading state as false

    const fetchProducts = async () => {
      loading.value = true;  // Set loading to true when fetch starts
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Handle errors, e.g., show an error message
      } finally {
        loading.value = false;  // Set loading to false when fetch completes
      }
    };

    onMounted(fetchProducts);

    return { products, loading };
  }
};
</script>

<style>
.container {
  max-width: 1200px;
}
.border {
  border-color: #e2e8f0;
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.rounded {
  border-radius: 0.5rem;
}
</style>