  <template>
    <div class="min-h-screen bg-gray-100">
      <CustomersNavbar/>

      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">{{ translated.welcome }}</h1>
        
        <!-- Search and Category Filter -->
        <div class="flex flex-col md:flex-row justify-between mb-6">
          <input v-model="searchQuery" type="text" :placeholder="translated.searchPlaceholder" class="form-input mb-4 md:mb-0 md:mr-4" />
          <select v-model="selectedCategory" class="form-select">
            <option value="">{{ translated.allCategories }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div v-if="loading" class="text-center">
          <p>{{ translated.loadingProducts }}</p> <!-- Consider replacing with a spinner -->
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="product in filteredProducts" :key="product.id" class="border p-4 rounded-lg shadow-lg bg-white">
            <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded">
            <h2 class="text-lg font-bold text-gray-900">{{ product.name }}</h2>
            <p class="text-xl font-semibold text-gray-800">{{ formatPrice(product.price) }}</p>
            <button @click="addToCart(product)" class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded block w-full text-center mt-2">
              {{ translated.addToCart }}
            </button>
            <router-link :to="{ name: 'product-details', params: { id: product.id } }" class="mt-2 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded block text-center">
              {{ translated.productDetails }}
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="message" class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded">
        {{ message }}
      </div>
    </div>
  </template>

  <script>
  import { ref, onMounted, computed, watch } from 'vue';
  import { db } from '@/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import CustomersNavbar from '../../components/CustomersNavbar.vue';
  import { useStore } from 'vuex';
  import { translateText } from '@/utils/translate';
  import axios from 'axios';

  export default {
    components: {
      CustomersNavbar,
    },
    setup() {
      const store = useStore();
      const products = ref([]);
      const loading = ref(false);
      const message = ref('');
      const selectedCategory = ref('');
      const searchQuery = ref('');
      const translated = ref({
        welcome: '',
        searchPlaceholder: '',
        allCategories: '',
        loadingProducts: '',
        addToCart: '',
        productDetails: ''
      });

      const fetchProducts = async () => {
        loading.value = true;
        try {
          const querySnapshot = await getDocs(collection(db, 'products'));
          products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          loading.value = false;
        }
      };

      const addToCart = (product) => {
        store.dispatch('addToCart', product);
        showMessage('Added to cart: ' + product.name);
      };

      const showMessage = (msg) => {
        message.value = msg;
        setTimeout(() => message.value = '', 3000); // Message disappears after 3 seconds
      };

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

      const translatePage = async () => {
        const language = store.state.language;
        try {
          translated.value.welcome = await translateText('Welcome to Our Store', language);
          translated.value.searchPlaceholder = await translateText('Search products...', language);
          translated.value.allCategories = await translateText('All Categories', language);
          translated.value.loadingProducts = await translateText('Loading products...', language);
          translated.value.addToCart = await translateText('Add to Cart', language);
          translated.value.productDetails = await translateText('Details', language);
        } catch (error) {
          console.error('Error translating page:', error);
        }
      };

      onMounted(() => {
        fetchProducts();
        translatePage();
      });

      watch(() => store.state.language, () => {
        translatePage();
      });

        const formatPrice = (price) => {
    const rate = store.state.exchangeRates[store.state.currency];
    const convertedPrice = (price * rate).toFixed(4);
    
    switch (store.state.currency) {
      case 'USD':
        return `$${convertedPrice}`;
      case 'EUR':
        return `€${convertedPrice}`;
      case 'GBP':
        return `£${convertedPrice}`;
      case 'INR':
        return `₹${convertedPrice}`;
      default:
        return `${store.state.currency} ${convertedPrice}`;
    }
  };

      return {
        loading,
        message,
        selectedCategory,
        searchQuery,
        categories,
        filteredProducts,
        translated,
        addToCart,
        formatPrice,
      };
    },
  };
  </script>

  <style>
  /* Add your component-specific styles here */
  </style>
