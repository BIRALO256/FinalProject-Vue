<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome to Our Store</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id" class="border p-4 rounded-lg shadow-lg">
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
        <h2 class="text-lg font-bold">{{ product.name }}</h2>
        <p>{{ truncatedDescription(product.description) }}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-xl font-semibold">${{ product.price }}</span>
          <div>
            <button @click="addToCart(product)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
            <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"  >
          Details
          </router-link>
          </div>
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

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const addToCart = (product) => {
      console.log('Adding to cart:', product);
    };

    const truncatedDescription = (description) => {
      return description.split(" ").slice(0, 20).join(" ") + "...";
    };

    onMounted(fetchProducts);

    return { products, addToCart, truncatedDescription };
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