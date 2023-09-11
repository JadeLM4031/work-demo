import axios from "axios"

import nprogress from "nprogress"
import "nprogress/nprogress.css"

// 创建axios实例
const request = axios.create({
  baseURL: "", // 设置基础请求路径
  timeout: 5000, // 设置超时
})

// 请求拦截器
request.interceptors.request.use((configs) => {
  // 请求头追加token
  // if (token) {
  //   configs.headers.token = ""
  // }
  // 进度条
  nprogress.start()
  return configs
})

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    // 成功的回调
    nprogress.done()
    return res.data
  },
  (error) => {
    console.log("error", error)
  }
)
export default request
