import "./assets/main.css"
import { createApp, nextTick } from "vue"
import "ant-design-vue/dist/reset.css"
import { createPinia } from "pinia"
// 引入icon
import * as Icons from "@ant-design/icons-vue"

import App from "./App.vue"
import router from "./router"

//路由拦截
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token")
  if (!token && to.name !== "login" && to.name !== "register" && to.name !== "forgotPassword") {
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

nextTick(() => {
  for (const key in Icons) {
    // 把icons注册到全局
    // @ts-ignore
    app.component(key, Icons[key])
  }
})

// 注册service-worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js", {
      scope: "/"
    })
    .then((registration) => {
      // console.log("service-worker注册成功", registration)
      // message.success("service-worker注册成功")
    })
    .catch((err) => {
      console.log("service-worker注册失败", err)
    })
}

;(async function loadConfig() {
  if (process.env.NODE_ENV === "production") {
    const response = await fetch("/app.config.js")
    const scriptText = await response.text()
    eval(scriptText) // 执行 config.js 内容
  }
})

app.use(router).use(createPinia()).mount("#app")
