<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(true);
</script>

<template>
  <a-card style="width: 50vw" :loading="loading">
    loading
  </a-card>
</template>

<style scoped></style>