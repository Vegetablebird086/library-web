<template>
  <div>
    <!--    搜索框-->
    <div>
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
              style="float: right"
              @click="handleSearchList()"
              type="primary"
              size="small">
            查询结果
          </el-button>
          <el-button
              style="float: right;margin-right: 15px"
              @click="handleResetSearch()"
              size="small">
            重置
          </el-button>
        </div>

        <div style="margin-top: 15px">
          <el-form :inline="true" :model="searchParams" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="关键词"></el-input>
            </el-form-item>
            <el-form-item label="书籍编号：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="书籍编号"></el-input>
            </el-form-item>
            <el-form-item label="书籍出版商：">
              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="书籍出版商"></el-input>
            </el-form-item>
            <el-form-item label="书籍分类：">
              <el-cascader
                  clearable
                  v-model="selectCategoryValue"
                  :options="bookCateOptions"
                  @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
            <!--            <el-form-item label="上架状态：">-->
            <!--              <el-select v-model="searchParams.status" placeholder="全部" clearable>-->
            <!--                <el-option-->
            <!--                    v-for="item in publishStatusOptions"-->
            <!--                    :key="item.value"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
          </el-form>
          <div style="float: right">
            <el-button
                style="float: right"
                @click="handleDeleteUserBatch()"
                type="primary"
                size="small">
              批量删除
            </el-button>
            <!--            <el-button-->
            <!--                style="float: right;margin-right: 15px"-->
            <!--                @click="handleReturnBookBatch()"-->
            <!--                size="small">-->
            <!--              批量删除-->
            <!--            </el-button>-->
          </div>
        </div>
      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="history"
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
            label="编号">
        </el-table-column>
        <el-table-column
            prop="bookId"
            label="书籍编号">
        </el-table-column>
          <el-table-column
              prop="userId"
              label="借书人编号">
        </el-table-column>
        <el-table-column
            prop="lendTime"
            label="借出时间"
            width="170"
        >
        </el-table-column>
        <el-table-column
            prop="returnTime"
            label="还书时间"
            width="170">
        </el-table-column>
        <el-table-column
            align="center"
            label="是否启用"
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
        <!--        操作-->
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click="handleChangeStatus(scope.row)" type="primary" size="small">修改状态</el-button>
            <el-button @click="handleDeleteRecord(scope.row)" type="success" size="small">删除记录</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>


    <!--      修改状态-->
<!--          <el-dialog title="修改状态" :visible.sync="dialogFormVisible" width="30%" >-->
<!--            <el-form label-width="80px" size="small" >-->
<!--              <el-form-item label="库存编号">-->
<!--                <el-input v-model="stock.bookId" autocomplete="off"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="新库存">-->
<!--                <el-input v-model="stock.stock" autocomplete="off"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item>-->
<!--                <el-button type="primary" @click="changeStock">确定</el-button>-->
<!--                <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </el-dialog>-->



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
      // publishStatusOptions: [{
      //   value: 1,
      //   label: '上架'
      // }, {
      //   value: 0,
      //   label: '下架'
      // }],

      // 表格数据
      history: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4,8,10,20],
      // 多选



    }
  },
  created () {
    this.getUserDetail()
    // this.getBookCategoryList()
  },

  methods: {
    // 获取书籍信息
    getUserDetail() {
      this.requestBook.post("/library/booklendinfo/list", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.history = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize=val
      this.getUserDetail()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getUserDetail()
      console.log(`当前页: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格操作
    // switch
    switchChangeStatus(row) {
      this.requestBook.post("/library/booklendinfo/update", row).then(res => {
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


    // 修改用户信息
    handleChangeStatus(row) {
      console.log([row.id])
      this.$confirm('此操作将永久修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestBook.get(`/library/booklendinfo/change?id=${row.id}&status=${row.status}`).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getUserDetail()
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
    handleDeleteRecord(row) {
      console.log([row.id])
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestBook.post("/library/booklendinfo/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUserDetail()
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

    // handleChangeUserBatch() {
    //   let ids = this.multipleSelection.map(item => {
    //     return value.push(item.id)
    //   })
    //   console.log(value)
    //   this.request.post("/book/user/lend", JSON.stringify(ids)).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: '借书成功',
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
    // 批量删除
    handleDeleteUserBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/user/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUserDetail()
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
    // 收藏书籍
    handleCollectionBook(row) {
      let collection = {}
      collection.bookId = row.id
      console.log(collection)
      this.request.post("/member/usercollection/save", JSON.stringify(collection)).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '收藏失败',
            type: 'warning'
          });
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
