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
            <el-form-item label="searchByInput：">
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="菜单名"></el-input>
            </el-form-item>
            <el-form-item label="菜单编号：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="菜单编号"></el-input>
            </el-form-item>
<!--            <el-form-item label="Publisher">-->
<!--              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="Publisher"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="classification：">-->
<!--              <el-cascader-->
<!--                  clearable-->
<!--                  v-model="selectCategoryValue"-->
<!--                  :options="bookCateOptions"-->
<!--                  @change="handleChange"-->
<!--              >-->
<!--              </el-cascader>-->
<!--            </el-form-item>-->
            <el-form-item label="updatestatue：">
              <el-select v-model="searchParams.status" placeholder="all" clearable>
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
                @click="handleDeletemenuBatch()"
                type="primary"
                size="small">
              delete by choosing
            </el-button>
            <!--            <el-button-->
            <!--                style="float: right;margin-right: 15px"-->
            <!--                @click="handleReturnBookBatch()"-->
            <!--                size="small">-->
            <!--              delete by choosing-->
            <!--            </el-button>-->
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="menuList"
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
            label="ID">
        </el-table-column>
        <el-table-column
            prop="menuName"
            label="菜单"
        >
        </el-table-column>
        <el-table-column
            prop="grade"
            label="菜单级数">
        </el-table-column>
        <el-table-column
            align="center"
            label="usingornot"
            v-slot="scope"
        >
          <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="switchChangeStatus(scope.row)"
          >
          </el-switch>
        </el-table-column>
        <el-table-column
            v-slot="scope"
            label="设置"
            >
          <template >
            <el-button @click="changeParentId(scope.row)" type="primary" size="small">子菜单</el-button>
<!--            <el-button @click="changeToParent(scope.row)" type="primary" size="small">父菜单</el-button>-->
          </template>
        </el-table-column>
        <!--        operation-->
        <el-table-column
            fixed="right"
            label="operation"
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleChangemenu(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="handleDeletemenu(scope.row)" type="success" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--修改用户人信息-->
      <!--      <el-dialog title="改变库存信息" :visible.sync="dialogFormVisible" width="30%" >-->
      <!--        <el-form label-width="80px" size="small" >-->
      <!--          <el-form-item label="库存编号">-->
      <!--            <el-input v-model="stock.bookId" autocomplete="off"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="新库存">-->
      <!--            <el-input v-model="stock.stock" autocomplete="off"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item>-->
      <!--            <el-button type="primary" @click="changeStock">确定</el-button>-->
      <!--            <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--      </el-dialog>-->


    </template>
    <!--    分页-->
    <template>
      <div class="block" >
        <el-pagination
            style="margin:auto"
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
      publishStatusOptions: [{
        value: 1,
        label: '停用'
      }, {
        value: 0,
        label: '启用'
      }],

      // 表格数据
      menuList: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
        parentId: 0
      },
      pageSizeList: [4,8,10,20],
      // 多选
      // dialog框
      dialogFormVisible: false,

      // 获取菜单
      parentId: 0,

    }
  },
  created () {
    this.getmenuDetail()
  },

  methods: {
    // 获取书籍信息
    getmenuDetail() {
      this.params.parentId = this.parentId
      console.log(this.params)
      this.request.post("/member/menu/list", JSON.stringify(this.params)).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.menuList = res.page.list
        }
      })
    },
    changeParentId(row) {
      this.parentId = row.id
      this.getmenuDetail()
    },
    changeToParent(row) {

    },

    handleSizeChange(val) {
      this.params.pageSize=val
      this.getmenuDetail()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getmenuDetail()
      console.log(`当前页: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    switchChangeStatus(row) {
      this.request.post("/member/menu/update", row).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },


    // 表格操作
    // 修改用户信息
    handleChangemenu(row) {
      console.log([row.id])
      this.$confirm('此操作将永久修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/menu/change", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getmenuDetail()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });

    },
    // 删除
    handleDeletemenu(row) {
      console.log([row.id])
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/menu/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getmenuDetail()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });

    },

    // handleChangemenuBatch() {
    //   let ids = this.multipleSelection.map(item => {
    //     return value.push(item.id)
    //   })
    //   console.log(value)
    //   this.request.post("/book/menu/lend", JSON.stringify(ids)).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: 'Borrow successfully',
    //         type: 'success'
    //       });
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: 'warning'
    //       });
    //     }
    //   })
    // },
    // delete by choosing
    handleDeletemenuBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/menu/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getmenuDetail()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    // Star book
    handleCollectionBook(row) {
      let collection = {}
      collection.bookId = row.id
      console.log(collection)
      this.request.post("/member/menucollection/save", JSON.stringify(collection)).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Star successfully',
            type: 'success'
          });
        } else {
          this.$message({
            message: 'Star fail',
            type: 'warning'
          });
        }
      })
    },

    // deleteSava(row) {
    //   var data = "admin"
    //   console.log(JSON.stringify(data))
    //   this.request.post("/book/menu/check/menuname", JSON.stringify(data)).then(res => {
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
      this.searchParams.pageNum = 1;
      this.searchParams.categoryId = this.selectCategoryValue[0]
      // this.searchParams.category = this.selectCategoryValue[1]
      this.requestSearch.post("/book/elastic/search", this.searchParams).then(res => {
        // console.log(res)
        this.book = res.page.list
      })
    },


    handleResetSearch() {
      this.selectProductCateValue = [];
      this.searchParams = Object.assign({}, defaultListQuery);
    },
  }
}
</script>
