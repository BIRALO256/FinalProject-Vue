    import { createStore } from 'vuex';

    const store = createStore({
    state: {
        user: null,
        cart: []
    },
    mutations: {
        setUser(state, user) {
        state.user = user;
        },
        clearUser(state) {
        state.user = null;
        },
        addToCart(state, product) {
        const existingProduct = state.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
        },
        removeFromCart(state, productId) {
        const index = state.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            state.cart.splice(index, 1);
        }
        },
        decrementQuantity(state, productId) {
        const product = state.cart.find(item => item.id === productId);
        if (product && product.quantity > 1) {
            product.quantity--;
        } else {
            // Optionally remove the item if the quantity is 1 or less
            const index = state.cart.findIndex(item => item.id === productId);
            if (index !== -1) {
            state.cart.splice(index, 1);
            }
        }
        },
        clearCart(state) {
        state.cart = [];
        }
    },
    actions: {
        setUser({ commit }, user) {
        commit('setUser', user);
        },
        clearUser({ commit }) {
        commit('clearUser');
        },
        addToCart({ commit }, product) {
        commit('addToCart', product);
        },
        removeFromCart({ commit }, productId) {
        commit('removeFromCart', productId);
        },
        decrementQuantity({ commit }, productId) {
        commit('decrementQuantity', productId);
        },
        clearCart({ commit }) {
        commit('clearCart');
        }
    }
    });

    export default store;
