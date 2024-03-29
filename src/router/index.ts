import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Main.vue"),
      redirect: "home",
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/Home.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/Register.vue")
    },
    {
      path: "/forgotPassword/:token",
      name: "forgotPassword",
      component: () => import("@/views/ForgotPassword.vue")
    }
  ]
})

export default router
