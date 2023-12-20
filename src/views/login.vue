<script setup lang="ts">
import { ref, computed, getCurrentInstance, type ComponentInternalInstance } from "vue"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
import { message } from "ant-design-vue"

const allowregister = JSON.parse(localStorage.getItem("systemConfig") as string).allowResgister
const formData = ref({
  username: "",
  password: "",
  remember: true
})
const disabledLogin = ref(false)
const login = () => {
  message.loading({ content: "登录中...", key: "login" })
  disabledLogin.value = true
  proxy
    ?.$post("/user/login", { data: proxy?.$aes_encrypt(JSON.stringify(formData.value)) })
    .then((res: any) => {
      if (res.code === 200) {
        disabledLogin.value = false
        message.success({ content: res.data.message, key: "login" })
        localStorage.setItem("token", res.data.data.token)
        proxy?.$router.push({ name: "home" })
      }
      if (res.code === 400) {
        disabledLogin.value = false
        message.error({ content: res.message, key: "login" })
      }
    })
}
const disabled = computed(() => {
  return !(formData.value.username && formData.value.password) || disabledLogin.value
})
</script>

<template>
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
        <a-button class="login-form-forgot" type="link">忘记密码</a-button>
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
</template>

<style scoped lang="less">
@media (min-width: 1024px) {
  .login-form {
    width: 300px;
  }
}
.login-form {
  position: relative;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: 100vh;
  flex-direction: column;
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
</style>
