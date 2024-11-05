import './assets/main.css';
import axios from 'axios';

import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router)
});

app.use(pinia);
app.use(router);


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_WITH_CREDENTIALS ?? 'http://127.0.0.1:8000';

app.mount('#app');


// router.beforeEach((to, from, next) => {
//     const authStore = useAuth
// });
