<template>
  <div style="display: flex; justify-content: center; flex-direction: column; min-height: 100vh">
    <a-card>
      <a-descriptions>
        <a-descriptions-item label="用户id">{{ forgotPasswordForm.userid }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ forgotPasswordForm.username }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ forgotPasswordForm.email }}</a-descriptions-item>
      </a-descriptions>
      <a-form :model="forgotPasswordForm" @finish="onSubmit" :rules="resetPasswordRules">
        <a-form-item label="新密码" name="password">
          <a-input-password v-model:value="forgotPasswordForm.password" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password v-model:value="forgotPasswordForm.confirmPassword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">修改密码</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, type ComponentInternalInstance } from "vue"
import type { Rule } from "ant-design-vue/es/form"
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const token = proxy?.$route.params.token
const findForgotPasswordUser = () => {
  proxy?.$post("/user/fetchValidToken", { token }).then((res: any) => {
    if (res.code === 200) {
      forgotPasswordForm.value.userid = res.data.userid
      forgotPasswordForm.value.email = res.data.email
      forgotPasswordForm.value.username = res.data.username
    } else {
      proxy?.$message.error(res.message)
      proxy?.$router.push("/login")
    }
  })
}
findForgotPasswordUser()

interface forgotPasswordForm {
  username: string
  email: string
  userid: number
  password: string
  confirmPassword: string
}
const forgotPasswordForm = ref<forgotPasswordForm>({
  username: "",
  email: "",
  userid: 0,
  password: "",
  confirmPassword: ""
})
const resetPasswordRules: Record<string, Rule[]> = {
  password: [
    { required: true, message: "请输入新密码" },
    { min: 6, max: 50, message: "密码长度为6-50位" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码" },
    { min: 6, max: 50, message: "密码长度为6-50位" },
    {
      validator: async (rule: Rule, value: string) => {
        if (value !== forgotPasswordForm.value.password) {
          return Promise.reject("两次密码不一致")
        } else {
          return Promise.resolve()
        }
      }
    }
  ]
}
const onSubmit = (resetPassword: forgotPasswordForm) => {
  proxy?.$post("/user/resetPassword", { token, resetPassword }).then((res: any) => {
    if (res.code === 200) {
      proxy?.$message.success(res.data.message)
        proxy?.$router.push("/login")
    } else {
      proxy?.$message.error(res.message)
        proxy?.$router.push("/login")
    }
  })
}
</script>

<style scoped></style>
