<script setup lang="ts">
import { ref, h, reactive, getCurrentInstance } from "vue"
import {
  SendOutlined,
  EditOutlined,
  CommentOutlined,
  RightCircleFilled
} from "@ant-design/icons-vue"
import { type UploadProps, type UploadChangeParam } from "ant-design-vue"
//引入404图
import error_image from "@/assets/404.jpg"
//引入store
import { userStore } from "@/stores/main"
import type { ComponentInternalInstance } from "vue"
const { userid } = userStore()
const { proxy } = getCurrentInstance() as ComponentInternalInstance

const pageSize = ref(20)
const current = ref(1)
const postedListLength = ref(100)
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
      ownerId: number
      ownerAvatar: string
    }
    filesList: []
    comments: {
      commentator: {
        user: string
        userId: number
        userAvatar: string
      }
      content: string
      id: number
      comment_time: string
    }[]
    likes: {
      like_time: string
      liker: {
        user: string
        userId: number
      }
    }[]
    isCurrentUserLiked: boolean
    comment: {
      reply?: object
      content: string
    }
    commentShow: boolean
    placeholder: string
  }[]
}
//编辑日记接口
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
  postedList: []
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
        postedMailLoading.value = false
        getMail()
      } else {
        proxy?.$message.error(res.message)
        postedMailLoading.value = false
      }
    })
}

