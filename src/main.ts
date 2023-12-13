import './assets/main.css'
import { createApp } from 'vue'
import { Button, message } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Button).mount('#app')
app.config.globalProperties.$message = message;
