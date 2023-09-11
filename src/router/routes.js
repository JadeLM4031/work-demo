const routes = [
  // ===========================基础==================================
  {
    name: "tianditu",
    path: "/tianditu",
    component: () => import("../views/basic/tiandiMap/Index.vue"),
  },
  {
    name: "basemap",
    path: "/basemap",
    component: () => import("../views/basic/baseMap/Index.vue"),
  },
  {
    name: "graphics",
    path: "/graphics",
    component: () => import("../views/basic/graphics/Index.vue"),
  },
  // ============================================================

  // ===========================Demo================================
  {
    name: "tabledemo",
    path: "/tabledemo",
    component: () => import("../views/demo/TableDemo.vue"),
  },
  {
    name: "export_excel_demo",
    path: "/export_excel_demo",
    component: () => import("../views/demo/ExportExcelDemo.vue"),
  },
  {
    name: "image_overlay_demo",
    path: "/image_overlay_demo",
    component: () => import("../views/demo/imageoverlay/ImageOverlayDemo.vue"),
  },
  // =============================================================
]
export default routes
