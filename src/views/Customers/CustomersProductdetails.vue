<template>
  <CustomersNavbar/>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else-if="product" class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
      <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
      <p class="text-gray-700 mb-2">{{ product.description }}</p>
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
    </div>
    <div v-else class="text-center">
      <p>No product found.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CustomersNavbar from '../../components/CustomersNavbar.vue';

export default {
  components: {
      CustomersNavbar,
    },
  props: ['id'],

  setup(props) {
    const product = ref(null);
    const loading = ref(false);

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

    onMounted(fetchProductDetails);

    return { product, loading };
  }
};
</script>

<style>
.container {
  max-width: 1200px;
}
</style>
