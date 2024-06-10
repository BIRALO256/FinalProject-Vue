  <template>
    <div class="min-h-screen bg-gray-100">
      <AdminNavbar/>
      <div class="w-3/4 mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-8">Manage Products</h1>
        <div class="flex justify-between mb-4">
          <input v-model="searchQuery" type="text" placeholder="Search products..." class="form-input" />
          <select v-model="selectedCategory" class="form-select ml-4">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">Product Name:</label>
              <input v-model="product.name" type="text" placeholder="Name" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">Description:</label>
              <input v-model="product.description" type="text" placeholder="Description" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">Image URL:</label>
              <input v-model="product.imageUrl" type="text" placeholder="Image URL" class="form-input" />
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
          <h2 class="text-2xl font-bold mb-4">Products List</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="item in filteredProducts" :key="item.id" class="p-4 bg-white rounded-lg shadow">
              <img :src="item.imageUrl" alt="" class="w-full h-48 object-cover mb-2 rounded">
              <p class="font-semibold">{{ item.name }} - ${{ item.price }}</p>
              <div class="flex justify-between mt-2">
                <button @click="editProduct(item)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                  Edit
                </button>
                <button @click="deleteProduct(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { ref, computed } from 'vue';
  import { db } from '@/firebase';
  import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
          alert('Please fill in all fields correctly.');
          return;
        }
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

      return { products, product, handleSubmit, editProduct, deleteProduct, selectedCategory, categories, filteredProducts, searchQuery };
    }
  };
  </script>

  <style scoped>
  .form-input, .form-select {
    padding: 0.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    width: 100%;
  }
  </style>