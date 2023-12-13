<script setup lang="ts">
import loginForm from '@/components/componentsForm.vue'
import { reactive, ref } from 'vue';
const formConfig = ref({
  inline:"vertical",
  button:[
    {
    type:"primary",
    label:"登录"
    },
    {
    type:"danger",
    label:"取消",
    },
  ],
  buttonStyle:"gap: 10px;display: flex;flex-direction: column;"
})
const formData = ref({
  username: "",
  passwd: ""
})
const formLabelData = reactive([
  {
  model:"username",
  label:"用户名",
  },
  {
  model:"passwd",
  label:"密码",
  type:"passwd"
  },
])
</script>

<template>
  <loginForm :formLabelData = formLabelData :formData = formData :formConfig = formConfig />
</template>

<style scoped></style>