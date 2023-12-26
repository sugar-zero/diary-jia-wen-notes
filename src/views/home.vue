<script setup lang="ts">
import { ref, h, reactive, getCurrentInstance, type ComponentInternalInstance } from "vue"
import { SendOutlined, EditOutlined } from "@ant-design/icons-vue"
import { type UploadProps, type UploadChangeParam } from "ant-design-vue"
const { proxy } = getCurrentInstance() as ComponentInternalInstance

interface Data {
  content: String
  contentFileList: {}[]
  postedList: {
    content: string
    id: number
    create_time: string
    author: string
    filesList: []
  }[]
  imagegroup: {}[]
}

const data = reactive<Data>({
  content: "",
  contentFileList: [],
  postedList: [],
  imagegroup: []
})

let postedMailLoading = ref(false)

//发表日记
const postedMail = () => {
  postedMailLoading.value = true

  proxy
    ?.$post("/diary/record", {
      content: data.content,
      files: data.contentFileList
    })
    .then((res: any) => {
      if (res.code == 200) {
        proxy?.$message.success(res.data.message)
        data.content = ""
        data.contentFileList = []
        fileList.value = []
        data.postedList = res.data.data
        postedMailLoading.value = false
      } else {
        proxy?.$message.error(res.message)
        postedMailLoading.value = false
      }
    })
}

//获取全部日记列表
const getMail = () => {
  proxy?.$get("/diary/record").then((res: any) => {
    if (res.code == 200) {
      data.postedList = res.data
    }
  })
}
getMail()

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

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "done") {
    data.contentFileList.push(info.file.response.data.data)
  } else {
    if (info.file.status === "error") {
      proxy?.$message.error(info.file.response.message)
    }
  }
}
const uploadHeaders = {
  authorization: "Bearer " + localStorage.getItem("token")
}
//引入404图
import error_image from "@/assets/404.jpg"
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
      name="diary"
      action="api/v1/upload/diary-image"
      :headers="uploadHeaders"
      v-model:file-list="fileList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      accept="image/*"
      @change="handleChange"
    >
      <div v-if="fileList && fileList.length < 9">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
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
      :disabled="(fileList && fileList.length > 0) || data.content ? false : true"
      >{{
        (fileList && fileList.length > 0) || data.content ? "记录下来" : "先写点什么吧"
      }}</a-button
    >
  </a-card>
  <a-card
    size="small"
    style="width: 100%; margin-bottom: 5px"
    v-for="(item, key) in data.postedList"
    :key="key"
  >
    <div class="upperArea">
      #{{ item.id }} @{{ item.author }} 发布于
      {{
        new Date(item.create_time).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      }}
    </div>
    <div class="centralArea">
      <pre v-html="item.content"></pre>
    </div>
    <a-image-preview-group>
      <a-row :gutter="[4, 8]">
        <a-col :span="8" :key="key" v-for="(file, key) in item.filesList">
          <a-image :src="file" :height="100" :width="100" :fallback="error_image" />
        </a-col>
      </a-row>
    </a-image-preview-group>
    <div class="lowerArea">预留功能</div>
  </a-card>
</template>

<style langer="less" scoped>
#postedCard .ant-card-body {
  padding: 10px;
}
.anticon-send {
  transform: rotate(-45deg);
}
.upperArea {
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 1em;
}
.centralArea {
}
.lowerArea {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
