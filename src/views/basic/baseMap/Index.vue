<template>
  <div ref="mapViewDiv" style="height: 100vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import esriConfig from "esri/config"
import Map from "esri/Map"
import MapView from "esri/views/MapView"
import BasemapToggle from "esri/widgets/BasemapToggle"
import BasemapGallery from "esri/widgets/BasemapGallery"

const mapViewDiv = ref(null)

onMounted(() => {
  // 在这里可以使用导入的模块
  // 例如：
  esriConfig.request.trustedServers.push("example.com")

  

  // 基础地图
  const map = new Map({
    basemap: "streets",
  })

  // 地图视图
  const view = new MapView({
    map: map,
    container: mapViewDiv.value,
    center: [117.12, 36.68],
    zoom: 12,
  })

  // 底图切换
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite",
  })
  view.ui.add(basemapToggle, "bottom-right")


  // 默认底图列表
  const basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div"),
  })

  view.ui.add(basemapGallery, "bottom-right")
})
</script>

<style>
/* 可以在这里添加地图容器的自定义样式 */
</style>
