import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/tailwind.css';
import './firebase';
import FontAwesomeIcon from './plugins/font-awesome';

// Load user from local storage on app initialization
const userFromStorage = JSON.parse(localStorage.getItem('user'));
if (userFromStorage) {
  store.dispatch('setUser', userFromStorage);
}

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app
  .use(router)
  .use(store)
  .mount('#app');
