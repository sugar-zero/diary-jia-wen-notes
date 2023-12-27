import "./assets/main.css"
import { createApp, nextTick } from "vue"
import { message } from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import { createPinia } from "pinia"
import { get, post, put, del, patch } from "@/api/api"
import { aes_encrypt, aes_decrypt } from "@/util/aes"
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
app.config.globalProperties.$aes_decrypt = aes_decrypt
app.config.globalProperties.$aes_encrypt = aes_encrypt
app.config.globalProperties.$message = message
app.config.globalProperties.$get = get
app.config.globalProperties.$post = post
app.config.globalProperties.$put = put
app.config.globalProperties.$del = del
app.config.globalProperties.$patch = patch

nextTick(() => {
  for (const key in Icons) {
    // 把icons注册到全局
    // @ts-ignore
    app.component(key, Icons[key])
  }
})

app.use(router).use(createPinia()).mount("#app")
