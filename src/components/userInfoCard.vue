<script lang="ts" setup>
import {
  EditOutlined,
  LogoutOutlined,
  SyncOutlined,
  BellOutlined,
  ProfileOutlined,
  LockOutlined
} from "@ant-design/icons-vue"
import { getCurrentInstance, reactive, ref, h } from "vue"
import componentsForm from "./componentsForm.vue"
import router from "../router"
import { userStore } from "@/stores/main"
import type { Rule } from "ant-design-vue/es/form"
// @ts-ignore
const { proxy } = getCurrentInstance()
const version = import.meta.env.VITE_VERSION
const { screenStatus } = defineProps(["screenStatus"])
const activeKey = ref("1")
const NotificationPermission = ref(false)
const logout = () => {
  const useUserStore = userStore()
  useUserStore.logout()
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
interface userSecurity {
  originalPassword: string
  password: string
  confirmPassword: string
}
const userSecurity = ref<userSecurity>({
  originalPassword: "",
  password: "",
  confirmPassword: ""
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
      userInfoArray.value = [res.data.data]
    }
  })
}
//获取父组件转发的日记刷新方法
const emits = defineEmits(["refreshMailList", "askNotificationPermission"])
const refreshMailList = () => {
  emits("refreshMailList")
}
const askNotificationPermission = () => {
  emits("askNotificationPermission")
}
// 检测一下通知权限
if (Notification.permission === "default") {
  NotificationPermission.value = false
} else if (Notification.permission === "granted") {
  NotificationPermission.value = true
} else if (Notification.permission === "denied") {
  NotificationPermission.value = false
}
// 用户修改密码规则校验
const userSecurityRules: Record<string, Rule[]> = {
  originalPassword: [
    {
      required: true,
      message: "请输入原密码"
    },
    {
      min: 6,
      max: 50,
      message: "密码长度为6-50位"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入新密码"
    },
    {
      min: 6,
      max: 50,
      message: "密码长度为6-50位"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: "请再次输入密码"
    },
    {
      min: 6,
      max: 50,
      message: "密码长度为6-50位"
    },
    {
      validator: async (rule: Rule, value: string) => {
        if (value !== userSecurity.value.password) {
          return Promise.reject("两次密码不一致")
        } else {
          return Promise.resolve()
        }
      }
    }
  ]
}
const updateUserSecurity = (value: userSecurity) => {
  proxy?.$put("/user/security", userSecurity.value).then((res: any) => {
    if (res.code == 200) {
      proxy?.$message.success(res.data.message)
      logout()
    } else {
      proxy?.$message.error(res.message)
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
      <edit-outlined key="edit" @click="EditUserInfoModal" />
      <sync-outlined @click="refreshMailList" />
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
      >个人信息与订阅</a-button
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
    title="个人信息与订阅"
    ok-text="修改"
    cancel-text="取消"
    :maskClosable="false"
    :footer="null"
    :destroyOnClose="true"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <ProfileOutlined />
            个人信息
          </span>
        </template>
        <components-form
          :formData="userInfo"
          :formLabelData="userInfoLableForm"
          :formConfig="formConfig"
          @edit="updateUserInfo"
        />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <LockOutlined />
            安全
          </span>
        </template>
        <a-form :model="userSecurity" :rules="userSecurityRules" @finish="updateUserSecurity">
          <a-form-item label="原密码" name="originalPassword">
            <a-input-password
              v-model:value="userSecurity.originalPassword"
              placeholder="为空则不修改密码"
            />
          </a-form-item>
          <a-form-item label="新密码" name="password">
            <a-input-password
              v-model:value="userSecurity.password"
              :placeholder="!userSecurity.originalPassword ? '为空则不修改密码' : '请输入新密码'"
            />
          </a-form-item>
          <a-form-item label="确认新密码" name="confirmPassword">
            <a-input-password
              v-model:value="userSecurity.confirmPassword"
              :placeholder="!userSecurity.password ? '为空则不修改密码' : '请确认密码'"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              danger
              type="primary"
              html-type="submit"
              :disabled="
                !userSecurity.originalPassword ||
                !userSecurity.confirmPassword ||
                !userSecurity.password
              "
              >修改密码</a-button
            >
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>
          <span>
            <BellOutlined />
            通知订阅与关于
          </span>
        </template>
        <a-popconfirm
          placement="topLeft"
          title="要订阅消息推送吗？可能稍后需要您授权才能生效"
          ok-text="是的"
          cancel-text="不了"
          @confirm="askNotificationPermission"
          :disabled="NotificationPermission"
        >
          <a-button type="primary" :icon="h(BellOutlined)" :disabled="NotificationPermission">{{
            NotificationPermission ? "已订阅通知" : "订阅通知"
          }}</a-button>
          <a-divider />
          <p>当前版本：{{ version }}</p>
        </a-popconfirm>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<style lange="less">
.ant-card-meta-description {
  word-break: break-word;
}
</style>
