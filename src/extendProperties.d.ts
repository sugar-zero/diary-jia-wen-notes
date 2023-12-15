import { ComponentCustomProperties } from "@vue/runtime-core"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $get: proxy
    $post: proxy
    $put: proxy
    $del: proxy
    $message: proxy
    $loading: proxy
    $notify: proxy
    $aes_encrypt: proxy
    $aes_decrypt: proxy
  }
}

// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
