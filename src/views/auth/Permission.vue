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
<!--            <el-form-item label="书籍编号：">-->
<!--              <el-input style="width: 203px" v-model="searchParams.id" placeholder="书籍编号"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="Publisher">-->
<!--              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="书籍出版商"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="书籍分类：">-->
<!--              <el-cascader-->
<!--                  clearable-->
<!--                  v-model="selectCategoryValue"-->
<!--                  :options="bookCateOptions"-->
<!--                  @change="handleChange"-->
<!--              >-->
<!--              </el-cascader>-->
<!--            </el-form-item>-->
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
                @click="handleDeletepermissionBatch()"
                type="primary"
                size="small">
              批量删除
            </el-button>
            <el-button
                style="float: right;margin-right: 15px"
                @click="handleChangepermissionBatch()"
                size="small">
              批量修改
            </el-button>
            <el-button
                style="float: right"
                @click="changeDialogFormVisible"
                type="primary"
                size="small">
              添加
            </el-button>
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="permissionList"
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
            prop="permission"
            label="权限"
        >
        </el-table-column>

        <el-table-column
            align="center"
            label="是否启用"
            v-slot="scope"
            prop="status"
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
            <el-button @click="handleChangepermission(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="handleDeletepermission(scope.row)" type="success" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--添加角色信息      -->
      <el-dialog title="添加权限" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="80px" size="small" :data="permission">
          <el-form-item label="权限">
            <el-input v-model="permission.permission" autocomplete="off"></el-input>
          </el-form-item>
<!--          <el-form-item label="角色名">-->
<!--            <el-input v-model="permission.permissionKey" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="描述">-->
<!--            <el-input v-model="permission.describe" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="handleAddpermissionOrChangepermission">确定</el-button>
            <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </template>
    <!--    分页-->
    <template>
      <div class="block">
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
      permissionList: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4, 8, 10, 20],
      // 多选

      // dialog
      permission: {},
      dialogFormVisible: false,


    }
  },
  created() {
    this.getpermissionDetail()
  },


  methods: {
    // 获取书籍信息
    getpermissionDetail() {
      this.request.post("/member/permission/list", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.permissionList = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getpermissionDetail()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currPage = val
      this.getpermissionDetail()
      console.log(`当前页: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // switch
    switchChangeStatus(row) {
      this.request.post("/member/permission/update", row).then(res => {
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
    handleChangepermission(row) {
      this.changeDialogFormVisible()
      this.permission = row
    },
    change() {
      this.request.post("/member/permission/update", this.permission).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.changeDialogFormVisible()
          this.getpermissionDetail()
          this.permission = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
      this.permission = {}
      console.log(this.permission)
    },
    // 删除
    handleDeletepermission(row) {
      console.log([row.id])
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/permission/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getpermissionDetail()
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

    handleChangepermissionBatch() {
      let ids = this.multipleSelection.map(item => {
        return value.push(item.id)
      })
      console.log(value)
      this.request.post("/book/permission/change", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getpermissionDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    // 批量删除
    handleDeletepermissionBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/permission/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getpermissionDetail()
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

    // 修改dialog状态显示
    changeDialogFormVisible() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.permission = {}
    },
    // 添加角色
    handleAddpermissionOrChangepermission() {
      console.log(this.permission)
      this.$confirm('是否确定添加？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.permission.id == null) {
          this.save()
        } else {
          this.change()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      })
    },
    save() {
      this.permission
      this.request.post("/member/permission/save", this.permission).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.getpermissionDetail()
          this.changeDialogFormVisible()
          this.permission = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },


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
