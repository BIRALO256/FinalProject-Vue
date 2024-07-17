    <template>
        <div class="min-h-screen bg-gray-100">
        <CustomersNavbar />
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">My Orders</h1>
            <div v-for="order in orders" :key="order.id" class="bg-white p-6 rounded-lg shadow-lg mb-4">
            <h2 class="text-xl font-bold mb-2">Order #{{ order.id }}</h2>
            <div class="mb-4">
                <h3 class="text-lg font-bold">Products:</h3>
                <ul>
                <li v-for="item in order.items" :key="item.id">{{ item.name }} - {{ item.quantity }} x ${{ item.price }}</li>
                </ul>
            </div>
            <p class="mb-4">Total: ${{ order.total.toFixed(2) }}</p>
            <p class="mb-4">Status: {{ order.status }}</p>
    
            <div v-if="order.status === 'paid'" class="mb-4">
                <h3 class="text-lg font-bold">Rate the Products:</h3>
                <div v-for="item in order.items" :key="item.id">
                <p>{{ item.name }}</p>
                <ProductRating :productId="item.id" />
                </div>
            </div>
    
            <div v-if="order.status === 'paid'" class="mb-4">
                <h3 class="text-lg font-bold">Rate the Supplier:</h3>
                <SupplierRating :supplierId="order.supplierId" />
            </div>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import { ref, onMounted } from 'vue';
    import { db } from '@/firebase';
    import { collection, query, where, getDocs } from 'firebase/firestore';
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    import ProductRating from '@/components/ProductRating.vue';
    import SupplierRating from '@/components/SupplierRating.vue';
    import { useStore } from 'vuex';
    
    export default {
        components: {
        CustomersNavbar,
        ProductRating,
        SupplierRating,
        },
        setup() {
        const orders = ref([]);
        const store = useStore();
    
        const fetchOrders = async () => {
            const userId = store.state.user.uid;
            orders.value = []; // Clear previous orders
            const q = query(collection(db, 'order'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            orders.value.push({ id: doc.id, ...doc.data() });
            });
        };
    
        onMounted(() => {
            fetchOrders();
        });
    
        return { orders };
        }
    };
    </script>
    
    <style scoped>
    /* Add any custom styles if necessary */
    </style>
    