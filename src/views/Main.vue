<script setup lang="ts">
import { RouterView } from "vue-router"
import { ref, type CSSProperties, onMounted, getCurrentInstance } from "vue"
import userInfoCard from "@/components/userInfoCard.vue"
import Home from "@/views/Home.vue"
import type { ComponentInternalInstance } from "vue"
const version = import.meta.env.VITE_VERSION
const filings = JSON.parse(localStorage.getItem("systemConfig") as string).filings
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const screenWidth = ref(0)
const drawer = ref(null)
const footer = ref()
const header = ref()
const minContentHeight = ref(0)
const siderDrawerOpened = ref(false)
const siderStyle: CSSProperties = {
  minWidth: "300px",
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0)"
}
const contentStyle: CSSProperties = {
  lineHeight: "120px",
  paddingTop: "1rem",
  minWidth: "400px",
  width: "100%",
  position: "relative"
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
  // lineHeight: "40px",
  // position: "absolute",
  // position: "fixed",
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
    getScreenWidth()
  })
  //通过ref footer获取组件高度
  // minContentHeight.value = footer.value.$el.offsetHeight + header.value.$el.offsetHeight
  // console.log(minContentHeight.value)
})
//侧边栏切换
const siderDrawerSwitch = () => {
  siderDrawerOpened.value = !siderDrawerOpened.value
}
//刷新子组件提供的获取日记方法
const home: any = ref(null)
const refreshMailList = () => {
  home.value.getMail()
  proxy?.$message.success("刷新成功")
}
// 询问用户是否开启Notification推送权限
const askNotificationPermission = () => {
  if (!("Notification" in window)) {
    proxy?.$message.error("您的浏览器不支持通知。")
  }
  Notification.requestPermission((res) => {
    if (res === "granted") {
      console.log("通知权限已授权")
      proxy?.$message.success("通知权限已授权")
      subscribeToPushService()
    } else {
      console.log("通知权限被拒绝")
      proxy?.$message.error("通知权限已拒绝，请打开通知权限")
    }
  })
}
//订阅推送服务
const subscribeToPushService = () => {
  navigator.serviceWorker.ready.then((registration) => {
    if (!registration.pushManager) {
      alert("推送通知不支持。")
      return false
    }
    registration.pushManager
      .subscribe({
        userVisibleOnly: true, // Web推送必须对用户可见
        applicationServerKey: import.meta.env.VITE_APP_SERVER_PUBLIC_KEY
        // 你的VAPID公钥
      })
      .then((subscription) => {
        // console.log("推送订阅成功：", subscription)
        // 发送订阅到应用服务器
        proxy?.$post("/subscribe", subscription.toJSON())
      })
      .catch((e) => {
        if (Notification.permission === "denied") {
          console.warn("权限被拒绝")
        } else {
          console.error("无法订阅推送", e)
        }
      })
  })
}
</script>
<template>
  <a-layout-header v-if="screenWidth < 860" :style="headerStyle" ref="header">
    <a-button type="primary" style="margin-bottom: 16px" @click="siderDrawerSwitch">
      <MenuUnfoldOutlined v-if="!siderDrawerOpened" />
      <MenuFoldOutlined v-else />
    </a-button>
    <a-button style="margin-left: 10px" @click="refreshMailList"
      ><sync-outlined spin />刷新日记</a-button
    >
  </a-layout-header>
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
        ><userInfoCard @askNotificationPermission="askNotificationPermission"
      /></a-layout-sider>
    </a-drawer>
    <a-layout-sider :style="siderStyle" v-else :width="260"
      ><userInfoCard
        :screenStatus="'pc'"
        @refreshMailList="refreshMailList"
        @askNotificationPermission="askNotificationPermission"
    /></a-layout-sider>
    <a-layout-content :style="contentStyle">
      <RouterView> <Home ref="home"></Home> </RouterView
    ></a-layout-content>
  </a-layout>
  <a-layout-footer :style="footerStyle" ref="footer">
    <!-- <div v-if="MODE === 'development'">当前开发模式</div> -->
    佳雯的日记 ©2024
    <a href="https://beian.miit.gov.cn/" target="_blank">{{ filings }}</a>
  </a-layout-footer>
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
.ant-layout-footer {
  a {
    color: rgba(0, 0, 0, 0.5);
    text-decoration: none;
  }
}
</style>
