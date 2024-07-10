    <template>
        <div class="relative">
        <select v-model="selectedCurrency" @change="handleChange" class="appearance-none bg-gray-600 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clip-rule="evenodd" />
            </svg>
        </div>
        </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { useStore } from 'vuex';
    
    const store = useStore();
    const selectedCurrency = ref(store.state.currency); // Bind selectedCurrency to Vuex state
    
    const handleChange = () => {
        store.dispatch('setCurrency', selectedCurrency.value); // Dispatch action to update currency
    };
    </script>
    
    <style scoped>
    /* No additional scoped styles needed for this component */
    </style>
    