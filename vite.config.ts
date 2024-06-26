import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    target: ["ios11"]
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    }),
    copy({
      targets: [
        { src: "public/app.config.js", dest: "dist" },
        { src: "service-worker.js", dest: "dist" }
      ],
      hook: "writeBundle" // 在构建结束时复制文件
    })
  ],
  server: {
    //@ts-ignore
    host: ["0.0.0.0"],
    proxy: {
      "^/api": {
        target: "http://localhost:3000/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
