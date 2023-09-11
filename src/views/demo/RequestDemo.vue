<template>
  <div class="a">
    <span>111111</span>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";

const instance = getCurrentInstance();
const $request = instance.appContext.config.globalProperties.$request

$request.get('@/views/aaa.json').then((result) => {
  console.log(result);
}).catch((err) => {
  
});
</script>

<style scoped lang="scss">
.a {
  span {
    color: red;
  }
}
</style>
