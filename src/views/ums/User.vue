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
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="user name"></el-input>
            </el-form-item>
            <el-form-item label="用户编号：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="用户编号"></el-input>
            </el-form-item>
<!--            <el-form-item label="用户状态：">-->
<!--              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="用户状态"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="用户状态：">
              <el-select v-model="searchParams.status" placeholder="全部" clearable>
                <el-option
                    v-for="item in publishStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业分类：">
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
            label="编号">
        </el-table-column>
        <el-table-column
            prop="username"
            label="名称"
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
            label="电话号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="remain"
            label="Books available for loan"
            >
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
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleChangeUser(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="handleDeleteUser(scope.row)" type="success" size="small">删除</el-button>
            <el-button @click="changeSelectDialog(scope.row)" size="small">分配角色</el-button>
          </template>
        </el-table-column>

      </el-table>

<!--      <el-dialog title="分配角色" :visible.sync="dialogFormVisible" width="30%" >-->
<!--        <el-form label-width="80px" size="small" >-->
<!--          <el-form-item label="库存编号">-->
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
<!--            <el-button type="primary" @click="handleDialogChange">确定</el-button>-->
<!--            <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-dialog>-->


<!--    为用户分配角色 selectDialog-->
      <el-dialog title="分配角色" :visible.sync="selectDialog" width="30%" >
        <el-form label-width="80px" size="small" >
          <el-form-item label="库存编号">
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
            <el-button type="primary" @click="confirmSelect">确定</el-button>
            <el-button type="primary" @click="cacel">取消</el-button>
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
        label: '上架'
      }, {
        value: 0,
        label: '下架'
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
      this.$confirm('此操作将永久修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
          message: '已取消修改'
        });
      });

    },
    // 删除
    handleDeleteUser(row) {
      console.log([row.id])
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/user/delete", [row.id]).then(res => {
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
    // 分配角色
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
    // 用户角色回显
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
      this.$confirm("是否确定分配角色", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
              message: '分配成功!'
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
          message: '分配失败'
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
