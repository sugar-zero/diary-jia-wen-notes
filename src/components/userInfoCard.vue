<script lang="ts" setup>
import { EditOutlined, LogoutOutlined } from "@ant-design/icons-vue"
import { getCurrentInstance, reactive, ref, h } from "vue"
import componentsForm from "./componentsForm.vue"
import router from "../router"
// @ts-ignore
const { proxy } = getCurrentInstance()
const { screenStatus } = defineProps(["screenStatus"])
const logout = () => {
  localStorage.removeItem("token")
  proxy?.$message.success("已出退登录")
  router.push({ name: "login" })
}
interface userInfo {
  nickname: string
  username: string
  signature: string
  avatar: string
  userBg: string
}
let userInfo = reactive<userInfo>({
  nickname: "",
  username: "",
  signature: "",
  avatar: "",
  userBg: ""
})
let userInfoArray = ref([
  {
    nickname: "",
    signature: "",
    avatar: "",
    userBg: ""
  }
])

const userInfoLableForm = ref([
  {
    model: "nickname",
    label: "昵称",
    placeholder: "昵称为空将显示用户名"
  },
  {
    model: "signature",
    label: "签名"
  },
  {
    model: "avatar",
    label: "头像",
    type: "avatarUpload"
  },
  {
    model: "userBg",
    label: "背景",
    type: "img"
  }
])
const formConfig = ref({
  button: [
    {
      label: "修改",
      type: "primary"
    }
  ]
})
// let tryCount: number = 0
const getUserInfo = () => {
  proxy?.$get("/user/info").then((res: any) => {
    if (res.code == 200) {
      userInfo.nickname = res.data.data.nickname
      userInfo.username = res.data.data.username
      userInfo.signature = res.data.data.signature
      userInfo.avatar = res.data.data.avatar
      userInfo.userBg = res.data.data.userBg
      userInfoArray.value = [res.data.data]
    }
  })
}
getUserInfo()
const showEditUserInfoModal = ref<boolean>(false)
const EditUserInfoModal = () => {
  showEditUserInfoModal.value = true
}
const updateUserInfo = (row: any) => {
  proxy?.$put("/user/info", row).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success("修改成功")
      userInfo.nickname = res.data.data.nickname
      userInfo.username = res.data.data.username
      userInfo.signature = res.data.data.signature
      userInfo.avatar = res.data.data.avatar
      userInfo.userBg = res.data.data.userBg
      userInfoArray.value = [res.data.data]
    }
  })
}
</script>
<template>
  <a-card style="width: 100%" v-if="screenStatus == 'pc'">
    <template #cover v-if="userInfo.userBg">
      <img alt="example" :src="userInfo.userBg" />
    </template>
    <template #actions>
      <!-- <setting-outlined key="setting" /> -->
      <edit-outlined key="edit" @click="EditUserInfoModal" />
      <a-popconfirm
        placement="bottomRight"
        title="是否要退出登录？"
        ok-text="是的"
        cancel-text="不了"
        @confirm="logout"
      >
        <logout-outlined key="ellipsis" />
      </a-popconfirm>
    </template>
    <a-card-meta
      :title="userInfo.nickname ? userInfo.nickname : userInfo.username"
      :description="userInfo.signature"
    >
      <template #avatar>
        <a-avatar
          v-if="userInfo.avatar"
          :src="userInfo.avatar"
          :size="{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }"
        />
        <a-avatar v-else :size="{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }">{{
          userInfo.nickname.slice(0, 1)
        }}</a-avatar>
      </template>
    </a-card-meta>
  </a-card>
  <!-- 手机端显示 -->
  <div v-else>
    <img
      alt="用户背景"
      :src="userInfo.userBg"
      style="
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        position: relative;
        top: 0;
        height: 50%;
      "
      v-if="userInfo.userBg"
    />
    <a-list item-layout="horizontal" :data-source="userInfoArray">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item.signature">
            <template #title>
              <span>{{ userInfo.nickname ? userInfo.nickname : userInfo.username }}</span>
            </template>
            <template #avatar>
              <a-avatar v-if="item.avatar" :src="item.avatar" :size="{ xs: 40, sm: 50, md: 60 }" />
              <a-avatar v-else :size="{ xs: 40, sm: 50, md: 60 }">{{
                item.nickname.slice(0, 1)
              }}</a-avatar>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-button
      :icon="h(EditOutlined)"
      style="margin-left: 10px"
      type="text"
      @click="EditUserInfoModal"
      >修改个人信息</a-button
    >
    <a-popconfirm
      placement="bottomRight"
      title="是否要退出登录？"
      ok-text="是的"
      cancel-text="不了"
      @confirm="logout"
    >
      <a-button :icon="h(LogoutOutlined)" style="margin-left: 10px" type="text">退出登录</a-button>
    </a-popconfirm>
  </div>
  <a-modal
    v-model:open="showEditUserInfoModal"
    title="修改个人信息"
    ok-text="修改"
    cancel-text="取消"
    :maskClosable="false"
    :footer="null"
    :destroyOnClose="true"
  >
    <components-form
      :formData="userInfo"
      :formLabelData="userInfoLableForm"
      :formConfig="formConfig"
      @edit="updateUserInfo"
    />
  </a-modal>
</template>
<style lange="less">
.ant-card-meta-description {
  word-break: break-word;
}
</style>
