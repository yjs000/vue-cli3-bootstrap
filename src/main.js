import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'

import { routes } from './routes';
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App)
.use(router)
.mount('#app')
