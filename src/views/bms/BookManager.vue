<template>
  <div>
    <!--    搜索框-->
    <div>
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>Search</span>
          <el-button
              style="float: right"
              @click="handleSearchList()"
              type="primary"
              size="small">
            Result
          </el-button>
          <el-button
              style="float: right;margin-right: 15px"
              @click="handleResetSearch()"
              size="small">
            Reset
          </el-button>
        </div>

        <div style="margin-top: 15px">
          <el-form :inline="true" :model="searchParams" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="Key word"></el-input>
            </el-form-item>
            <el-form-item label="书籍编号：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="书籍编号"></el-input>
            </el-form-item>
            <el-form-item label="Publisher">
              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="书籍出版商"></el-input>
            </el-form-item>
            <el-form-item label="Book Category：">
              <el-cascader
                  clearable
                  v-model="selectCategoryValue"
                  :options="bookCateOptions"
                  @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="上架状态：">
              <el-select v-model="searchParams.status" placeholder="全部" clearable>
                <el-option
                    v-for="item in publishStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button
                style="float: right"
                @click="handleSaveBatch()"
                type="primary"
                size="small">
              批量上架
            </el-button>
            <el-button
                style="float: right;margin-right: 15px"
                @click="handleDeleteBatch()"
                size="small">
              批量下架
            </el-button>
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="book"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <!--        多选框-->
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="bookName"
            label="名称">
        </el-table-column>
        <el-table-column
            prop="writer"
            label="作者">
        </el-table-column>
        <el-table-column
            prop="category"
            label="分类">
        </el-table-column>
        <el-table-column
            prop="publisher"
            label="出版商">
        </el-table-column>
        <el-table-column
            prop="stock"
            label="库存">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
        </el-table-column>
        <!--        操作-->
        <el-table-column
            fixed="right"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 0" @click="handleSave(scope.row)" type="primary" size="small">上架</el-button>
            <el-button v-else @click="handleDelete(scope.row)" type="primary" size="small">下架</el-button>
            <el-button @click="changeDialogFormVisible(scope.row)" type="success" size="small">改变库存</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog title="改变库存信息" :visible.sync="dialogFormVisible" width="30%" >
        <el-form label-width="80px" size="small" >
          <el-form-item label="库存编号">
            <el-input v-model="stock.bookId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新库存">
            <el-input v-model="stock.stock" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeStock">确定</el-button>
            <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </template>
    <!--    分页-->
    <template>
      <div class="block" >
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.pageNum"
            :page-sizes="pageSizeList"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.total">
        </el-pagination>
      </div>
    </template>


  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索变量
      searchParams: {},
      multipleSelection: [],
      selectCategoryValue: {},
      bookCateOptions: [],
      dialogFormVisible: false,
      publishStatusOptions: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],

      // 表格数据
      book: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4,8,10,20],
      // 多选

      stock: {
        id: null,
        stock: null,
      },


    }
  },
  created () {
    this.getBookDetail()
    this.getBookCategoryList()
  },

  methods: {
    // 获取书籍信息
    getBookDetail() {
      this.requestBook.post("/book/admin/list", this.params).then(res => {
        // console.log(res)
        if (res) {
          this.params = res.page
          this.book = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize=val
      this.getBookDetail()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getBookDetail()
      console.log(`当前页: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格操作
    // 上架
    handleSave(row) {
      console.log([row.id])
      console.log(JSON.stringify(row.id))
      this.requestBook.post("/book/admin/save", [row.id]).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getBookDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    // 下架
    handleDelete(row) {
      console.log([row.id])
      this.requestBook.post("/book/admin/delete", [row.id]).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getBookDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },

    handleSaveBatch() {
      let ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.requestBook.post("/book/admin/save", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '上架成功',
            type: 'success'
          });
          this.getBookDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    handleDeleteBatch(row) {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.requestBook.post("/book/admin/delete", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '下架成功',
            type: 'success'
          });
          this.getBookDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    changeDialogFormVisible(row) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.stock.bookId = row.id
      this.stock.stock = row.stock
      console.log(this.stock)
    },
    // 购入书籍
    changeStock(row) {
      this.requestBook.post("/book/admin/change/stock", this.stock).then(res =>{
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.changeDialogFormVisible()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },

    // deleteSava(row) {
    //   var data = "admin"
    //   console.log(JSON.stringify(data))
    //   this.request.post("/book/user/check/username", JSON.stringify(data)).then(res => {
    //     // console.log(res)
    //     if (res.code == 200) {
    //       var list = res.page.list
    //       for (let i = 0; i < list.length; i++) {
    //         this.bookCateOptions.push({label: list[i].category, value: list[i].id});
    //       }
    //       // console.log(this.bookCateOptions)
    //     }
    //   })
    // },


    // 分类list
    getBookCategoryList() {
      this.requestBook.post("/library/bookcategory/list", this.params).then(res => {
        // console.log(res)
        if (res.code == 200) {
          var list = res.page.list
          for (let i = 0; i < list.length; i++) {
            this.bookCateOptions.push({label: list[i].category, value: list[i].id});
          }
          // console.log(this.bookCateOptions)
        }
      })
    },
    handleChange(value) {
      console.log(value);
    },

    // search框
    handleSearchList() {
      console.log(this.searchParams)
      this.searchParams.pageNum = 1;
      this.searchParams.categoryId = this.selectCategoryValue[0]
      // this.searchParams.category = this.selectCategoryValue[1]
      this.requestSearch.post("/book/elastic/search", this.searchParams).then(res => {
        // console.log(res)
        this.book = res.page.list
      })
    },


    handleResetSearch() {
      console.log(this.searchParams)
      this.searchParams = {};
      // this.searchParams = Object.assign({}, defaultListQuery);
      this.getBookDetail()
    },
  }
}
</script>
