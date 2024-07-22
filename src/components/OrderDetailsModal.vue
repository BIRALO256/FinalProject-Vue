    <template>
        <transition name="fade">
        <div v-if="visible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50" @click="handleBackdropClick">
            <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
            <button @click="close" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 class="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">Order Details</h2>
            <div v-if="order" class="space-y-4">
                <div class="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
                <img v-if="order.imageUrl" :src="order.imageUrl" alt="Product Image" class="w-24 h-24 object-cover rounded-md md:mr-4" />
                <div class="flex-1">
                    <p class="text-lg font-medium"><strong>Order #:</strong> {{ order.id }}</p>
                    <p><strong>Date:</strong> {{ formatDate(order.createdAt) }}</p>
                    <p><strong>Status:</strong> <span :class="statusClass">{{ order.status }}</span></p>
                    <p><strong>Total:</strong> ${{ order.total.toFixed(4) }}</p>
                </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Items:</h3>
                    <ul class="list-disc pl-5 space-y-2">
                        <li v-for="item in order.items" :key="item.id" class="flex items-center space-x-4">
                        <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" class="w-16 h-16 object-cover rounded-md" />
                        <span>{{ item.name }} - ${{ item.price.toFixed(4) }} x {{ item.quantity }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else>
                <p class="text-gray-500">No order details available.</p>
            </div>
            </div>
        </div>
        </transition>
    </template>
    
    <script>
    import { ref, onMounted, watch } from 'vue';
    import { db } from '@/firebase';
    import { doc, getDoc } from 'firebase/firestore';
    
    export default {
        props: {
        orderId: {
            type: String,
            required: true,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
        const order = ref(null);
    
        const fetchOrder = async () => {
            try {
            const orderRef = doc(db, 'order', props.orderId);
            const orderDoc = await getDoc(orderRef);
            if (orderDoc.exists()) {
                order.value = { id: orderDoc.id, ...orderDoc.data() };
            } else {
                console.log('No such order!');
            }
            } catch (error) {
            console.error('Error fetching order details:', error);
            }
        };
    
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        };
    
        const statusClass = (status) => {
            switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-600';
            case 'completed':
                return 'text-green-600';
            case 'canceled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
            }
        };
    
        watch(() => props.orderId, (newId) => {
            if (newId) fetchOrder();
        });
    
        const close = () => {
            emit('update:visible', false);
        };
    
        const handleBackdropClick = (event) => {
            if (event.target === event.currentTarget) {
            close();
            }
        };
    
        onMounted(() => {
            if (props.orderId) fetchOrder();
        });
    
        return {
            order,
            formatDate,
            close,
            statusClass,
            handleBackdropClick,
        };
        },
    };
    </script>
    
    <style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    </style>
    