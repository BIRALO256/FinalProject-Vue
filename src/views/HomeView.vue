  <template>
    <div class="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div class="w-full md:w-3/4 mx-auto p-4 md:p-6">
        <h1 class="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">{{ $t('manageProductsTitle') }}</h1>
        <div class="flex flex-col md:flex-row justify-between mb-4 md:space-x-4">
          <input v-model="searchQuery" type="text" :placeholder="$t('searchPlaceholder')" class="form-input w-full md:w-1/2 mb-2 md:mb-0" />
          <select v-model="selectedCategory" class="form-select w-full md:w-1/4">
            <option value="">{{ $t('allCategories') }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <form @submit.prevent="handleSubmit" class="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('productName') }}</label>
              <input v-model="product.name" type="text" :placeholder="$t('productName')" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('description') }}:</label>
              <input v-model="product.description" type="text" :placeholder="$t('description')" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('image') }}</label>
              <input type="file" @change="handleImageUpload" accept="image/*" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('category') }}</label>
              <input v-model="product.category" type="text" :placeholder="$t('category')" class="form-input" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('price') }}:</label>
              <input v-model="product.price" type="number" :placeholder="$t('price')" class="form-input" min="0" />
            </div>
            <div class="flex flex-col">
              <label class="font-medium text-gray-700">{{ $t('stock') }}:</label>
              <input v-model="product.stock" type="number" :placeholder="$t('stock')" class="form-input" min="0" />
            </div>
          </div>
          <button type="submit" class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {{ $t('submit') }}
          </button>
        </form>

        <div class="mt-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4">{{ $t('productsList') }}</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr>
                  <th class="py-2">{{ $t('image') }}</th>
                  <th class="py-2">{{ $t('name') }}</th>
                  <th class="py-2">{{ $t('price') }}</th>
                  <th class="py-2">{{ $t('category') }}</th>
                  <th class="py-2">{{ $t('stock') }}</th>
                  <th class="py-2">{{ $t('actions') }}</th>
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
                      <i class="fas fa-edit mr-1"></i> {{ $t('edit') }}
                    </button>
                    <button @click="deleteProduct(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center">
                      <i class="fas fa-trash-alt mr-1"></i> {{ $t('delete') }}
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
  import { ref, computed, onMounted } from 'vue';
  import { db, storage, getAuth } from '@/firebase';
  import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import { useI18n } from 'vue-i18n';

  export default {
    components: {
      AdminNavbar
    },
    setup() {
      const { t } = useI18n();
      const products = ref([]);
      const auth = getAuth();
      const user = auth.currentUser;
      const product = ref({
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        category: '',
        stock: 0,
        supplierId: user ? user.uid : null,
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
          alert(t('fillAllFields'));
          return;
        }
        if (user) {
          product.value.supplierId = user.uid;
        }
        const productsCol = collection(db, 'products');
        if (editId.value) {
          const productDoc = doc(db, 'products', editId.value);
          await updateDoc(productDoc, product.value);
          alert(t('productUpdated'));
        } else {
          await addDoc(productsCol, product.value);
          alert(t('productAdded'));
        }
        product.value = { name: '', price: 0, description: '', imageUrl: '', category: '', stock: 0, supplierId: user ? user.uid : null };
        editId.value = null;
        fetchProducts();
      };

      const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
          alert(t('noFileSelected'));
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
            alert(t('uploadFailed', { error: error.message }));
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              product.value.imageUrl = downloadURL;
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
        fetchProducts();
        alert(t('productDeleted'));
      };

      onMounted(fetchProducts);

      return {
        t,
        products,
        product,
        selectedCategory,
        searchQuery,
        categories,
        filteredProducts,
        handleSubmit,
        handleImageUpload,
        editProduct,
        deleteProduct
      };
    }
  };
  </script>

  <style scoped>
  /* Your styles here */
  </style>
