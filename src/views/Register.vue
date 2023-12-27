<script setup lang="ts">
import { ref, getCurrentInstance } from "vue"
//@ts-ignore
const { proxy } = getCurrentInstance()
import { type Rule } from "ant-design-vue/es/form"
import { message } from "ant-design-vue"

const registerformData = ref({
  username: "",
  password: "",
  Repassword: "",
  nickname: "",
  email: ""
})

const register = () => {
  message.loading({ content: "注册中...", key: "register" })
  proxy
    ?.$post("/user/reg", { secret: proxy?.$aes_encrypt(JSON.stringify(registerformData.value)) })
    .then((res: any) => {
      if (res.code === 200) {
        message.success({ content: res.data.message, key: "register" })
        localStorage.setItem("token", res.data.data.token)
        proxy.$router.push({ name: "home" })
      } else {
        if (Array.isArray(res.data)) {
          message.error({ content: res.data.join("，"), key: "register" })
        } else {
          message.error({ content: res.message, key: "register" })
        }
      }
    })
}
const Repassword = async (_rule: Rule, value: string) => {
  if (value !== registerformData.value.password || !value) {
    return Promise.reject("两次输入的密码不一致")
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  username: [
    {
      required: true,
      message: "请输入用户名"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码"
    }
  ],
  Repassword: [{ validator: Repassword, trigger: "change", required: true }],
  nickname: [
    {
      required: false,
      message: "请输入密码"
    }
  ],
  email: [
    {
      type: "email",
      required: true,
      message: "这不是一个合法的邮箱"
    }
  ]
}
const options = ref<{ value: string }[]>([])
const emailDomainSearch = (val: string) => {
  let res: { value: string }[]
  if (!val || val.indexOf("@") >= 0) {
    res = []
  } else {
    res = ["qq.com", "163.com", "gmail.com", "foxmail.com", "outlook.com"].map((domain) => ({
      value: `${val}@${domain}`
    }))
  }
  options.value = res
}
</script>
<template>
  <a-form
    :model="registerformData"
    layout="vertical"
    name="register"
    class="login-form"
    @finish="register"
    :rules="rules"
  >
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="registerformData.username" placeholder="登录用户名">
        <template #prefix>
          <SolutionOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="密码" name="password">
      <a-input-password v-model:value="registerformData.password" placeholder="请输入密码">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item label="重复密码" name="Repassword">
      <a-input-password
        v-model:value="registerformData.Repassword"
        placeholder="请再次输入确认密码"
      >
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item label="昵称" name="nickname">
      <a-input
        v-model:value="registerformData.nickname"
        placeholder="不填则随机生成，后续可自行更改"
      >
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="邮箱" name="email">
      <!-- <a-input v-model:value="registerformData.email" placeholder="xxxx@email.com">
        <template #prefix>
          <MailOutlined class="site-form-item-icon" />
        </template>
      </a-input> -->
      <a-auto-complete
        v-model:value="registerformData.email"
        placeholder="xxxx@email.com"
        :options="options"
        @search="emailDomainSearch"
      >
        <template #option="{ value: val }">
          {{ val.split("@")[0] }} @
          <span style="font-weight: bold">{{ val.split("@")[1] }}</span>
        </template>
      </a-auto-complete>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-form-button"> 注册 </a-button>
      <a-button type="link" href="/login">已有账号？现在登录</a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="lcss" scoped></style>
