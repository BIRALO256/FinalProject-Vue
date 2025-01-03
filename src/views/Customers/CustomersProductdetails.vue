  <template>
    <CustomersNavbar />
    <div class="container mx-auto p-4">
      <div v-if="loading" class="text-center">
        <p>{{ translated.loading }}</p>
      </div>
      <div v-else-if="product" class="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-cover mb-4 rounded" />
        <h1 class="text-2xl font-bold mb-2">{{ translated.name }}</h1>
        <p class="text-gray-700 mb-4">{{ translated.description }}</p>
        <div class="mb-2">
          <span class="text-gray-900 font-bold">{{ translated.categoryLabel }}:</span>
          <span class="text-gray-600">{{ product.category }}</span>
        </div>
        <div class="mb-2">
          <span class="text-gray-900 font-bold">{{ translated.priceLabel }}:</span>
          <span class="text-gray-600">${{ product.price }}</span>
        </div>
        <div class="mb-2">
          <span class="text-gray-900 font-bold">{{ translated.stockLabel }}:</span>
          <span class="text-gray-600">{{ product.stock }}</span>
        </div>
        <button
          @click="addToCart(product)"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          {{ translated.addToCart }}
        </button>
        <button
          @click="toggleChat"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
        >
          {{ translated.chatWithSupplier }}
        </button>
        <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>

        <!-- Chat Component -->
        <ChatComponent v-if="isChatOpen" :supplierId="product.supplierId" />
      </div>
      <div v-else class="text-center">
        <p>{{ translated.noProductFound }}</p>
      </div>
    </div>
  </template>

  <script>
  import { db } from '@/firebase';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMounted, ref, watch } from 'vue';
  import CustomersNavbar from '../../components/CustomersNavbar.vue';
  import ChatComponent from '../../components/ChatComponent.vue';
  import { useStore } from 'vuex';
  import { translateText } from '@/utils/translate';

  export default {
    components: {
      CustomersNavbar,
      ChatComponent
    },
    props: ['id'],

    setup(props) {
      const store = useStore();
      const product = ref(null);
      const loading = ref(false);
      const message = ref('');
      const isChatOpen = ref(false); // State to track chat visibility
      const translated = ref({
        loading: 'Loading product details...',
        name: '',
        description: '',
        categoryLabel: 'Category',
        priceLabel: 'Price',
        stockLabel: 'Stock',
        addToCart: 'Add to Cart',
        noProductFound: 'No product found.',
        chatWithSupplier: 'Chat with Supplier'
      });

      const fetchProductDetails = async () => {
        loading.value = true;
        try {
          const docRef = doc(db, 'products', props.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            product.value = docSnap.data();
            await translateProductDetails();
          } else {
            console.error('No such product!');
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        } finally {
          loading.value = false;
        }
      };

      const translateProductDetails = async () => {
        const language = store.state.language;
        if (product.value) {
          translated.value.name = await translateText(product.value.name, language);
          translated.value.description = await translateText(product.value.description, language);
          translated.value.categoryLabel = await translateText('Category', language);
          translated.value.priceLabel = await translateText('Price', language);
          translated.value.stockLabel = await translateText('Stock', language);
          translated.value.addToCart = await translateText('Add to Cart', language);
          translated.value.noProductFound = await translateText('No product found.', language);
          translated.value.chatWithSupplier = await translateText('Chat with Supplier', language);
        }
      };

      const addToCart = (product) => {
        // Add to cart logic here
        message.value = 'Product added to cart!';
        setTimeout(() => {
          message.value = '';
        }, 3000);
      };

      const toggleChat = () => {
        isChatOpen.value = !isChatOpen.value;
      };

      onMounted(() => {
        fetchProductDetails();
      });

      watch(() => store.state.language, fetchProductDetails);

      return {
        product,
        loading,
        message,
        addToCart,
        translated,
        isChatOpen,
        toggleChat
      };
    }
  };
  </script>

  <style scoped>
  .container {
    max-width: 600px;
  }
  </style>
