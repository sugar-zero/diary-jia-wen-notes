import service from "@/util/axios"

export interface APIResult<T> {
  code: number
  data: T
  message: string
}

export class httpRequest {
  /**
   * 异步函数，用于发送 GET 请求获取数据
   *
   * @param url - 请求的 URL
   * @param params - GET 请求的参数
   * @returns 返回 API 结果中的数据
   * @throws 抛出一个错误，如果请求失败
   */
  async get<T>(url: string, params?: any): Promise<APIResult<T>> {
    const response = await service.get<APIResult<T>>(url, { params })
    return response.data
  }

  /**
   * 发送 POST 请求到指定 URL，并返回 API 结果的异步函数
   *
   * @param url - 请求的 URL
   * @param params - 请求的参数
   * @returns APIResult<T>类型的Promise对象，包含响应的数据
   */
  async post<T>(url: string, data?: any, config?: object): Promise<APIResult<T>> {
    const response = await service.post<APIResult<T>>(url, data, config)
    // console.log(response)
    return response.data
  }

  /**
   * 发送 PUT 请求
   * @param url 请求的 URL
   * @param params 请求的参数
   * @returns Promise 返回 API 结果及数据
   */
  async put<T>(url: string, data?: any, config?: object): Promise<APIResult<T>> {
    const response = await service.put<APIResult<T>>(url, data, config)
    return response.data
  }

  /**
   * 发送 PATCH 请求
   * @param url 请求的 URL
   * @param params 请求的参数
   * @returns Promise 返回 API 结果及数据
   */
  async patch<T>(url: string, data?: any, config?: object): Promise<APIResult<T>> {
    const response = await service.patch<APIResult<T>>(url, data, config)
    return response.data
  }

  /**
   * 异步删除请求
   * @param url - 请求的URL
   * @param params - 请求的参数
   * @returns APIResult<T> - API的响应结果
   */
  async del<T>(url: string, params?: any): Promise<APIResult<T>> {
    const response = await service.delete<APIResult<T>>(url, { params })
    return response.data
  }
  /**
   * 删除数据
   * @param url - 删除数据的接口URL
   * @param data - 可选参数，要删除的数据
   * @returns Promise<APIResult<T>> - 删除操作的结果
   */
  async deldata<T>(url: string, data?: any): Promise<APIResult<T>> {
    const response = await service.delete<APIResult<T>>(url, { data })
    return response.data
  }
}
