<template>


  <nav>
    <router-link :to="{name:'feed'}">Products</router-link> |
    <router-link :to="{name: 'users'}" >System Users</router-link> 
  </nav>


  <div class="container mx-auto p-4 max-w-6xl bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Manage Products</h1>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <input v-model="product.name" type="text" placeholder="Name" class="input" />
      <div class="flex flex-col">
        <label for="price" class="font-medium text-gray-700">Price ($):</label>
        <input v-model="product.price" type="number" id="price" placeholder="Price" class="input" min="0" />
      </div>
      <input v-model="product.description" type="text" placeholder="Description" class="input" />
      <input v-model="product.imageUrl" type="text" placeholder="Image URL" class="input" />
      <input v-model="product.category" type="text" placeholder="Category" class="input" />
      <div class="flex flex-col">
        <label for="stock" class="font-medium text-gray-700">Stock:</label>
        <input v-model="product.stock" type="number" id="stock" placeholder="Stock" class="input" min="0" />
      </div>
      <button type="submit" class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-1 md:col-span-2 lg:col-span-3">Submit</button>

   </form>

    <div class="mt-8">
      <h2 class="text-lg font-bold text-gray-800 mb-3">Products List</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in products" :key="item.id" class="p-4 border rounded-lg shadow-sm">
          <img :src="item.imageUrl" alt="" class="w-full h-48 object-cover mb-2 rounded">
          <p class="font-semibold">{{ item.name }} - ${{ item.price }}</p>
          <div class="flex justify-between mt-2">
            <button @click="editProduct(item)" class="btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Edit</button>
            <button @click="deleteProduct(item.id)" class="btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { db } from '@/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
  setup() {
    const products = ref([]);
    const product = ref({
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      category: '',
      stock: 0
    });
    const editId = ref(null);

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const handleSubmit = async () => {
      const productsCol = collection(db, 'products');
      if (editId.value) {
        const productDoc = doc(db, 'products', editId.value);
        await updateDoc(productDoc, product.value);
      } else {
        await addDoc(productsCol, product.value);
      }
      product.value = { name: '', price: 0, description: '', imageUrl: '', category: '', stock: 0 };
      editId.value = null;
      fetchProducts();
    };

    const editProduct = (item) => {
      product.value = { ...item };
      editId.value = item.id;
    };

    const deleteProduct = async (id) => {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      fetchProducts();
    };

    fetchProducts();

    return { products, product, handleSubmit, editProduct, deleteProduct };
  }
};
</script>

<style>
.input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
}
.btn {
  padding: 0.5rem 1rem;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
}
.btn:hover {
  background-color: darkblue;
}
</style>