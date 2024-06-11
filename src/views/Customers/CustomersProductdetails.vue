<template>
  <CustomersNavbar/>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else-if="product" class="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
      <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
      <p class="text-gray-700 mb-4">{{ product.description }}</p>
      <div class="mb-2">
        <span class="text-gray-900 font-bold">Category:</span>
        <span class="text-gray-600">{{ product.category }}</span>
      </div>
      <div class="mb-2">
        <span class="text-gray-900 font-bold">Price:</span>
        <span class="text-gray-600">${{ product.price }}</span>
      </div>
      <div class="mb-2">
        <span class="text-gray-900 font-bold">Stock:</span>
        <span class="text-gray-600">{{ product.stock }}</span>
      </div>
      <button @click="addToCart(product)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add to Cart
      </button>
      <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    </div>
    <div v-else class="text-center">
      <p>No product found.</p>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import CustomersNavbar from '../../components/CustomersNavbar.vue';
import { useStore } from 'vuex';

export default {
  components: {
    CustomersNavbar,
  },
  props: ['id'],

  setup(props) {
    const store = useStore();
    const product = ref(null);
    const loading = ref(false);
    const message = ref('');

    const fetchProductDetails = async () => {
      loading.value = true;
      try {
        const docRef = doc(db, 'products', props.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          product.value = docSnap.data();
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        loading.value = false;
      }
    };

    const addToCart = (product) => {
      store.dispatch('addToCart', { ...product, quantity: 1 });
      message.value = 'Added to cart!';
      setTimeout(() => message.value = '', 3000); // Message disappears after 3 seconds
    };

    onMounted(fetchProductDetails);

    return { product, loading, addToCart, message };
  }
};
</script>

<style>
.container {
  max-width: 1200px;
}
</style>