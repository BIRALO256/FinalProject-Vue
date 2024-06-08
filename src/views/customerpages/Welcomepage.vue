<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome to Our Store</h1>
    <div v-if="loading" class="text-center">
      <p>Loading products...</p> <!-- You can replace this with a spinner or any loading animation -->
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id" class="border p-4 rounded-lg shadow-lg">
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
        <h2 class="text-lg font-bold">{{ product.name }}</h2>
        <button @click="addToCart(product)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded block w-full text-center mt-2">
          Add to Cart
        </button>
        <div class="flex justify-between items-center mt-4">
          <span class="text-xl font-semibold">${{ product.price }}</span>
          <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
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

export default {
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