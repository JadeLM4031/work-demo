<template>
  <el-table
    ref="singleTable"
    :data="tableData"
    highlight-current-row
    @current-change="handleCurrentChange"
    @row-click="handleClickRow"
    height="200px"
  >
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column property="date" label="日期" width="120"> </el-table-column>
    <el-table-column property="name" label="姓名" width="120" show-overflow-tooltip> </el-table-column>
    <el-table-column property="address" label="地址"> </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="setCurrent(tableData[1])">选中第二行</el-button>
    <el-button @click="setCurrent()">取消选择</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address:
            "上海市普陀区金沙江路 1517 弄aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      currentRow: null,
      timer: null,
    }
  },

  created() {
    console.log("创建")
    let i = 0
    this.timer = setInterval(() => {
      let cur = this.tableData[i]
      this.setCurrent(cur)
      // setTimeout(() => {
      let top = document.getElementsByClassName("current-row")[0].offsetTop
      console.log("top", top)
      this.$refs.singleTable.scrollTo({ top: top, behavior: "smooth" })
      // }, 500)

      i++
      if (i == this.tableData.length) {
        i = 0
      }
    }, 1000)
  },
  beforeUnmount() {
    console.log("销毁")
    clearInterval(this.timer)
  },

  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleClickRow(row) {
      console.log("当前行数据", row, this.$refs.singleTable.$index)
      console.log(this.$refs.singleTable)
      setTimeout(() => {
        console.log(document.getElementsByClassName("current-row")[0].offsetTop())
      }, 1000)
    },
  },
}
</script>

<style>
.el-table__body tr.current-row > td {
  background-color: #1fa364c2 !important; /* 更改为你想要的颜色 */
}
</style>
