import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/tailwind.css';
import './firebase';
import FontAwesomeIcon from './plugins/font-awesome';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import sw from './locales/sw.json';
import yo from './locales/yo.json';
import ar from './locales/ar.json';

// Load user from local storage on app initialization
const userFromStorage = JSON.parse(localStorage.getItem('user'));
if (userFromStorage) {
  store.dispatch('setUser', userFromStorage);
}

const messages = {en,sw,yo,ar
};

const i18n = createI18n({
  locale: 'yo', // default locale
  legacy: false, // Enables Composition API mode
  globalInjection: true, // Allows global use of $t and other i18n methods
  fallbackLocale: 'en',
  messages,
});

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app');
