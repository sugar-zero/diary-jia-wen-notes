<script setup lang="ts">
import { ref, h, reactive } from "vue"
import { SendOutlined, EditOutlined } from "@ant-design/icons-vue"
import { message } from "ant-design-vue"

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
