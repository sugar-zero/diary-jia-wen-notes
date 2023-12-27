<script setup lang="ts">
import { getCurrentInstance, ref } from "vue"
import { RouterView } from "vue-router"
//我不想惯着ts了...我已经写了声明了，调用.$xxx还是报错。。。我直接用vue3写法了，有能力的自己改吧
// @ts-ignore
const { proxy } = getCurrentInstance()
const getClientVersionTag = import.meta.env.VITE_VERSION_TAG
const getClientVersion = import.meta.env.VITE_VERSION
const newClientVersionString = ref("0")
const newClientVersion = ref(0)
const diffVersion = ref(0)
const switchlocal = ref(false)

const getSystemConfig = () => {
  proxy?.$get("/system/config").then((res: any) => {
    localStorage.setItem("systemConfig", JSON.stringify(res.data.data))
    if (getClientVersionTag < JSON.parse(localStorage.getItem("systemConfig") as string).version) {
      newClientVersionString.value = JSON.parse(
        localStorage.getItem("systemConfig") as string
      ).version.toString()
      newClientVersion.value = JSON.parse(localStorage.getItem("systemConfig") as string).version
      newClientVersionString.value = newClientVersionString.value.split("").join(".")
      diffVersion.value = JSON.parse(localStorage.getItem("systemConfig") as string).diffversion
      switchlocal.value = true
    }
  })
}
getSystemConfig()
const updateVersion = () => {
  proxy.$router.go(0)
}
</script>

<template>
  <a-modal
    v-model:open="switchlocal"
    title="检测到新版本"
    ok-text="立即更新"
    :cancel-text="
      newClientVersion - getClientVersionTag > diffVersion ? '已超过允许的最大差异化版本' : '取消'
    "
    :centered="true"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :cancel-button-props="{ disabled: newClientVersion - getClientVersionTag > diffVersion }"
    @ok="updateVersion"
  >
    <p>发现新版本，是否立即更新？</p>
    <p>当前版本:{{ getClientVersion }} 最新版本:{{ newClientVersionString }}</p>
  </a-modal>
  <RouterView />
</template>

<style scoped></style>
