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

<!--            <el-form-item label="Book Number：">-->
<!--              <el-input style="width: 203px" v-model="searchParams.id" placeholder="Book Number"></el-input>-->
<!--            </el-form-item>-->
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
                @click="handleDeleteuserdepartmentBatch()"
                type="primary"
                size="small">              Bulk Editing
              delete by choosing
            </el-button>
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="userdepartmentList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="Number">
        </el-table-column>
        <el-table-column
            prop="department"
            label="college">
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
            label="Major List"
            v-slot="scope"
        >
          <router-link :to="{path: '/ums/second/major', query: {departmentId: scope.row.id}}">Allocate Major</router-link>
        </el-table-column>
        <!--        Operation-->
        <el-table-column
            fixed="right"
            label="Operation"
            width="200">
          <template slot-scope="scope">
            <el-button @click="handleChangeuserdepartment(scope.row)" type="primary" size="small">Modify</el-button>
            <el-button @click="handleDeleteuserdepartment(scope.row)" type="primary" size="small">Delete</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--修改/添加信息      -->
      <el-dialog title="Add/Modify Major Information" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="100px" size="small" :data="userdepartment">
          <el-form-item label="Role">
            <el-input v-model="userdepartment.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Role Name">
            <el-input v-model="userdepartment.department" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Describe">
            <el-input v-model="userdepartment.describe" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdduserdepartmentOrChangeuserdepartment">Confirm</el-button>
            <el-button type="primary" @click="changeDialogFormVisible">Cancel</el-button>
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
      userdepartmentList: [],

      // 学院下拉select
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      value: '',

      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
      },
      pageSizeList: [4,8,10,20],
      // 多选


      // dialog
      userdepartment: {},
      dialogFormVisible: false,


    }
  },
  created () {
    this.getuserdepartmentDetail()
    // this.getBookCategoryList()
  },

  methods: {
    // 获取书籍信息
    getuserdepartmentDetail() {
      this.request.post("/member/userdepartment/list", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.userdepartmentList = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize=val
      this.getuserdepartmentDetail()
      console.log(`${val} items / page`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getuserdepartmentDetail()
      console.log(`Current page: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格操作
    // switch status
    switchChangeStatus(row) {
      this.request.post("/member/userdepartment/update", row).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Update successfully',
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
    // 修改dialog状态显示
    changeDialogFormVisible() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.userdepartment = {}
    },
    // 添加或修改专业
    // Add Role
    handleAdduserdepartmentOrChangeuserdepartment() {
      console.log(this.userdepartment)
      this.$confirm('Are you sure modify it？', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (this.userdepartment.id == null) {
          // 添加
          this.save()
        } else {
          // 修改
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
      this.request.post("/member/userdepartment/save", this.userdepartment).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Add Successfully',
            type: 'success'
          });
          this.getuserdepartmentDetail()
          this.changeDialogFormVisible()
          this.userdepartment = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    // 修改用户信息
    handleChangeuserdepartment(row) {
      this.changeDialogFormVisible()
      this.userdepartment = row
    },
    change() {
      this.request.post("/member/userdepartment/update", this.userdepartment).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'update successfully',
            type: 'success'
          });
          this.changeDialogFormVisible()
          this.getuserdepartmentDetail()
          this.userdepartment = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
      this.userdepartment = {}
      console.log(this.userdepartment)
    },

    //
    // handleChangeUser(row) {
    //   console.log([row.id])
    //   console.log(JSON.stringify(row.id))
    //   this.request.post("/member/user/change", [row.id]).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: res.msg,
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
    // 删除
    handleDeleteuserdepartment(row) {
      console.log([row.id])
      this
      this.request.post("/member/userdepartment/delete", [row.id]).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Delete Successfully',
            type: 'success'
          });
          this.getuserdepartmentDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },

    // handleChangeUserBatch() {
    //   var value = []
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
    handleDeleteuserdepartmentBatch(row) {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.request.post("/member/userdepartment/delete", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Delete Successfully',
            type: 'success'
          });
          this.getuserdepartmentDetail()
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
      this.request.post("/library/bookcategory/list", this.params).then(res => {
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
