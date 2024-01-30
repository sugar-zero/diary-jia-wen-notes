import axios from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { message, Modal } from "ant-design-vue"
import router from "../router"

// 引入API地址
const apiUrl = import.meta.env.VITE_BASE_API

// 创建Axios实例
const service: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 将token添加到请求头中
    if (localStorage.getItem("token"))
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: any) => {
    // 如果响应状态为401（未认证），则处理逻辑为：
    // 1. 移除localStorage中的token和user
    // 2. 显示错误消息
    // 3. 跳转到登录页面
    if (error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      message.error(error.response.data.message)
      router.push({ name: "login" })
    } else if (error.response.status === 503) {
      Modal.error({
        title: "服务目前不可用",
        content: error.response.data.message,
        centered: true,
        okText: "确认",
        onOk() {
          router.go(0)
        },
        onCancel() {
          router.go(0)
        }
      })
    }
    return error.response
  }
)

export default service
