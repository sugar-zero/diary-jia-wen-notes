<script lang="ts" setup>
import { SettingOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons-vue"
import { getCurrentInstance, type ComponentInternalInstance } from "vue"
import router from "../router"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const logout = () => {
  localStorage.removeItem("token")
  proxy?.$message.success("已出退登录")
  router.push({ name: "login" })
}
</script>
<template>
  <a-card style="width: 100%">
    <template #cover>
      <img alt="example" src="https://www-op.amesucre.com/img/bg.9a795037.jpg" />
    </template>
    <template #actions>
      <setting-outlined key="setting" />
      <edit-outlined key="edit" />
      <a-popconfirm title="是否要退出登录？" ok-text="是的" cancel-text="不了" @confirm="logout">
        <logout-outlined key="ellipsis" />
      </a-popconfirm>
    </template>
    <a-card-meta title="JiaYu" description="你好，欢迎回来，点击编辑可以修改个人信息">
      <template #avatar>
        <a-avatar src="https://www-op.amesucre.com/favicon.ico" />
      </template>
    </a-card-meta>
  </a-card>
</template>
