import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font/iconfont.css' // 引入字体图标

createApp(App).use(store).use(router).mount('#app')
