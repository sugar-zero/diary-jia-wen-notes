import { ComponentCustomProperties } from "@vue/runtime-core"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $get: Proxy
    $post: Proxy
    $put: Proxy
    $del: Proxy
    $message: Proxy
    $loading: Proxy
    $notify: Proxy
    $aes_encrypt: Proxy
    $aes_decrypt: Proxy
  }
}

// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
