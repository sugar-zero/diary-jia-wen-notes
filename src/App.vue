<script setup lang="ts">
import { getCurrentInstance, type ComponentInternalInstance } from "vue"
import { RouterView } from "vue-router"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const getSystemConfig = () => {
  proxy?.$get("/system/config").then((res: any) => {
    localStorage.setItem("systemConfig", JSON.stringify(res.data.data))
  })
}
getSystemConfig()
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
