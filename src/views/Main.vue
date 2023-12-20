<script setup lang="ts">
import { RouterView } from "vue-router"
import {
  ref,
  type CSSProperties,
  onMounted,
  getCurrentInstance,
  type ComponentInternalInstance
} from "vue"
import userInfoCard from "@/components/userInfoCard.vue"
const filings = JSON.parse(localStorage.getItem("systemConfig") as string).filings
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const screenWidth = ref(0)
const drawer = ref(null)
const siderDrawerOpened = ref(false)
const siderStyle: CSSProperties = {
  minWidth: "300px",
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0)"
}
const contentStyle: CSSProperties = {
  minHeight: "120px",
  lineHeight: "120px",
  paddingTop: "1rem",
  minWidth: "400px",
  width: "100%"
}
const headerStyle: CSSProperties = {
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "rgba(255,255,255,1)",
  paddingTop: "1rem",
  minWidth: "400px",
  padding: "0 2rem"
}
const footerStyle: CSSProperties = {
  textAlign: "center",
  color: "rgba(0, 0, 0, 0.5)",
  lineHeight: "40px",
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0
}
const drawerBodyStyle: CSSProperties = {
  padding: "0",
  height: "100%",
  overflow: "auto"
}
//计算视图宽度
const getScreenWidth = () => {
  screenWidth.value = window.innerWidth
}
getScreenWidth()

//监听视图宽度变化
onMounted(() => {
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth
  })
})
//侧边栏切换
const siderDrawerSwitch = () => {
  siderDrawerOpened.value = !siderDrawerOpened.value
}
</script>
<template>
  <a-layout-header v-if="screenWidth < 860" :style="headerStyle">
    <a-button type="primary" style="margin-bottom: 16px" @click="siderDrawerSwitch">
      <MenuUnfoldOutlined v-if="!siderDrawerOpened" />
      <MenuFoldOutlined v-else /> </a-button
  ></a-layout-header>
  <a-layout>
    <a-drawer
      ref="drawer"
      v-if="screenWidth < 860"
      title="佳雯的日记"
      placement="left"
      :closable="false"
      :open="siderDrawerOpened"
      @close="siderDrawerSwitch"
      width="70%"
      :bodyStyle="drawerBodyStyle"
    >
      <a-layout-sider :style="siderStyle" :width="screenWidth * 0.7"
        ><userInfoCard
      /></a-layout-sider>
    </a-drawer>
    <a-layout-sider :style="siderStyle" v-else
      ><userInfoCard :screenStatus="'pc'"
    /></a-layout-sider>
    <a-layout-content :style="contentStyle"><RouterView /></a-layout-content>
  </a-layout>
  <a-layout-footer :style="footerStyle">{{ filings }}</a-layout-footer>
</template>

<style scoped>
/* 在电脑上显示侧边栏，隐藏顶部栏 */
@media only screen and (min-width: 860px) {
  .ant-layout-content {
    padding: 0 2rem;
    line-height: "200px";
    text-align: "center";
  }
  .ant-layout-sider {
    padding: 1rem 0;
  }
}

/* 在手机上隐藏侧边栏，显示顶部栏 */
@media only screen and (max-width: 860px) {
  .ant-layout-content {
    padding: 0 10px;
  }
}
</style>
