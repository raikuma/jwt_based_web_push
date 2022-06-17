if (localStorage.getItem('token') === null) {
  window.location = '/login'
}

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
