import "./assets/main.css"
import { createApp } from "vue"
import { nextTick } from "@vue/runtime-core"
import { message } from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import { createPinia } from "pinia"
import { get, post, put, del } from "@/api/api"
import { AES_Encrypt, AES_Decrypt } from "@/util/aes"
// 引入icon
import * as Icons from "@ant-design/icons-vue"

import App from "./App.vue"
import router from "./router"

//路由拦截
router.beforeEach((to, from, next) => {
  let SSOAuth = localStorage.getItem("token")
  // 只有生产环境才会强制登录
  if (!SSOAuth && to.name !== "login" && import.meta.env.VITE_NODE_ENV === "production") {
    router.push({ name: "login" })
  } else {
    next()
  }
})

const app = createApp(App)

nextTick(() => {
  app.config.globalProperties.$icons = Icons
  app.config.globalProperties.$aes_encrypt = AES_Encrypt
  app.config.globalProperties.$aes_decrypt = AES_Decrypt
  app.config.globalProperties.$message = message
  app.config.globalProperties.$get = get
  app.config.globalProperties.$post = post
  app.config.globalProperties.$put = put
  app.config.globalProperties.$del = del
  for (const key in Icons) {
    // 把icons注册到全局
    app.component(key, Icons[key])
  }
})

app.use(router).use(createPinia()).mount("#app")
