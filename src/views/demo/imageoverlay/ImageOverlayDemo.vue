<template>
  <div class="container">
    <div class="img-Box" :key="imageInfo.url">
      <div class="img" id="imgBox">
        <!-- 用来获取原图宽高 -->
        <img id="img_size" :src="imageInfo.url" alt="" v-show="false" />
        <div id="main_img" :style="`background-image:url(${imageInfo.url})`"></div>

        <!-- 用来大图预览 -->
        <!-- <image-viewer v-if="bigImageVisible" :on-close="closeViewer" :url-list="[fileUrl + curImgInfo.savePath]" /> -->
      </div>
    </div>

    <!-- 添加标注弹窗 -->
    <el-dialog title="添加标注" v-model="addLabelVisible" width="35%">
      <p>矩形框信息</p>
      <p>X: {{ addform.positionX }}</p>
      <p>Y: {{ addform.positionY }}</p>
      <p>width: {{ addform.width }}</p>
      <p>height: {{ addform.height }}</p>
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

      addLabelVisible: false,
    }
  },

  created() {},
  mounted() {
    this.initImageOverlay()
  },
  beforeDestroy() {
    console.log("页面销毁")
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
  },
}
</script>

<style lang="scss" scoped>
.container {
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
</style>
