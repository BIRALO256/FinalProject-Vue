import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/tailwind.css';
import './firebase';
import FontAwesomeIcon from './plugins/font-awesome';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app
  .use(router)
  .use(store)
  .mount('#app');
