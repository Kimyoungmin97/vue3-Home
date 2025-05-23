import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.mount('#app')
