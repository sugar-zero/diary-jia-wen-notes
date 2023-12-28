import axios from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { message } from "ant-design-vue"
import router from "../router"

const apiUrl = import.meta.env.VITE_BASE_API

const service: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (localStorage.getItem("token"))
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: any) => {
    // console.log(error)
    // console.log(error.response)
    // return Promise.reject(error).catch((error) => {
    //   console.log(error)
    //   return error.response
    // })
    if (error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      message.error(error.response.data.message)
      router.push({ name: "login" })
    }
    return error.response
  }
)

export default service
