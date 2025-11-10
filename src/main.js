import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

import { useThemeStore } from '@/stores/theme'
useThemeStore().init() // <- apply system/default theme before mount

app.use(router).mount('#app')