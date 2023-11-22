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
             
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item label="ID Number：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="ID Number"></el-input>
            </el-form-item>
<!--            <el-form-item label="Status：">-->
<!--              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="Status"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="Status：">
              <el-select v-model="searchParams.status" placeholder="All" clearable>
                <el-option
                    v-for="item in publishStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Major：">
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
          :data="userList"
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
            prop="username"
            label="Name"
            >
        </el-table-column>
        <el-table-column
            prop="department"
            label="college">
        </el-table-column>
        <el-table-column
            prop="major"
            label="major">
        </el-table-column>
        <el-table-column
            prop="classNumber"
            label="class">
        </el-table-column>
        <el-table-column
            prop="sex"
            label="gender">
        </el-table-column>
        <el-table-column
            prop="telephone"
            label="phone"
            width="150">
        </el-table-column>
        <el-table-column
            prop="remain"
            label="Books available for loan"
            >
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
            <el-button @click="handleChangeUser(scope.row)" type="primary" size="small">Modify</el-button>
            <el-button @click="handleDeleteUser(scope.row)" type="success" size="small">Delete</el-button>
            <el-button @click="changeSelectDialog(scope.row)" size="small">Allocate Rule</el-button>
          </template>
        </el-table-column>

      </el-table>

<!--      <el-dialog title="Allocate Role" :visible.sync="dialogFormVisible" width="30%" >-->
<!--        <el-form label-width="100px" size="small" >-->
<!--          <el-form-item label="Stock Number">-->
<!--            <template>-->
<!--              <el-select v-model="role" placeholder="please select">-->
<!--                <el-option-->
<!--                    no-data-text="选择角色"-->
<!--                    multiple="true"-->
<!--                    collapse-tags="true"-->
<!--                    v-for="item in roleList"-->
<!--                    :key="item.id"-->
<!--                    :label="item.role"-->
<!--                    :value="item.role"-->
<!--                    @change="changeSelect"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-form-item>-->

<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="handleDialogChange">Confirm</el-button>-->
<!--            <el-button type="primary" @click="changeDialogFormVisible">Cancel</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-dialog>-->


<!--    为用户Allocate Role selectDialog-->
      <el-dialog title="Allocate Role" :visible.sync="selectDialog" width="30%" >
        <el-form label-width="150px" size="small" >
          <el-form-item label="Stock Number">
            <template>
              <el-select v-model="role" placeholder="please select"
                   multiple
                   filterable
                   allow-create
                   default-first-option
              >
                <el-option
                    collapse-tags="true"
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.role"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="confirmSelect">Confirm</el-button>
            <el-button type="primary" @click="cacel">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

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
import role from "@/views/auth/Role";

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
        label: 'Shelve'
      }, {
        value: 0,
        label: 'Take down'
      }],

      // 表格数据
      userList: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4,8,10,20],
      // 多选
      // dialog
      dialogFormVisible: false,
      user: {},

      //  select dialog
      selectDialog: false,
      roleList: [], // 当前展示集合
      role: [],     // 当前选中值

      userId: null,

    }
  },
  created () {
    this.getUserDetail()
  },

  methods: {
    // 获取书籍信息
    getUserDetail() {
      this.request.post("/member/user/list", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.userList = res.page.list
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
    // switch status
    switchChangeStatus(row) {
      this.request.post("/member/user/update", row).then(res => {
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

    changeDialogFormVisible() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.user = {}
    },
    async handleDialogChange() {
      await this.handleChange(this.user)
      this.changeDialogFormVisible()
    },

    // 修改用户信息
    handleChangeUser(row) {
      console.log([row.id])
      this.$confirm('This operation will change personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/user/change", [row.id]).then(res => {
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
    handleDeleteUser(row) {
      console.log([row.id])
      this.$confirm('[Warning]This operation will delete personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/user/delete", [row.id]).then(res => {
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
    // Allocate Role
    // dialog
    async changeSelectDialog(row) {
      this.selectDialog = !this.selectDialog
      if (this.selectDialog == true) {
        if (row.id != null)
          this.userId = row.id
        if (this.role[0] == null)
          await this.selectInit()
        console.log(this.userId)
        this.roleList = []
        this.getRoleList()
        console.log(this.userId)
      }
    },
    // User Role回显
    selectInit() {
      if (this.userId == null) return
      this.request.get("/member/role/roles/" + this.userId).then(res => {
        if (res.code == 200) {
          console.log(res)
          var list = res.role
          for (var i = 0; i < list.length; i++) {
            this.role.push((list[i].role))
          }
          console.log(this.role, res.role)
        }
      })
    },
    getRoleList() {
      this.request.post("/member/role/list").then(res => {
        if (res.code) {
          var list = []
          list = res.page.list
          for (var i = 0; i < list.length; i++) {
            this.roleList.push({id: list[i].id, role: list[i].role})
          }
          console.log(this.roleList)
        }
      })
    },
    confirmSelect(row) {
      this.$confirm("Are you sure to allocate it", "Warning", {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var req = {
          userId: this.userId,
          roleId: [],
        }
        for (var i = 0; i < this.roleList.length; i++) {
          for (var j = 0; j < this.role.length; j++) {
            if (this.role[j] == this.roleList[i].role)
              req.roleId.push(this.roleList[i].id)
          }
        }

        console.log(req)
        this.request.post("/member/userrolerelation/distribute", req).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: 'Allocate Successfully!'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Allocate failed'
        });
      })
    },
    cacel() {
      this.changeSelectDialog()
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
