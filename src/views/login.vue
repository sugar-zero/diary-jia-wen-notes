<script setup lang="ts">
import loginForm from '@/components/componentsForm.vue'
import { reactive, ref } from 'vue';
const formConfig = ref({
  inline:"vertical",
  button:{
    type:"primary",
    
  }
})
const formData = ref({
  username: "",
  passwd: ""
})
const formLabelData = reactive([
  {
  model:"username",
  label:"用户名",
  icon:"<UserOutlined />",
  },
  {
  model:"passwd",
  label:"密码",
  icon:"LockOutlined",
  },
])
</script>

<template>
  <loginForm :formLabelData = formLabelData :formData = formData :formConfig = formConfig />
</template>

<style scoped></style>