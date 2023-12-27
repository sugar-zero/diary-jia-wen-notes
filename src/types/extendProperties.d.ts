import Vue from "vue"
import { message } from "ant-design-vue"
import { get, post, put, del } from "@/api/api"
import { aes_encrypt, aes_decrypt } from "@/util/aes"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $get: get
    $post: post
    $put: put
    $del: del
    $patch: patch
    $message: message
    $loading: proxy
    $aes_encrypt: aes_encrypt
    $aes_decrypt: aes_decrypt
  }
}

// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
