<template>
  <div ref="mapViewDiv" style="height: 100vh"></div>
  <el-button @click="getPosition">跳转位置</el-button>
  <div id="fitPolylineButton">11111</div>
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
import Graphic from "esri/Graphic"
import GraphicsLayer from "esri/layers/GraphicsLayer"

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
    // basemap: "streets",
    layers: [imgBaseLayer, imgAnnoLayer],
  })

  // 地图视图
  const view = new MapView({
    map: map,
    container: mapViewDiv.value,
    center: [118, 34], // 初始中心点坐标
    zoom: 12, // 初始缩放级别
  })

  const graphicsLayer = new GraphicsLayer()
  map.add(graphicsLayer)

  const polyline = {
    type: "polyline",
    paths: [
      [118, 34], //Longitude, latitude
      [119, 35], //Longitude, latitude
      [119, 36], //Longitude, latitude
    ],
  }
  const simpleLineSymbol = {
    type: "simple-line",
    color: [226, 119, 40], // Orange
    width: 2,
  }

  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol,
  })
  graphicsLayer.add(polylineGraphic)



  const button = document.getElementById("fitPolylineButton"); // 获取按钮元素


  console.log(button);

button.addEventListener("click", function () {
  const polylineExtent = polylineGraphic.geometry.extent; // 获取折线的包围盒
  const polylineCenter = polylineExtent.center; // 计算包围盒中心点
  view.center = polylineCenter; // 设置地图中心点


  const suitableZoom = calculateSuitableZoom(polylineExtent, view); // 计算适合的地图层级

  // view.zoom = suitableZoom; // 设置地图层级
  // view.zoom = Math.min(Math.max(suitableZoom, 1), 18); // 限制地图层级在 1 到 18 之间

  console.log(polylineExtent);
  console.log(suitableZoom);
});

// 计算适合的地图层级
function calculateSuitableZoom(extent, view) {
  const mapWidth = view.width;
  const mapHeight = view.height;
  const extentWidth = extent.width;
  const extentHeight = extent.height;

  // 计算适合的地图层级
  const suitableZoomX = mapWidth / extentWidth;
  const suitableZoomY = mapHeight / extentHeight;
  const suitableZoom = Math.min(suitableZoomX, suitableZoomY);

  // 限制地图层级在 1 到 18 之间
  return Math.min(Math.max(suitableZoom, 1), 18);
}


});









  const getPosition = ()=>{
    console.log("点击了点位");
  }
</script>

<style>
/* 可以在这里添加地图容器的自定义样式 */
</style>