//获取全部日记列表
const getMail = () => {
  proxy?.$get(`/diary/record?page=${current.value}&size=${pageSize.value}`).then((res: any) => {
    if (res.code == 200) {
      data.postedList = res.data.diaries
      postedListLength.value = res.data.totalCount
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

// 把图转换为base64
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
  if ("response" in file) {
    file.preview = file.response.data.data
  } else {
    file.preview = file.url
  }
  // file.preview = file.response.data.data ? file.url : file.response.data.data

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
// 编辑评论
const editComment = (action: string, item: any, reply?: any) => {
  if (action === "comment") {
    item.commentShow = !item.commentShow
    item.placeholder = "评论"
    item.comment = { content: "" }
  } else if (action === "reply") {
    item.commentShow = item.commentShow ? item.commentShow : !item.commentShow
    item.placeholder = `回复@${reply.reply.user}`
    item.comment = { reply: reply.reply, content: "" }
  }
}
// 发布评论
const postComment = (diaryId: number, userId: number, comment: object) => {
  proxy?.$post("/diary/comment", { diaryId, userId, comment }).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
      getMail()
    } else {
      proxy?.$message.error(res.data.join("、"))
    }
  })
}
//删除评论
const deleteComment = (userId: number, commentId: number) => {
  proxy?.$deldata("/diary/comment", { userId, commentId }).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
      getMail()
    } else {
      proxy?.$message.error(res.message)
    }
  })
}
//点赞
const likeMail = (userId: number, diaryId: number) => {
  proxy?.$post("/diary/like", { userId, diaryId }).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
      getMail()
    } else {
      proxy?.$message.error(res.message)
    }
  })
}
// 取消点赞
const cancelLikeMail = (userId: number, diaryId: number) => {
  proxy?.$deldata("/diary/like", { userId, diaryId }).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
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
      action="api/v2/upload/diary-image"
      :headers="uploadHeaders"
      v-model:file-list="fileList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      accept="image/*"
      :max-count="9"
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
      <div style="display: flex; justify-content: space-between">
        <div>
          #{{ item.id }}
          <a-avatar size="small" :src="item.author.ownerAvatar" v-if="item.author.ownerAvatar" />
          <a-avatar v-else size="small">{{ item.author.owner.slice(0, 1) }}</a-avatar>
          @{{ item.author.owner }}
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
        <a-dropdown
          placement="bottomRight"
          :trigger="['click']"
          v-if="item.author.ownerId === userid"
        >
          <MoreOutlined style="font-size: 18px" />
          <template #overlay>
            <a-menu>
              <a-menu-item>
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
                  删除日记
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <div @click="activateEditMail(item)">
                  <EditOutlined style="font-size: 18px" />
                  编辑日记
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
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
    <br />
    <div class="centralArea">
      <pre v-html="item.content" style="white-space: pre-wrap; word-wrap: break-word"></pre>
      <!-- <a-image-preview-group> -->
      <a-row class="photo_wall">
        <a-col :key="key" v-for="(file, key) in item.filesList">
          <a-image
            :src="file"
            :height="100"
            :width="100"
            loading="lazy"
            :error="error_image"
            decoding="async"
          />
        </a-col>
      </a-row>
      <!-- </a-image-preview-group> -->
    </div>
    <div class="lowerArea">
      <div class="lowerArearight"></div>
      <div style="display: flex; justify-content: space-between; width: 50px">
        <LikeTwoTone
          style="font-size: 18px"
          v-if="item.isCurrentUserLiked"
          @click="cancelLikeMail(userid, item.id)"
        />
        <LikeOutlined style="font-size: 18px" @click="likeMail(userid, item.id)" v-else />
        <CommentOutlined style="font-size: 18px" @click="editComment('comment', item)" />
      </div>
    </div>
    <!-- 点赞/评论区 -->
    <a-divider style="margin: 10px 0" v-if="item.likes.length > 0 || item.comments.length > 0" />
    <div class="commentSection">
      <div v-if="item.likes.length > 0">
        <LikeFilled /><span v-for="liker in item.likes"> @{{ liker.liker.user }}</span>
      </div>
      <div v-if="item.commentShow" class="commentStyle">
        <a-textarea
          v-model:value="item.comment.content"
          :placeholder="item.placeholder"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :rows="4"
          allow-clear
          :bordered="false"
        />
        <a-button type="link" @click="postComment(item.id, userid, item.comment)"
          >发表评论</a-button
        >
      </div>
      <div v-for="(commentItem, key) in item.comments" :key="key" style="word-wrap: break-word">
        <a-avatar
          size="small"
          :src="commentItem.commentator.userAvatar"
          style="width: 20px; height: 20px"
          v-if="commentItem.commentator.userAvatar"
        />
        <a-avatar v-else size="small" style="width: 20px; height: 20px; font-size: 12px">{{
          commentItem.commentator.user.slice(0, 1)
        }}</a-avatar>
        @{{ commentItem.commentator.user }}: {{ commentItem.content }}
        <a-popconfirm
          title="确定删除此评论吗？"
          placement="right"
          cancelText="取消"
          okText="删除"
          okType="danger"
          @confirm="deleteComment(commentItem.commentator.userId, commentItem.id)"
          v-if="commentItem.commentator.userId === userid"
        >
          <DeleteFilled />
        </a-popconfirm>
        <RightCircleFilled
          v-else
          @click="editComment('reply', item, { reply: commentItem.commentator })"
        />
      </div>
    </div>
  </a-card>
  <a-pagination
    v-model:current="current"
    v-model:pageSize="pageSize"
    show-size-changer
    :total="postedListLength"
  />
  <!-- 编辑日记 -->
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
      action="api/v2/upload/diary-image-patch"
      :headers="uploadHeaders"
      :data="{ dirayId: editMailContent.id }"
      v-model:file-list="editMailContent.filesList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      :max-count="9"
      accept="image/*"
      @change="handleChange"
    >
      <div v-if="editMailContent.filesList.length < 9">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
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
.lowerAreaLeft {
  display: contents;
}
.commentSection {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}
.commentStyle {
  border-radius: 10px;
  border: solid 1px;
  border-color: #39c5bb;
  text-align: right;
}
.photo_wall {
  width: 320px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 100px);
  grid-template-rows: repeat(auto-fit, 100px);
  grid-column-gap: 1%;
  grid-row-gap: 2%;
}
</style>
