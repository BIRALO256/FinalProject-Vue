    // store/index.js
    import { createStore } from 'vuex';

    const store = createStore({
    state: {
        user: null,
        cart: [],
        language: 'yo' // Default language
    },
    mutations: {
        setUser(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user)); // Save user to local storage
        },
        clearUser(state) {
        state.user = null;
        localStorage.removeItem('user'); // Remove user from local storage
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
            const index = state.cart.findIndex(item => item.id === productId);
            if (index !== -1) {
            state.cart.splice(index, 1);
            }
        }
        },
        clearCart(state) {
        state.cart = [];
        },
        setLanguage(state, language) {
        state.language = language;
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
        },
        setLanguage({ commit }, language) {
        commit('setLanguage', language);
        }
    }
    });

    export default store;
