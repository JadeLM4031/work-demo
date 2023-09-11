<script setup>
import HelloWorld from "./components/HelloWorld.vue"
import Sidebar from "./views/Sidebar.vue"
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Sidebar></Sidebar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-main {
  --el-main-padding: 0;
}
</style>
