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
  let token = localStorage.getItem("token")
  if (!token && to.name !== "login" && to.name !== "register") {
    router.push({ name: "login" })
  } else if ((to.name == "login" || to.name == "register") && token) {
    router.push({ name: "home" })
  } else {
    if (
      to.name == "register" &&
      !JSON.parse(localStorage.getItem("systemConfig") as string).allowResgister
    )
      router.push({ name: "home" })
    next()
  }
})

const app = createApp(App)

app.config.globalProperties.$icons = Icons
app.config.globalProperties.$aes_encrypt = AES_Encrypt
app.config.globalProperties.$aes_decrypt = AES_Decrypt
app.config.globalProperties.$message = message
app.config.globalProperties.$get = get
app.config.globalProperties.$post = post
app.config.globalProperties.$put = put
app.config.globalProperties.$del = del

nextTick(() => {
  for (const key in Icons) {
    // 把icons注册到全局
    app.component(key, Icons[key])
  }
})

app.use(router).use(createPinia()).mount("#app")
