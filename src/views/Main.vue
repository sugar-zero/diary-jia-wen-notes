<script setup lang="ts">
import { RouterView } from "vue-router"
import type { CSSProperties } from "vue"
const siderStyle: CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0)"
}
const contentStyle: CSSProperties = {
  // textAlign: 'center',
  minHeight: 120,
  lineHeight: "120px",
  padding: "0 2rem",
  paddingTop: "1rem"
}
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout-sider :style="siderStyle"></a-layout-sider>
    <a-layout>
      <a-layout-content :style="contentStyle"><RouterView /></a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
#app {
}
</style>
