import "./assets/main.css"
import { createApp } from "vue"
import { nextTick } from "@vue/runtime-core"
import { Button, message } from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import { createPinia } from "pinia"
// 引入icon
import * as Icons from "@ant-design/icons-vue"

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

// 把icons注册到全局
// Object.keys(Icons).forEach(key => {
//     app.component(key, Icons[key])
// })

app.use(createPinia())
app.use(router)

app.use(Button).mount("#app")

nextTick(() => {
  app.config.globalProperties.$icons = Icons
  app.config.globalProperties.$message = message
  for (const key in Icons) {
    app.component(key, Icons[key])
  }
})
