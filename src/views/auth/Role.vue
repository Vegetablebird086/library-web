
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
              <el-input style="width: 203px" v-model="searchParams.keyword" placeholder="role"></el-input>
            </el-form-item>
            <el-form-item label="Role ID：">
              <el-input style="width: 203px" v-model="searchParams.id" placeholder="Role ID"></el-input>
            </el-form-item>
<!--            <el-form-item label="Publisher">-->
<!--              <el-input style="width: 203px" v-model="searchParams.publisher" placeholder="Book Publisher"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="Book Categorie：">-->
<!--              <el-cascader-->
<!--                  clearable-->
<!--                  v-model="selectCategoryValue"-->
<!--                  :options="bookCateOptions"-->
<!--                  @change="handleChange"-->
<!--              >-->
<!--              </el-cascader>-->
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
          </el-form>
          <div style="float: right">
            <el-button
                style="float: right"
                @click="handleDeleteroleBatch()"
                type="primary"
                size="small">
              delete by choosing
            </el-button>
            <el-button
                style="float: right;margin-right: 15px"
                @click="handleChangeroleBatch()"
                size="small">
              Bulk Editing
            </el-button>
            <el-button
                style="float: right"
                @click="changeDialogFormVisible"
                type="primary"
                size="small">
              Add
            </el-button>
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="roleList"
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
            label="Number"
            width="150">
        </el-table-column>
        <el-table-column
            prop="name"
            label="Role"
        >
        </el-table-column>
        <el-table-column
            prop="role"
            label="Role Name">
        </el-table-column>
        <el-table-column
            prop="describe"
            label="Describe">
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
        <el-table-column
            label="Menus List"
            v-slot="scope"
        >
          <router-link :to="{path: '/sms/second/menuDistribution', query: {roleId: scope.row.id}}"
                       style="text-decoration:none"
          >
            分配菜单</router-link>
        </el-table-column>
        <!--        Operation-->
        <el-table-column
            fixed="right"
            label="Operation"
            width="200">
          <template slot-scope="scope">
            <el-button @click="handleChangerole(scope.row)" type="primary" size="small">Modify</el-button>
            <el-button @click="handleDeleterole(scope.row)" type="success" size="small">Delete</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--Add Role      -->
      <el-dialog title="Add Role" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="100px" size="small" :data="role">
          <el-form-item label="Role">
            <el-input v-model="role.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Role Name">
            <el-input v-model="role.role" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Describe">
            <el-input v-model="role.describe" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddRoleOrChangeRole">Confirm</el-button>
            <el-button type="primary" @click="changeDialogFormVisible">Cancel</el-button>
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
      publishStatusOptions: [{
        value: 1,
        label: '停用'
      }, {
        value: 0,
        label: '启用'
      }],

      // 表格数据
      roleList: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4, 8, 10, 20],
      // 多选

      // dialog
      role: {},
      dialogFormVisible: false,


    }
  },
  created() {
    this.getroleDetail()
  },


  methods: {
    // 获取书籍信息
    getroleDetail() {
      this.request.post("/member/role/list", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.roleList = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getroleDetail()
      console.log(`${val} items / page`);
    },
    handleCurrentChange(val) {
      this.params.currPage = val
      this.getroleDetail()
      console.log(`Current page: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // switch
    switchChangeStatus(row) {
      this.request.post("/member/role/update", row).then(res => {
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

    // 表格操作
    // 修改用户信息
    handleChangerole(row) {
      this.changeDialogFormVisible()
      this.role = row
    },
    change() {
      this.request.post("/member/role/update", this.role).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'update successfully',
            type: 'success'
          });
          this.changeDialogFormVisible()
          this.getroleDetail()
          this.role = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
      this.role = {}
      console.log(this.role)
    },
    // 删除
    handleDeleterole(row) {
      console.log([row.id])
      this.$confirm('[Warning]This operation will delete personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/role/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: 'Delete Successfully',
              type: 'success'
            });
            this.getroleDetail()
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

    handleChangeroleBatch() {
      let ids = this.multipleSelection.map(item => {
        return value.push(item.id)
      })
      console.log(value)
      this.request.post("/book/role/change", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getroleDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    // delete by choosing
    handleDeleteroleBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('[Warning]This operation will delete personal information permanently, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/role/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: 'Delete Successfully',
              type: 'success'
            });
            this.getroleDetail()
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

    // 修改dialog状态显示
    changeDialogFormVisible() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.role = {}
    },
    // Add Role
    handleAddRoleOrChangeRole() {
      console.log(this.role)
      this.$confirm('Are you sure to add it？', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (this.role.id == null) {
          this.save()
        } else {
          this.change()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel changes'
        });
      })
    },
    save() {
      this.request.post("/member/role/save", this.role).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Add Successfully',
            type: 'success'
          });
          this.getroleDetail()
          this.changeDialogFormVisible()
          this.role = {}
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
