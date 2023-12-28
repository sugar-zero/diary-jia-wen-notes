<script setup lang="ts">
import { ref, h, reactive, getCurrentInstance } from "vue"
import { SendOutlined, EditOutlined } from "@ant-design/icons-vue"
import { type UploadProps, type UploadChangeParam } from "ant-design-vue"
//引入404图
import error_image from "@/assets/404.jpg"
//引入store
import { userStore } from "@/stores/main"
const { userid } = userStore()
//@ts-ignore
const { proxy } = getCurrentInstance()

interface Data {
  content: String
  contentFileList: {}[]
  postedList: {
    content: string
    id: number
    create_time: string
    update_time: string
    author: {
      owner: string
      ownerid: number
    }
    filesList: []
  }[]
  imagegroup: {}[]
}
//编辑邮件接口
interface editMailContent {
  content: string
  id: number
  create_time: string
  author: string
  filesList: []
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
defineExpose({ getMail }) //暴露出去给父组件Main调用

//上传文件列表
const fileList = ref<UploadProps["fileList"]>([])
const previewImage = ref("")
const previewVisible = ref(false)
const previewTitle = ref("")
// const getBase64 = (file: File) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onload = () => resolve(reader.result)
//     reader.onerror = (error) => reject(error)
//   })
// }
//@ts-ignore
const handlePreview = async (file: UploadProps["fileList"][number]) => {
  if (!file.url && !file.preview) {
    if (file.response.data.data) {
      file.preview = file.response.data.data
    } else {
      file.preview = file.url
    }
    // file.preview = file.response.data.data ? file.url : file.response.data.data
  }
  previewImage.value = file.preview
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
      if (info.file.response.code == 401) {
        localStorage.removeItem("token")
        proxy?.$router.push("/login")
      }
      proxy?.$message.error(info.file.response.message)
    }
  }
}
const removeImage = (file: any) => {
  console.log(file)
  //根据file.response.data.data删除data.contentFileList中对应的数据
  for (let i = 0; i < data.contentFileList.length; i++) {
    if (data.contentFileList[i] == file.response.data.data) {
      data.contentFileList.splice(i, 1)
      break
    }
  }
}
const uploadHeaders = {
  authorization: "Bearer " + localStorage.getItem("token")
}
//编辑日记
const editMailModalOpen = ref(false)
const editMailContent = reactive<editMailContent>({
  content: "",
  id: 0,
  create_time: "",
  author: "",
  filesList: []
})
//激活编辑日记并且赋予初始值
const activateEditMail = (conten: any) => {
  editMailModalOpen.value = true
  editMailContent.author = conten.author
  editMailContent.content = conten.content
  editMailContent.id = conten.id
  if (conten.filesList) {
    editMailContent.filesList = conten.filesList.map((item: any) => {
      return {
        url: item
      }
    })
  }
}
//关闭编辑日记
const initEditModal = () => {
  editMailModalOpen.value = false
  editMailContent.author = ""
  editMailContent.content = ""
  editMailContent.id = 0
  editMailContent.filesList = []
}
//删除日记
const deleteMail = (id: number) => {
  proxy?.$del(`/diary/record/${id}`).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
      getMail()
    } else {
      proxy?.$message.error(res.message)
    }
  })
}
//更新日记
const updateMail = () => {
  proxy
    ?.$patch("/diary/record", {
      content: editMailContent.content,
      id: editMailContent.id,
      files: editMailContent.filesList
    })
    .then((res: any) => {
      if (res.code == 200) {
        proxy?.$message.success(res.data.message)
        initEditModal()
        getMail()
      } else {
        proxy?.$message.error(res.message)
      }
    })
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
      name="diary"
      action="api/v1/upload/diary-image"
      :headers="uploadHeaders"
      v-model:file-list="fileList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      accept="image/*"
      @change="handleChange"
      @remove="removeImage"
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
      <div>
        #{{ item.id }} @{{ item.author.owner }} 发布于
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
      <div v-if="item.update_time">
        最后编辑于
        {{
          new Date(item.update_time).toLocaleString(undefined, {
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
    </div>
    <div class="centralArea">
      <pre v-html="item.content"></pre>
      <a-image-preview-group>
        <a-row :gutter="[4, 8]">
          <a-col :span="8" :key="key" v-for="(file, key) in item.filesList">
            <a-image :src="file" :height="100" :width="100" :fallback="error_image" />
          </a-col>
        </a-row>
      </a-image-preview-group>
    </div>
    <div class="lowerArea" v-if="item.author.ownerid === userid">
      <div class="lowerAreaLeft">
        <a-popconfirm
          title="确定删除吗？"
          placement="bottomLeft"
          cancelText="取消"
          okText="删除"
          okType="danger"
          @confirm="deleteMail(item.id)"
        >
          <template #icon><question-circle-outlined style="color: red" /></template>
          <DeleteOutlined style="font-size: 18px" />
        </a-popconfirm>
      </div>
      <div class="lowerArearight">
        <EditOutlined style="font-size: 18px" @click="activateEditMail(item)" />
      </div>
    </div>
  </a-card>
  <a-modal
    v-model:open="editMailModalOpen"
    :title="`#${editMailContent?.id}`"
    okText="修改日记"
    cancelText="取消"
    @cancel="initEditModal"
    @ok="updateMail"
  >
    <a-textarea
      v-model:value="editMailContent.content"
      placeholder="日记是空内容哦~不写点什么吗？"
      auto-size
      :bordered="false"
    />
    <a-divider />
    <a-upload
      name="diary"
      action="api/v1/upload/diary-image-patch"
      :headers="uploadHeaders"
      :data="{ dirayId: editMailContent.id }"
      v-model:file-list="editMailContent.filesList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      accept="image/*"
      @change="handleChange"
    >
      <div v-if="editMailContent.filesList.length < 9">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-modal>
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
  margin-bottom: 1em;
}
.lowerArea {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
}
</style>
