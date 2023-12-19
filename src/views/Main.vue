<script setup lang="ts">
import { RouterView } from "vue-router"
import type { CSSProperties } from "vue"
import userInfoCard from "@/components/userInfoCard.vue"
const siderStyle: CSSProperties = {
  textAlign: "center",
  lineHeight: "200px",
  minWidth: "300px",
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0)",
  paddingTop: "1rem"
}
const contentStyle: CSSProperties = {
  // textAlign: 'center',
  minHeight: "120px",
  lineHeight: "120px",
  padding: "0 2rem",
  paddingTop: "1rem",
  minWidth: "460px"
}
const headerStyle: CSSProperties = {
  // textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "rgba(255,255,255,1)",
  paddingTop: "1rem",
  padding: "0 2rem"
}
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout-sider
      :style="siderStyle"
      ><userInfoCard
    /></a-layout-sider>
    <a-layout>
      <a-layout-content :style="contentStyle"><RouterView /></a-layout-content>
      <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
