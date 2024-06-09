    <template>
        <div>
        <CustomersNavbar/>
        <div class="container mx-auto p-6">
            <h1 class="text-3xl font-bold mb-8 text-center">Checkout</h1>
            <div v-if="cart && cart.length > 0">
            <div class="cart-items bg-white shadow-lg rounded-lg p-6 mb-8">
                <div class="cart-item flex items-center justify-between border-b border-gray-300 pb-4 mb-4" v-for="item in cart" :key="item.id">
                <img :src="item.imageUrl" alt="Product Image" class="w-24 h-24 object-cover rounded">
                <div class="item-details flex-grow ml-4">
                    <h2 class="text-xl font-semibold">{{ item.name }}</h2>
                    <p class="text-gray-600">${{ item.price }} x {{ item.quantity }}</p>
                    <p class="font-bold">Subtotal: ${{ item.price * item.quantity }}</p>
                </div>
                </div>
                <div class="total text-right">
                <h3 class="text-2xl font-bold">Total: ${{ total }}</h3>
                </div>
            </div>
            <div class="flex justify-end space-x-4">
                <button @click="clearCart" class="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded transition duration-300">
                Clear Cart
                </button>
                <router-link to="/payment" class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded transition duration-300">
                Proceed to Payment
                </router-link>
            </div>
            </div>
            <p v-else class="text-center text-xl">Your cart is empty.</p>
        </div>
        </div>
    </template>
    
    <script>
    import { computed } from 'vue';
    import { useStore } from 'vuex';
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    
    export default {
        name: 'CheckOut',
        components: {
        CustomersNavbar
        },
        setup() {
        const store = useStore();
        const cart = computed(() => store.state.cart);
        const total = computed(() => {
            return cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
        });
    
        const clearCart = () => {
            store.dispatch('clearCart');
        };
    
        return { cart, total, clearCart };
        }
    };
    </script>
    
    <style scoped>
    .container {
        max-width: 2xl;
    }
    .cart-items {
        border: 1px solid #e2e8f0;
    }
    .cart-item {
        display: flex;
        align-items: center;
    }
    .item-details {
        flex-grow: 1;
        padding: 0 20px;
    }
    .total {
        font-size: 1.2rem;
        font-weight: bold;
        margin-top: 20px;
    }
    </style>