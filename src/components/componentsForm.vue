<template>
  <a-form :model="internalFormData" name="basic" :layout="formConfig?.inline" @finish="onFinish">
    <template v-for="(formItem, index) in formLabelData" :key="index">
      <!-- 文本框 -->
      <a-form-item
        v-model="formItem.model"
        :label="formItem.label"
        :name="formItem.model"
        :rules="[{ required: formItem.required, message: '请输入' + formItem.label }]"
        v-if="!formItem.type"
      >
        <a-input
          v-model:value="internalFormData[formItem.model]"
          :placeholder="formItem.placeholder"
          ><template #prefix><component :is="icons[formItem.icon]" /></template
        ></a-input>
      </a-form-item>
      <!-- 头像 -->
      <a-form-item
        v-if="formItem.type == 'avatar'"
        :label="formItem.label"
        :name="formItem.model"
        :rules="[{ required: formItem.required, message: '请输入' + formItem.label }]"
      >
        <a-avatar :src="internalFormData[formItem.model]" />
      </a-form-item>
      <!-- 上传头像 -->
      <a-form-item
        v-if="formItem.type == 'avatarUpload'"
        :label="formItem.label"
        :name="formItem.model"
        :rules="[{ required: formItem.required, message: '请输入' + formItem.label }]"
      >
        <a-upload
          v-model="formItem.model"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          action="api/v2/upload/avatar"
          :headers="uploadHeaders"
          @change="handleChange"
        >
          <img
            v-if="internalFormData[formItem.model]"
            :src="internalFormData[formItem.model]"
            alt="avatar"
            style="width: 90%; height: 90%; object-fit: cover"
          />
          <div v-else>
            <loading-outlined v-if="false"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">更新头像</div>
          </div>
        </a-upload>
      </a-form-item>
      <!-- 图片 -->
      <a-form-item
        v-if="formItem.type == 'img'"
        :label="formItem.label"
        :name="formItem.model"
        :rules="[{ required: formItem.required, message: '请输入' + formItem.label }]"
      >
        <a-upload
          v-model="formItem.model"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :headers="uploadHeaders"
          action="api/v2/upload/img"
          @change="handleChangeUserBg"
        >
          <img
            v-if="internalFormData[formItem.model]"
            :src="internalFormData[formItem.model]"
            style="width: 90%; height: 90%; object-fit: cover"
          />
          <div v-else>
            <loading-outlined v-if="false"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">更新背景图</div>
          </div>
        </a-upload>
      </a-form-item>
    </template>
    <!-- 按钮组 -->
    <div :style="formConfig?.buttonStyle">
      <template v-for="(formConfigItem, index) in formConfig?.button" :key="index">
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          danger
          :disabled="formConfigItem.disabled"
          style="margin-left: 1rem"
          v-if="formConfigItem.type == 'danger'"
          >{{ formConfigItem.label }}</a-button
        >
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          ghost
          :disabled="formConfigItem.disabled"
          style="margin-left: 1rem"
          v-else-if="formConfigItem.type == 'ghost'"
          >{{ formConfigItem.label }}</a-button
        >
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          :disabled="formConfigItem.disabled"
          style="margin-left: 1rem"
          :type="formConfigItem.type ? formConfigItem.type : 'primary'"
          v-else-if="formConfigItem.type"
          >{{ formConfigItem.label }}</a-button
        >
        <a-button
          html-type="submit"
          :shape="formConfigItem.shape"
          :disabled="formConfigItem.disabled"
          style="margin-left: 1rem"
          v-else
          >{{ formConfigItem.label }}</a-button
        >
      </template>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { getCurrentInstance, type ComponentInternalInstance, ref } from "vue"
import type { UploadChangeParam } from "ant-design-vue"
import { message } from "ant-design-vue"
const { formData, formLabelData, formConfig } = defineProps([
  "formData",
  "formLabelData",
  "formConfig"
])
const internalFormData = ref(JSON.parse(JSON.stringify(formData)))
const proxy = getCurrentInstance() as ComponentInternalInstance
const icons = proxy?.appContext.config.globalProperties.$icons
const onFinish = (values: any) => {
  proxy?.emit("edit", values)
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "done") {
    internalFormData.value.avatar = info.file.response.data.data
  } else if (info.file.status === "error") {
    console.log(info.file)
    message.error(`上传失败,${info.file.response.message} `)
  }
}
const handleChangeUserBg = (info: UploadChangeParam) => {
  if (info.file.status === "done") {
    internalFormData.value.userBg = info.file.response.data.data
  } else if (info.file.status === "error") {
    console.log(info.file)
    message.error(`上传失败,${info.file.response.message} `)
  }
}
// 上传附带的token
const uploadHeaders = {
  authorization: "Bearer " + localStorage.getItem("token")
}
</script>
