import CryptoJS from "crypto-js"
import config from "@/config/configLoader"

const KEY = CryptoJS.enc.Utf8.parse(config.VITE_GLOBAL_CryptoJS_KEY)
const IV = CryptoJS.enc.Utf8.parse(config.VITE_GLOBAL_CryptoJS_IV)

/**
 * 使用AES算法对输入的文本进行加密
 * @param {string} text - 需要加密的文本
 * @returns {string} - 返回加密后的密文
 */
export function aes_encrypt(text: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.Pkcs7
  })
  const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  // console.log(ciphertext)
  return ciphertext
}
/**
 * 使用AES算法对密文进行解密
 * @param {string} ciphertext - 密文
 * @returns {string} - 解密后的明文
 */
export function aes_decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.Pkcs7
  })
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  // console.log(decrypted)
  return decrypted
}
