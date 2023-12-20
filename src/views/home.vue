<script setup lang="ts">
import { ref, h, reactive } from "vue"
import { SendOutlined, EditOutlined } from "@ant-design/icons-vue"
import { message, type UploadProps } from "ant-design-vue"

interface Data {
  content: String
  postedList: String[]
}
;[]

const data = reactive<Data>({
  content: "",
  postedList: []
})

let postedMailLoading = ref(false)

const postedMail = () => {
  postedMailLoading.value = true

  setTimeout(() => {
    postedMailLoading.value = false
    // console.log(data.content)
    data.postedList.push(data.content)
    message.success("📝记录完成！")
    data.content = ""
    // console.log(data.postedList)
  }, 1000)
}
//上传文件列表
const fileList = ref<UploadProps["fileList"]>([])
const previewImage = ref("")
const previewVisible = ref(false)
const previewTitle = ref("")
const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
//@ts-ignore
const handlePreview = async (file: UploadProps["fileList"][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
}
const handleCancel = () => {
  previewVisible.value = false
}
</script>

<template>
  <a-card :bordered="false" style="margin-bottom: 1rem" id="postedCard">
    <a-textarea
      v-model:value="data.content"
      placeholder="记录点什么吧？写写今日发生的趣事"
      auto-size
      :bordered="false"
    />
    <a-divider />
    <a-upload
      disabled
      v-model:file-list="fileList"
      action="/api/v1/upload/img"
      list-type="picture-card"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < 9">
        <plus-outlined />
        <div style="margin-top: 8px">未完善文件上传</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-button
      :icon="h(data.content ? SendOutlined : EditOutlined)"
      value="small"
      style="float: right"
      type="primary"
      @click="postedMail"
      :loading="postedMailLoading"
      :disabled="!data.content"
      >{{ data.content ? "记录下来" : "先写点什么吧" }}</a-button
    >
  </a-card>
  <a-card
    hoverable
    size="small"
    style="width: 100%; margin-bottom: 5px"
    v-for="(item, key) in data.postedList"
    :key="key"
  >
    <pre>{{ item }}</pre>
  </a-card>
</template>

<style langer="less" scoped>
#postedCard .ant-card-body {
  padding: 10px;
}
.anticon-send {
  transform: rotate(-45deg);
}
</style>
