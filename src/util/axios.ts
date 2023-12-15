import axios from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"

const apiUrl = import.meta.env.VITE_BASE_API

const service: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === 200) {
      return response.data.data
    } else {
      return Promise.reject(response.data.message)
    }
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default service
