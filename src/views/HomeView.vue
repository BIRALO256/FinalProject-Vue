<template>
  <div class="min-h-screen bg-gray-100">
    <AdminNavbar />
    <div class="w-full md:w-3/4 mx-auto p-4 md:p-6">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Manage Products</h1>
      <div class="flex flex-col md:flex-row justify-between mb-4 md:space-x-4">
        <input v-model="searchQuery" type="text" placeholder="Search products..." class="form-input w-full md:w-1/2 mb-2 md:mb-0" />
        <select v-model="selectedCategory" class="form-select w-full md:w-1/4">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <form @submit.prevent="handleSubmit" class="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Product Name:</label>
            <input v-model="product.name" type="text" placeholder="Name" class="form-input" />
          </div>
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Description:</label>
            <input v-model="product.description" type="text" placeholder="Description" class="form-input" />
          </div>
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Image:</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="form-input" />
          </div>
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Category:</label>
            <input v-model="product.category" type="text" placeholder="Category" class="form-input" />
          </div>
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Price ($):</label>
            <input v-model="product.price" type="number" placeholder="Price" class="form-input" min="0" />
          </div>
          <div class="flex flex-col">
            <label class="font-medium text-gray-700">Stock:</label>
            <input v-model="product.stock" type="number" placeholder="Stock" class="form-input" min="0" />
          </div>
        </div>
        <button type="submit" class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>

      <div class="mt-6">
        <h2 class="text-xl md:text-2xl font-bold mb-4">Products List</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2">Image</th>
                <th class="py-2">Name</th>
                <th class="py-2">Price</th>
                <th class="py-2">Category</th>
                <th class="py-2">Stock</th>
                <th class="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredProducts" :key="item.id" class="border-t">
                <td class="py-2">
                  <img :src="item.imageUrl" alt="" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="py-2">{{ item.name }}</td>
                <td class="py-2">{{ item.price }}</td>
                <td class="py-2">{{ item.category }}</td>
                <td class="py-2">{{ item.stock }}</td>
                <td class="py-2 flex items-center justify-center md:justify-start space-x-2">
                  <button @click="editProduct(item)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded flex items-center">
                    <i class="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button @click="deleteProduct(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center">
                    <i class="fas fa-trash-alt mr-1"></i> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { db, storage } from '@/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import AdminNavbar from '@/components/AdminNavbar.vue';

export default {
  components: {
    AdminNavbar
  },
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
    const selectedCategory = ref('');
    const searchQuery = ref('');
    const categories = computed(() => {
      const cats = new Set(products.value.map(p => p.category));
      return Array.from(cats);
    });
    const filteredProducts = computed(() => {
      return products.value.filter(p => {
        return (p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
              (!selectedCategory.value || p.category === selectedCategory.value);
      });
    });

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const handleSubmit = async () => {
      if (!product.value.name || !product.value.price || !product.value.description || !product.value.imageUrl || !product.value.category || product.value.stock === undefined) {
        alert('All fields must be filled out correctly.');
        return;
      }
      const productsCol = collection(db, 'products');
      if (editId.value) {
        const productDoc = doc(db, 'products', editId.value);
        await updateDoc(productDoc, product.value);
        alert('Product updated successfully.');
      } else {
        await addDoc(productsCol, product.value);
        alert('Product added successfully.');
      }
      product.value = { name: '', price: 0, description: '', imageUrl: '', category: '', stock: 0 };
      editId.value = null;
      fetchProducts();
    };

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        alert('No file selected.');
        return;
      }
      const storageReference = storageRef(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageReference, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress here
        },
        (error) => {
          alert('Failed to upload image: ' + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            product.value.imageUrl = downloadURL;
            alert('Image uploaded successfully.');
          });
        }
      );
    };

    const editProduct = (item) => {
      product.value = { ...item };
      editId.value = item.id;
    };

    const deleteProduct = async (id) => {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      alert('Product deleted successfully.');
      fetchProducts();
    };

    fetchProducts();

    return { products, product, handleSubmit, editProduct, deleteProduct, selectedCategory, categories, filteredProducts, searchQuery, handleImageUpload };
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.form-input, .form-select {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #f3f4f6;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9fafb;
}

button {
  display: flex;
  align-items: center;
}
</style>
