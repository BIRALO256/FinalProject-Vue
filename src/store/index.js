    import { createStore } from 'vuex';
    import axios from 'axios';


    const API_KEY = 'cfea45004ca19fb59b7bb747'; // Replace with your actual API key
    const BASE_URL = 'https://5cd7-41-75-191-117.ngrok-free.app';

    const store = createStore({
    state: {
        user: null,
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        language: 'en',
        currency: 'USD',
        baseCurrency: 'USD',
        exchangeRates: {},
    },
    mutations: {
        setUser(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        },
        clearUser(state) {
        state.user = null;
        localStorage.removeItem('user');
        },
        addToCart(state, product) {
        const existingProduct = state.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeFromCart(state, productId) {
        const index = state.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            state.cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
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
        localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        setLanguage(state, language) {
        state.language = language;
        },
        setCurrency(state, currency) {
        state.currency = currency;
        localStorage.setItem('currency', currency);
        },
        setExchangeRates(state, rates) {
        state.exchangeRates = rates;
        },
    },
    
        actions: {
        async fetchExchangeRates({ commit, state }) {
        try {
            const response = await axios.get(`${BASE_URL}/${state.baseCurrency}`, {
            params: {
                api_key: API_KEY,
            },
            });
            const allRates = response.data.rates;

            // Define the currencies of interest
            const currenciesOfInterest = ['KES', 'UGX', 'TZS', 'NGN','USD','EUR','GBP','INR'];

            // Filter the rates to include only the currencies of interest
            const filteredRates = Object.keys(allRates)
            .filter(key => currenciesOfInterest.includes(key))
            .reduce((obj, key) => {
                obj[key] = allRates[key];
                return obj;
            }, {});

            commit('setExchangeRates', filteredRates);
            return filteredRates;
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            return {};
        }
        },

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
        },
        async setCurrency({ commit, dispatch }, currency) {
        commit('setCurrency', currency);
        await dispatch('fetchExchangeRates');
        },
    },
    });

    // Initialize currency and fetch exchange rates
    const currencyFromStorage = localStorage.getItem('currency');
    if (currencyFromStorage) {
    store.commit('setCurrency', currencyFromStorage);
    }
    store.dispatch('fetchExchangeRates');

    export default store;
