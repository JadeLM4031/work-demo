import { createApp } from "vue"
import "./style.css"
import "@arcgis/core/assets/esri/themes/light/main.css"
import App from "./App.vue"
import router from "./router"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import request from "./utiles/request"

const app = createApp(App)

app.config.globalProperties.$request = request

app.use(router)
app.use(ElementPlus)
app.mount("#app")
