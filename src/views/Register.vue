<script setup lang="ts">
import { ref, getCurrentInstance, type ComponentInternalInstance } from "vue"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
import { message } from "ant-design-vue"

if (!import.meta.env.VITE_ALLOW_REGISTER) {
  message.error("用户注册已关闭")
}

const registerformData = ref({
  username: "",
  password: "",
  nickname: "",
  email: ""
})

const register = () => {
  message.loading({ content: "注册中...", key: "register" })
  proxy
    ?.$post("/user/reg", { data: proxy?.$aes_encrypt(JSON.stringify(registerformData.value)) })
    .then((res: any) => {
      if (res.code === 200) {
        message.success({ content: res.data.message, key: "register" })
        localStorage.setItem("token", res.data.data.token)
        proxy.$router.push({ name: "home" })
      } else {
        message.error({ content: res.message, key: "register" })
      }
    })
}
</script>
<template>
  <a-form
    :model="registerformData"
    layout="vertical"
    name="register"
    class="login-form"
    @finish="register"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名' }]"
    >
      <a-input v-model:value="registerformData.username" placeholder="登录用户名">
        <template #prefix>
          <SolutionOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password v-model:value="registerformData.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item label="昵称" name="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
      <a-input v-model:value="registerformData.nickname" placeholder="展示名">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="邮箱"
      name="email"
      :rules="[{ type: 'email', required: true, message: '这不是一个合法的邮箱格式' }]"
    >
      <a-input v-model:value="registerformData.email">
        <template #prefix>
          <MailOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-form-button"> 注册 </a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="lcss" scoped></style>
