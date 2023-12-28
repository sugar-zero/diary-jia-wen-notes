import { defineStore } from "pinia"
import { ref } from "vue"

export const userStore = defineStore("user", () => {
  const userid = ref(parseInt(localStorage.getItem("user") as string))

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    userid.value = 0
  }
  const login = (id: number) => {
    userid.value = id
  }

  return { userid, login, logout }
})
