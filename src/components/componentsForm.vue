<template>
  <a-form :model="formData" name="basic" :layout="formConfig.inline" @finish="onFinish">
    <template v-for="(formItem, index) in formLabelData" :key="index">
      <a-form-item
        v-model="formItem.model"
        :label="formItem.label"
        :name="formItem.model"
        :rules="[{ required: true, message: '请输入' + formItem.label }]"
      >
        <a-input v-model:value="formData[formItem.model]" v-if="formItem.type != 'passwd'"
          ><template #prefix><component :is="icons[formItem.icon]" /></template
        ></a-input>
        <a-input-password v-model:value="formData[formItem.model]" v-else
          ><template #prefix><component :is="icons[formItem.icon]" /></template
        ></a-input-password>
      </a-form-item>
    </template>
    <!-- 按钮组 -->
    <div :style="formConfig.buttonStyle">
      <template v-for="(formConfigItem, index) in formConfig.button" :key="index">
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          danger
          :disabled="formConfigItem.disabled"
          v-if="formConfigItem.type == 'danger'"
          >{{ formConfigItem.label }}</a-button
        >
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          ghost
          :disabled="formConfigItem.disabled"
          v-else-if="formConfigItem.type == 'ghost'"
          >{{ formConfigItem.label }}</a-button
        >
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          :disabled="formConfigItem.disabled"
          :type="formConfigItem.type ? formConfigItem.type : 'primary'"
          v-else
          >{{ formConfigItem.label }}</a-button
        >
      </template>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { defineProps, getCurrentInstance, type ComponentInternalInstance, ref } from "vue"
const { formData, formLabelData, formConfig } = defineProps([
  "formData",
  "formLabelData",
  "formConfig"
])
const proxy = getCurrentInstance() as ComponentInternalInstance
const icons = proxy?.appContext.config.globalProperties.$icons
const onFinish = (values: any) => {
  proxy.emit("edit", values)
}
</script>
