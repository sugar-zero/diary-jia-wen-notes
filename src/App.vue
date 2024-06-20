<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from "vue"
import { RouterView } from "vue-router"
import { SmileTwoTone } from "@ant-design/icons-vue"
import type { ComponentInternalInstance } from "vue"
import { httpRequest } from "@/api/api"
const http = new httpRequest()
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const getClientVersionTag = Number(import.meta.env.VITE_VERSION_TAG)
const getClientVersion = import.meta.env.VITE_VERSION
const newClientVersionString = ref("0")
const newClientVersion = ref(0)
const diffVersion = ref(0)
const switchlocal = ref(false)
const isMaintenance = ref(false)

const getSystemConfig = () => {
  http.get("/system/config").then((res: any) => {
    localStorage.setItem("systemConfig", JSON.stringify(res.data))
    if (getClientVersionTag < JSON.parse(localStorage.getItem("systemConfig") as string).version) {
      newClientVersionString.value = JSON.parse(
        localStorage.getItem("systemConfig") as string
      ).version.toString()
      newClientVersion.value = JSON.parse(localStorage.getItem("systemConfig") as string).version
      newClientVersionString.value = newClientVersionString.value.split("").join(".")
      diffVersion.value = JSON.parse(localStorage.getItem("systemConfig") as string).diffVersion
      switchlocal.value = true
    }
    isMaintenance.value = JSON.parse(localStorage.getItem("systemConfig") as string).maintenance
  })
}
getSystemConfig()
const updateVersion = () => {
  proxy?.$router.go(0)
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
  <a-result status="500" title="暂时无法访问" sub-title="站点目前正在维护中~" v-if="isMaintenance">
    <template #icon>
      <SmileTwoTone />
    </template>
  </a-result>
  <RouterView v-else />
  <a-back-top />
</template>

<style scoped></style>
