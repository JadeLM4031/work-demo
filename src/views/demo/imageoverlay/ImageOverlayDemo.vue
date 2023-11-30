<template>
  <div class="container">
    <div class="left">
      <div class="img-Box" :key="imageInfo.url">
        <div class="img" id="imgBox">
          <!-- 用来获取原图宽高 -->
          <img id="img_size" :src="imageInfo.url" alt="" v-show="false" />
          <div id="main_img" :style="`background-image:url(${imageInfo.url})`"></div>

          <!-- 用来大图预览 -->
          <!-- <image-viewer v-if="bigImageVisible" :on-close="closeViewer" :url-list="[fileUrl + curImgInfo.savePath]" /> -->
        </div>
      </div>
    </div>

    <div class="right">
      <title>标注列表</title>
      <div class="list-box" style="height: calc(100% - 20px)">
        <el-timeline reverse>
          <el-timeline-item v-for="(item, i) in labelList" :key="i" :timestamp="item.createTime" color="#F89B02">
            <div class="box-container">
              <div class="box-left">
                <p>positionX：{{ item.positionX }}</p>
                <p>positionY：{{ item.positionY }}</p>
                <p>width：{{ item.width }}</p>
                <p>height：{{ item.height }}</p>
              </div>
              <div class="box-right">
                <el-button type="primary" size="small" @click="handleClickPosition(item)"> 定位 </el-button>
                <el-button type="danger" size="small" @click="handleClickDeleteLabel(item, i)"> 删除 </el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 添加标注弹窗 -->
    <el-dialog title="添加标注" v-model="addLabelVisible" width="35%">
      <p>矩形框信息</p>
      <p>X: {{ addform.positionX }}</p>
      <p>Y: {{ addform.positionY }}</p>
      <p>width: {{ addform.width }}</p>
      <p>height: {{ addform.height }}</p>
      <el-button @click="handleClickSave">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageInfo: {
        url: "/src/views/demo/imageoverlay/img/1.JPG",
      },
      // 标注
      scale: 1,
      dragging: false, // 是否拖动，初始为 false
      startX: 0,
      startY: 0,
      X: 0,
      Y: 0,

      // 弹窗获取矩形框信息
      addform: {
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
      },
      labelList: [],

      addLabelVisible: false,
    }
  },

  created() {},
  mounted() {},
  beforeMount() {
    console.log("渲染之前")
    this.initImageOverlay()
  },
  beforeUnmount() {
    console.log("销毁之前")
    this.removeImageOverlay()
  },

  methods: {
    // 初始化图片标注
    initImageOverlay() {
      // var that = this
      // 右键自定义功能菜单
      // document.addEventListener("contextmenu", function(e) {
      //   var labelImageBox = document.getElementById("main_img1")
      //   if (labelImageBox && labelImageBox.contains(e.srcElement)) {
      //     e.preventDefault() // 阻止默认菜单
      //     that.handleClickBigImage()
      //     // var myContextMenu = document.getElementById("myContextMenu")
      //     // console.log(e);
      //     // myContextMenu.style.display = "block"
      //     // myContextMenu.style.left = e.offsetX + "px"
      //     // myContextMenu.style.top = e.offsetY + "px"
      //   }
      // })
      // document.addEventListener("click", function(e) {
      //   var myContextMenu = document.getElementById("myContextMenu")
      //   if (myContextMenu && !myContextMenu.contains(e.srcElement)) {
      //     myContextMenu.style.display = "none"
      //   }
      // })

      window.addEventListener("wheel", this.handleEventWheel)
      window.addEventListener("mousedown", this.handleEventMousedown)
      window.addEventListener("mousemove", this.handleEventMousemove)
      window.addEventListener("mouseup", this.handleEventMouseup)
    },
    removeImageOverlay() {
      window.removeEventListener("wheel", this.handleEventWheel)
      window.removeEventListener("mousedown", this.handleEventMousedown)
      window.removeEventListener("mousemove", this.handleEventMousemove)
      window.removeEventListener("mouseup", this.handleEventMouseup)
    },
    handleEventWheel(e) {
      // console.log("执行了滚动事件监听", e)
      var labelImageBox = document.getElementById("main_img")
      if (labelImageBox && labelImageBox.contains(e.srcElement)) {
        // console.log("触发图片缩放", e)
        // this.scale = document.getElementById("imgBox").style.scale || 1
        let curTransform = document.getElementById("imgBox").style.transform
        var regex = /scale\((.*?)\)/
        var result = regex.exec(curTransform)

        if (result && result[1]) {
          this.scale = +result[1]
        } else {
          this.scale = 1
        }

        if (e.deltaY < 0) {
          // document.getElementById("imgBox").style.scale = this.scale < 10 ? this.scale * 1.05 : 10
          document.getElementById("imgBox").style.transform = this.scale < 10 ? `scale(${this.scale * 1.15})` : `scale(10)`
        } else {
          // document.getElementById("imgBox").style.scale = this.scale > 0.3 ? this.scale * 0.95 : 0.3
          document.getElementById("imgBox").style.transform = this.scale > 0.3 ? `scale(${this.scale * 0.85})` : `scale(0.3)`
        }
      }
    },
    handleEventMousedown(e) {
      e.stopPropagation()
      var labelImageBox = document.getElementById("main_img")
      if (labelImageBox && labelImageBox.contains(e.srcElement)) {
        this.dragging = true
        console.log("点击图片")
        this.startX = e.offsetX
        this.startY = e.offsetY
        this.X = e.x
        this.Y = e.y

        if (e.ctrlKey) {
          // console.log("鼠标按下", e.preventDefault)
          // 先删之前的
          var ab = document.getElementById("active_box")
          ab && document.getElementById("main_img").removeChild(ab)
          // 判断鼠标点击在图片区域内时  在页面创建 box
          var active_box = document.createElement("div")
          active_box.id = "active_box"
          active_box.className = "box"
          active_box.style.top = this.startY + "px"
          active_box.style.left = this.startX + "px"
          active_box.style.position = "absolute"
          active_box.style.border = "1px solid #FF0000"
          active_box.style.zIndex = "3000"
          labelImageBox.appendChild(active_box)
          // document.body.appendChild(active_box);
          // active_box = null;
        }
      }
    },
    handleEventMousemove(e) {
      if (e.ctrlKey) {
        // 更新 box 尺寸
        if (document.getElementById("active_box") !== null) {
          var ab = document.getElementById("active_box")
          ab.style.width = e.offsetX - this.startX + "px"
          ab.style.height = e.offsetY - this.startY + "px"
        }
        // // 移动，更新 box 坐标
        // if (document.getElementById("moving_box") !== null && dragging) {
        //   var mb = document.getElementById("moving_box")
        //   mb.style.top = e.offsetX - diffY + "px"
        //   mb.style.left = e.offsetY - diffX + "px"
        // }
      }
      // console.log('滚动事件',e.target.localName);
      // 移动，更新 图片位置
      if (e.target.localName === "div" && this.dragging && !e.ctrlKey) {
        // console.log("鼠标移动", e)
        var mb = document.getElementById("main_img")

        // console.log(mb.style.top, e.y, this.Y)
        // console.log("000000000000000000000", +mb.style.top.replace("px", ""), +e.y, +this.Y, +this.scale)
        mb.style.top = +mb.style.top.replace("px", "") + (+e.y - +this.Y) / +this.scale + "px"
        mb.style.left = +mb.style.left.replace("px", "") + (+e.x - +this.X) / +this.scale + "px"
        this.X = e.x
        this.Y = e.y
        // console.log(mb.style.top)
      }
    },
    handleEventMouseup(e) {
      // console.log('鼠标抬起',e);
      this.dragging = false
      if (e.ctrlKey) {
        // 禁止拖动
        if (document.getElementById("active_box") !== null) {
          var ab = document.getElementById("active_box")
          // console.log("query", [ab.offsetTop, ab.offsetLeft, ab.offsetWidth, ab.offsetHeight])

          let widthScale = document.getElementById("img_size").naturalWidth / document.getElementById("main_img").offsetWidth
          let heightScale = document.getElementById("img_size").naturalHeight / document.getElementById("main_img").offsetHeight
          let scale = Math.max(widthScale, heightScale)

          this.addform.positionX = ab.offsetLeft * scale
          this.addform.positionY = ab.offsetTop * scale
          this.addform.width = ab.offsetWidth * scale
          this.addform.height = ab.offsetHeight * scale
          document.getElementById("main_img").removeChild(ab)
          // ab.removeAttribute("id")
          // 如果长宽均小于 3px，移除 box
          // if (ab.offsetWidth < 3 || ab.offsetHeight < 3) {
          //   document.body.removeChild(ab)
          // }
          // this.isLabeling = false
          // this.addLabel(ab.offsetTop, ab.offsetLeft, ab.offsetWidth, ab.offsetHeight)
          // console.log(this.addform.positionX, this.addform.positionY, this.addform.width, this.addform.height)
          // console.log(document.getElementById("img_size").naturalWidth, document.getElementById("img_size").naturalHeight)
          this.addLabelVisible = true
        }
      } else {
        var ab = document.getElementById("active_box")
        ab && document.getElementById("main_img").removeChild(ab)
      }
    },

    handleClickSave() {
      console.log(this.addform)
      var labelImageBox = document.getElementById("main_img")

      let widthScale = document.getElementById("img_size").naturalWidth / document.getElementById("main_img").offsetWidth
      let heightScale = document.getElementById("img_size").naturalHeight / document.getElementById("main_img").offsetHeight
      let renderScale = Math.max(widthScale, heightScale)
      // 在页面创建 box
      var defect_box = document.createElement("div")
      defect_box.id = "defect_box"
      // defect_box.className = "box";
      defect_box.style.top = this.addform.positionY / renderScale + "px"
      defect_box.style.left = this.addform.positionX / renderScale + "px"
      defect_box.style.width = this.addform.width / renderScale + "px"
      defect_box.style.height = this.addform.height / renderScale + "px"

      defect_box.style.position = "absolute"
      defect_box.style.border = "2px solid rgb(255 25 0)"
      defect_box.style.zIndex = "3000"
      labelImageBox.appendChild(defect_box)

      this.labelList.push({ ...this.addform, createTime: new Date().toLocaleString() })
      this.addLabelVisible = false
    },

    // 点击定位
    handleClickPosition(info) {
      // return
      console.log(info)

      var labelImageBox = document.getElementById("main_img")

      // 移除上一个
      var preDefectBox = document.getElementById("active_defect_box")
      if (preDefectBox) {
        labelImageBox.removeChild(preDefectBox)
      }

      // -------------------------添加缺陷框start-------------------------------------
      let widthScale = document.getElementById("img_size").naturalWidth / document.getElementById("main_img").offsetWidth
      let heightScale = document.getElementById("img_size").naturalHeight / document.getElementById("main_img").offsetHeight
      let renderScale = Math.max(widthScale, heightScale)
      // 在页面创建 box
      var active_defect_box = document.createElement("div")
      active_defect_box.id = "active_defect_box"
      // active_defect_box.className = "box";
      active_defect_box.style.top = info.positionY / renderScale + "px"
      active_defect_box.style.left = info.positionX / renderScale + "px"
      active_defect_box.style.width = info.width / renderScale + "px"
      active_defect_box.style.height = info.height / renderScale + "px"

      console.log(renderScale, info.positionX, info.positionY, info.width, info.height)

      active_defect_box.style.position = "absolute"
      active_defect_box.style.border = "2px solid rgb(27 255 0)"
      active_defect_box.style.zIndex = "3000"
      labelImageBox.appendChild(active_defect_box)
      // -------------------------end-------------------------------------

      // -------------------------缺陷框定位-------------------------------
      // 首先移除缩放效果，设置比例为1，确保下方代码执行之前，图片回到原始比例，动画会影响计算结果
      this.scale = 1
      document.getElementById("imgBox").style.transition = "none"
      document.getElementById("imgBox").style.transform = `scale(1)`

      const imgBox = document.getElementById("imgBox")
      const mainImg = document.getElementById("main_img")
      const activeDefectBox = document.getElementById("active_defect_box")

      const imgBoxRect = imgBox.getBoundingClientRect()
      const mainImgRect = mainImg.getBoundingClientRect()
      const activeDefectBoxRect = activeDefectBox.getBoundingClientRect()

      // 计算框相对于图片中心的距离
      const offsetX = mainImgRect.width / 2 - info.positionX / renderScale - info.width / renderScale / 2
      const offsetY = mainImgRect.height / 2 - info.positionY / renderScale - info.height / renderScale / 2

      // 图片相对于外层容器中心的距离
      const mainImgLeft = (imgBoxRect.width - mainImgRect.width) / 2
      const mainImgTop = (imgBoxRect.height - mainImgRect.height) / 2

      const moveX = mainImgLeft + offsetX
      const moveY = mainImgTop + offsetY

      mainImg.style.left = moveX + "px"
      mainImg.style.top = moveY + "px"

      active_defect_box = null
      // 再次添加动画效果
      document.getElementById("imgBox").style.transition = "transform 0.5s linear, width 0.5s linear, height 0.5s linear"

      // 计算当前框应该放大的比例
      const activeDefectBoxWidthScale = mainImgRect.width / activeDefectBoxRect.width
      const activeDefectBoxHeightScale = mainImgRect.height / activeDefectBoxRect.height
      const activeDefectBoxScale = Math.min(activeDefectBoxWidthScale, activeDefectBoxHeightScale)

      this.scale = renderScale
      // 比例 * 0.8 为了美观，不撑满整个容器，且可以看到缺陷名称（该数值可以随意修改）
      document.getElementById("imgBox").style.transform = `scale(${activeDefectBoxScale > 10 ? 10 : activeDefectBoxScale * 0.8})`
    },

    // 移除标签
    handleClickDeleteLabel(info, i) {
      this.$message.warning("待开发")
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  .left {
    width: 60vw;
    height: 90vh;
    border: 1px black solid;

    .img-Box {
      width: 60vw;
      height: 90vh;
      overflow: hidden;
      // overscroll-behavior-y:none;
      .img {
        transform: scale(1);
        transition: transform 0.5s linear, width 0.5s linear, height 0.5s linear;

        #main_img {
          width: 100%;
          height: 90vh;
          object-fit: cover;
          position: relative;
          left: 0;
          top: 0;
          // background-image: url(./default.png);
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }
  .right {
    margin: 0 1vw;
    width: 38vw;
    height: 90vh;
    border: 1px black solid;

    .list-box {
      width: 100%;
      overflow-y: auto;
      margin: 10px;

      &::-webkit-scrollbar {
        width: 0 !important;
      }

      p {
        margin: 5px;
      }

      .box-container {
        background-color: #f5f5f5;
        border-radius: 12px;
        padding: 5px;
        width: 92%;

        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .box-left {
          .red {
            color: #ff0000;
          }

          .yellow {
            color: #f89b02;
          }

          .title {
            width: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            // cursor: pointer;
          }
        }
        .box-right {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }
      }
    }
  }
}
</style>
