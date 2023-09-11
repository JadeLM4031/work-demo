<template>
  <div ref="mapViewDiv" style="height: 100vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import esriConfig from "@arcgis/core/config"
import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"
import WebTileLayer from "@arcgis/core/layers/WebTileLayer"
import BasemapToggle from "esri/widgets/BasemapToggle"
import BasemapGallery from "esri/widgets/BasemapGallery"
import Basemap from "@arcgis/core/Basemap"

const mapViewDiv = ref(null)

onMounted(async () => {
  // 设置天地图
  esriConfig.request.trustedServers.push("t0.tianditu.gov.cn")

  // 创建天地图矢量图层（墨卡托）
  const vecBaseLayer = new WebTileLayer({
    urlTemplate:
      "http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=69f1748408a893cee9d23943f02b3866",
  })
  const vecAnnoLayer = new WebTileLayer({
    urlTemplate:
      "http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=69f1748408a893cee9d23943f02b3866",
  })
  // 创建天地图影像图层（墨卡托）
  const imgBaseLayer = new WebTileLayer({
    urlTemplate:
      "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=69f1748408a893cee9d23943f02b3866",
  })
  const imgAnnoLayer = new WebTileLayer({
    urlTemplate:
      "http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=69f1748408a893cee9d23943f02b3866",
  })

  // 基础地图
  const map = new Map({
    layers: [imgBaseLayer, imgAnnoLayer],
  })

  // 地图视图
  const view = new MapView({
    map: map,
    container: mapViewDiv.value,
    center: [118, 34], // 初始中心点坐标
    zoom: 12, // 初始缩放级别
  })

  // 创建自定义底图实例
  const customBasemap = new Basemap({
    baseLayers: [vecBaseLayer, vecAnnoLayer], // 你自己的底图图层
    title: "影像图", // 底图名称
  })

  // 底图切换
  const basemapToggle = new BasemapToggle({
    view: view,
    basemap: customBasemap,
  })
  view.ui.add(basemapToggle, "bottom-right")
})
</script>

<style>
/* 可以在这里添加地图容器的自定义样式 */
</style>
