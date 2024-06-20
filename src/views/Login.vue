<script setup lang="ts">
import { ref, computed, getCurrentInstance } from "vue"
import { userStore } from "@/stores/main"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
import { message, Modal } from "ant-design-vue"
import { MailOutlined } from "@ant-design/icons-vue"
import { h, type ComponentInternalInstance } from "vue"
import { type Rule } from "ant-design-vue/es/form"
import { httpRequest } from "@/api/api"
import { aes_encrypt } from "@/util/aes"
const http = new httpRequest()

const allowregister = JSON.parse(localStorage.getItem("systemConfig") as string).allowResgister
const backgroundUrl = JSON.parse(localStorage.getItem("systemConfig") as string).backgroundUrl
const formData = ref({
  username: "",
  password: "",
  remember: false
})
const forgotPasswordModal = ref(false)
const disabledLogin = ref(false)
const login = () => {
  message.loading({ content: "登录中...", key: "login" })
  disabledLogin.value = true
  http
    .post("/user/login", { secret: aes_encrypt(JSON.stringify(formData.value)) })
    .then((res: any) => {
      if (res.code === 200) {
        disabledLogin.value = false
        message.success({ content: res.data.message, key: "login" })
        localStorage.setItem("token", res.data.data.token)
        localStorage.setItem("user", res.data.data.userInfo)
        proxy?.$router.push({ name: "home" })
        const useUserStore = userStore()
        useUserStore.login(res.data.data.userInfo)
      } else if (res.code === 400) {
        disabledLogin.value = false
        message.error({ content: res.message, key: "login" })
      } else if (res.code === 403) {
        disabledLogin.value = false
        message.error({ content: "登录失败", key: "login" })
        Modal.error({
          title: "登录失败",
          content: h("div", {}, [
            h("span", { style: "color: red;font-weight: bold;" }, res.data.prompt),
            h(
              "p",
              `停止时间: ${new Date(res.data.begin_time).toLocaleString()} ~ ${new Date(
                res.data.end_time
              ).toLocaleString()}`
            )
          ]),
          okText: "确认",
          centered: true
        })
      }
    })
}
const disabled = computed(() => {
  return !(formData.value.username && formData.value.password) || disabledLogin.value
})

const emailInfo = ref({
  email: ""
})
const forgotPasswordRules: Record<string, Rule[]> = {
  email: [
    { required: true, message: "请输入邮箱" },
    { type: "email", message: "这不是一个合法的邮箱" }
  ]
}

// 发送找回密码邮件
const sendEmail = () => {
  http.post("/user/forgotPassword", { email: emailInfo.value.email }).then((res: any) => {
    res.code === 200 ? message.success(res.data.message) : message.error(res.message)
  })
}
</script>

<template>
  <div :style="{ background: `url(${backgroundUrl})` }" class="staticBg"></div>
  <a-form :model="formData" layout="vertical" name="login" class="login-form" @finish="login">
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名' }]"
    >
      <a-input v-model:value="formData.username">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password v-model:value="formData.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formData.remember">记住我</a-checkbox>
        <a-button class="login-form-forgot" type="link" @click="forgotPasswordModal = true"
          >忘记密码</a-button
        >
      </a-form-item>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
        登录
      </a-button>
      <div v-if="allowregister">
        或者
        <a-button type="link" href="/register">现在注册！</a-button>
      </div>
    </a-form-item>
  </a-form>
  <a-modal v-model:open="forgotPasswordModal" title="找回您的密码" :footer="null">
    <a-form
      :model="emailInfo"
      name="forgotPassword"
      @finish="sendEmail"
      :rules="forgotPasswordRules"
    >
      <a-form-item name="email">
        <a-input v-model:value="emailInfo.email" placeholder="请输入邮箱">
          <template #prefix>
            <MailOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less">
.login-form {
  position: relative;
  display: flex;
  min-height: 100vh;
  left: 0;
  right: 0;
  margin: auto;
  min-width: 300px;
  padding: 0 1rem;
  justify-content: center;
  flex-direction: column;
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
.staticBg {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  // min-width: 1000px;
  zoom: 1;
  background-color: #fff;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}

@media only screen and (max-width: 860px) {
  .login-form {
    position: relative;
    display: flex;
    min-height: 100vh;
    left: 0;
    right: 0;
    margin: auto;
    min-width: 300px;
    padding: 0 1rem;
    justify-content: center;
    flex-direction: column;
  }
}
@media only screen and (min-width: 1600px) {
  .login-form {
    position: relative;
    display: flex;
    min-height: 100vh;
    left: 0;
    right: 0;
    margin: auto;
    width: 80%;
    padding: 0 1rem;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
