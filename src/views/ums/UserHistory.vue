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
            <el-form-item label="Enter Search：">
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="Key word"></el-input>
            </el-form-item>
            <el-form-item label="Book Number：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="Book Number"></el-input>
            </el-form-item>
            <el-form-item label="Publisher">
              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="Book Publisher"></el-input>
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
            <!--            <el-form-item label="Status：">-->
            <!--              <el-select v-model="searchParams.status" placeholder="All" clearable>-->
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
            label="Number">
        </el-table-column>
        <el-table-column
            prop="bookId"

            label="Book Number">
        </el-table-column>
          <el-table-column
              prop="userId"
              label="lendID">
        </el-table-column>
        <el-table-column
            prop="lendTime"
            label="lendtime"
            width="170"
        >
        </el-table-column>
        <el-table-column
            prop="returnTime"
            label="returntime"
            width="170">
        </el-table-column>
        <el-table-column
            align="center"
            label="Enable"
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
        <!--        Operation-->
        <el-table-column
            fixed="right"
            label="Operation"
            width="300">
          <template slot-scope="scope">
            <el-button @click="handleChangeStatus(scope.row)" type="primary" size="small">Modify Status</el-button>
            <el-button @click="handleDeleteRecord(scope.row)" type="success" size="small">Delete Record</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>


    <!--      修改状态-->
<!--          <el-dialog title="修改状态" :visible.sync="dialogFormVisible" width="30%" >-->
<!--            <el-form label-width="100px" size="small" >-->
<!--              <el-form-item label="Stock Number">-->
<!--                <el-input v-model="stock.bookId" autocomplete="off"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="新库存">-->
<!--                <el-input v-model="stock.stock" autocomplete="off"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item>-->
<!--                <el-button type="primary" @click="changeStock">Confirm</el-button>-->
<!--                <el-button type="primary" @click="changeDialogFormVisible">Confirm</el-button>-->
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
      console.log(`${val} items / page`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getUserDetail()
      console.log(`Current page: ${val}`);
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
            message: 'update successfully',
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
      this.$confirm('This operation will change personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.requestBook.get(`/library/booklendinfo/change?id=${row.id}&status=${row.status}`).then(res => {
          if (res.code == 200) {
            this.$message({
              message: 'update successfully',
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
          message: 'Cancel changes'
        });
      });

    },
    // 删除
    handleDeleteRecord(row) {
      console.log([row.id])
      this.$confirm('[Warning]This operation will delete personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.requestBook.post("/library/booklendinfo/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: 'Delete Successfully',
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
          message: 'Cancel changes'
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
    // Bulk Editing
    handleDeleteUserBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('[Warning]This operation will delete personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/user/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: 'Delete Successfully',
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
          message: 'Cancel changes'
        });
      });
    },
    // Star book
    handleCollectionBook(row) {
      let collection = {}
      collection.bookId = row.id
      console.log(collection)
      this.request.post("/member/usercollection/save", JSON.stringify(collection)).then(res => {
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
