interface Config {
  VITE_GLOBAL_BASE_API: string
  VITE_GLOBAL_APP_SERVER_PUBLIC_KEY: string
  VITE_GLOBAL_CryptoJS_KEY: string
  VITE_GLOBAL_CryptoJS_IV: string
  VITE_GLOBAL_APP_NAME: string
}
let config = {} as Config

if (process.env.NODE_ENV === "production") {
  // 生产环境，从 config.js 文件中读取配置
  if ((window as any).__CONFIG__) {
    config = (window as any).__CONFIG__
  } else {
    console.error("Configuration is not defined in production environment")
  }
} else {
  config = {
    VITE_GLOBAL_BASE_API: import.meta.env.VITE_GLOBAL_BASE_API,
    VITE_GLOBAL_APP_SERVER_PUBLIC_KEY: import.meta.env.VITE_GLOBAL_APP_SERVER_PUBLIC_KEY,
    VITE_GLOBAL_CryptoJS_KEY: import.meta.env.VITE_GLOBAL_CryptoJS_KEY,
    VITE_GLOBAL_CryptoJS_IV: import.meta.env.VITE_GLOBAL_CryptoJS_IV,
    VITE_GLOBAL_APP_NAME: import.meta.env.VITE_GLOBAL_APP_NAME
  } as Config
}

export default config
