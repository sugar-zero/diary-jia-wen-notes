<script setup lang="ts">
import { reactive, ref, getCurrentInstance, type ComponentInternalInstance, computed } from 'vue';
const proxy = getCurrentInstance() as ComponentInternalInstance
const icons = getCurrentInstance()?.appContext.config.globalProperties.$icons
const formConfig = ref({
  inline:"vertical",
  button:[
    {
    type:"primary",
    label:"登录",
    }
  ],
  buttonStyle:"gap: 10px;display: flex;flex-direction: column;"
})
const formData = ref({
  username: "",
  passwd: "",
  remember:true
})
const onFinish = (value:Object) =>{
  console.log(value)
}
const disabled = computed(() => {
  return !(formData.value.username && formData.value.passwd);
});
</script>

<template>
  <a-form
    :model="formData"
    layout="vertical"
    name="login"
    class="login-form"
    @finish="onFinish"
  >
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

    <a-form-item
      label="密码"
      name="passwd"
      :rules="[{ required: true, message: '请输入密码' }]"
    >
      <a-input-password v-model:value="formData.passwd">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item >
      <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formData.remember">记住我</a-checkbox>
        <a-button class="login-form-forgot" type="link">忘记密码</a-button>
      </a-form-item>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
        登录
      </a-button>
      或者
      <a-button type="link">现在注册！</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped>
@media (min-width: 1024px){
  .login-form{
    width:300px;
  }
}
.login-form{
  position: relative;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: 100vh;
  flex-direction: column
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}

</style>