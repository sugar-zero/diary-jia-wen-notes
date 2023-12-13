<template>
    <a-form
      :model="formData"
      name="basic"
      :layout="formConfig.inline"
    >
    <template v-for="(formIten,index) in formLabelData" :key="index">
      <a-form-item
        v-model="formIten.model"
        :label="formIten.label"
        :name="formIten.model"
        :rules="[{ required: true, message: '请输入'+ formIten.label }]"
      >
        <a-input v-model:value="formData[formIten.model]" />
      </a-form-item>
    </template>
    <template>
        <a-form-item>
            <a-button :type="formConfig.button.type ? 'primary': formConfig.button.type">{{formConfig.button.lable}}</a-button>
        </a-form-item>
    </template>
    </a-form>
  </template>
  <script lang="ts" setup>
  import { defineProps } from "vue"
  const {formData,formLabelData,formConfig} = defineProps(['formData','formLabelData','formConfig'])
  </script>
  
  