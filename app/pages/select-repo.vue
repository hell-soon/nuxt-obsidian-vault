<script setup lang="ts">
const { data, status } = await useFetch('/api/repos')
</script>

<template>
  <h1>Select repo</h1>
  <div class="">
    <pre>{{ data }}</pre>
    <pre>{{ status }}</pre>
  </div>
</template>
