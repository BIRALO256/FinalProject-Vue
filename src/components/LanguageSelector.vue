    <template>
        <div class="language-selector">
        <select v-model="selectedLanguage" @change="changeLanguage">
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="yo">Yoruba</option>
            <option value="ar">Arabic</option>
        </select>
        </div>
    </template>
    
    <script>
    import { useStore } from 'vuex';
    import { useI18n } from 'vue-i18n';
    import { ref, watch } from 'vue';
    
    export default {
        setup() {
        const store = useStore();
        const { locale } = useI18n();
        
        // Initialize selectedLanguage as a ref
        const selectedLanguage = ref(store.state.language);
    
        // Watch for changes in the store language state
        watch(() => store.state.language, (newLang) => {
            selectedLanguage.value = newLang;
            locale.value = newLang; // Update Vue I18n locale
        });
    
        const changeLanguage = (event) => {
            const newLanguage = event.target.value;
            store.dispatch('setLanguage', newLanguage);
            locale.value = newLanguage; // Update Vue I18n locale
        };
    
        return {
            selectedLanguage,
            changeLanguage
        };
        }
    };
    </script>
    
    <style scoped>
    .language-selector select {
        padding: 0.5rem;
        border: 1px solid #161212;
        border-radius: 4px;
    }
    </style>
    