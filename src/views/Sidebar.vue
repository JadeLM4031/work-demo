<template>
  <el-row class="tac">
    <el-col :span="24">
      <h5 class="mb-2">Default colors</h5>
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>基础</span>
          </template>
          <el-menu-item index="basemap">基础地图</el-menu-item>
          <el-menu-item index="tianditu">天地图</el-menu-item>
          <el-menu-item index="graphics">点线面</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Demo</span>
          </template>
          <el-menu-item index="tabledemo">table选中行</el-menu-item>
          <el-menu-item index="export_excel_demo">导出excel（暂无）</el-menu-item>
          <el-menu-item index="image_overlay_demo">图片矩形标注</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
// 上方图片引用了
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue"

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
<style lang="scss" scoped>
.tac {
  height: 100vh;
  background-color: rgb(243, 247, 238);
}
</style>
