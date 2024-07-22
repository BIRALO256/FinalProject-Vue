    <template>
        <div class="min-h-screen bg-gray-100">
        <CustomersNavbar />
        <div class="container mx-auto p-4">
            <h3 class="text-lg font-bold mb-6">Your Orders:</h3>
            <div v-if="orders.length" class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-lg rounded-lg">
                <thead class="bg-gray-200 text-gray-600 uppercase text-sm">
                <tr>
                    <th class="py-3 px-4 border-b">Order #</th>
                    <th class="py-3 px-4 border-b">Date</th>
                    <th class="py-3 px-4 border-b">Status</th>
                    <th class="py-3 px-4 border-b">Total</th>
                    <th class="py-3 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(order, index) in orders" :key="order.id" class="text-gray-700">
                    <td class="py-3 px-4 border-b">{{ index + 1 }}</td>
                    <td class="py-3 px-4 border-b">{{ formatDate(order.createdAt) }}</td>
                    <td class="py-3 px-4 border-b">{{ order.status }}</td>
                    <td class="py-3 px-4 border-b">${{ order.total }}</td>
                    <td class="py-3 px-4 border-b flex justify-center space-x-2">
                    <button
                        @click="viewDetails(order.id)"
                        class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    >
                        View Details
                    </button>
                    <button
                        @click="handleReorder(order)"
                        class="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                    >
                        Reorder
                    </button>
                    <router-link
                        :to="{ name: 'rating-details', params: { id: order.id } }"
                        class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    >
                        Rate
                    </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div v-else>
            <p class="text-gray-600">No orders found.</p>
            </div>
        </div>
        <!-- Order Details Modal -->
        <OrderDetailsModal :orderId="selectedOrderId" :visible="isModalVisible" @update:visible="isModalVisible = $event" />
        </div>
    </template>
    
    <script>
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    import OrderDetailsModal from '@/components/OrderDetailsModal.vue';
    import { db } from '@/firebase';
    import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { useStore } from 'vuex';
    
    export default {
        components: {
        CustomersNavbar,
        OrderDetailsModal,
        },
        setup() {
        const store = useStore();
        const orders = ref([]);
        const selectedOrderId = ref(null);
        const isModalVisible = ref(false);
    
        const fetchOrders = async () => {
            try {
            const userId = store.state.user.uid;
            orders.value = [];
            const q = query(collection(db, 'order'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            orders.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
            console.error('Error fetching orders:', error);
            }
        };
    
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        };
    
        const handleReorder = async (order) => {
            try {
            const newOrder = {
                ...order,
                createdAt: new Date().toISOString(),
                status: 'Pending',
            };
            delete newOrder.id; // Remove the original order ID
            await addDoc(collection(db, 'order'), newOrder);
            alert('Order has been placed successfully.');
            fetchOrders(); // Refresh orders list
            } catch (error) {
            console.error('Error reordering:', error);
            alert('Failed to reorder. Please try again.');
            }
        };
    
        const viewDetails = (orderId) => {
            selectedOrderId.value = orderId;
            isModalVisible.value = true;
        };
    
        onMounted(() => {
            fetchOrders();
        });
    
        return {
            orders,
            formatDate,
            handleReorder,
            viewDetails,
            selectedOrderId,
            isModalVisible,
        };
        },
    };
    </script>
    