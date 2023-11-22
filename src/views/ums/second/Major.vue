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
                @click="handleDeleteusermajorBatch()"
                type="primary"
                size="small">
              批量删除
            </el-button>
            <el-button
                style="float: right;margin-right: 15px"
                @click="handleChangeusermajorBatch()"
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
            <el-button
                style="float: right"
                size="small">

              <router-link to="/ums/userInfo" style="text-decoration:none">回退</router-link>
            </el-button>
          </div>
        </div>


      </el-card>
    </div>

    <!--    表格展示-->
    <template>
      <el-table
          ref="multipleTable"
          :data="usermajorList"
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
            width="50">
        </el-table-column>
        <el-table-column
            prop="major"
            label="专业"
        >
        </el-table-column>
        <el-table-column
            prop="describe"
            label="Describe"
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

        <!--        Operation-->
        <el-table-column
            fixed="right"
            label="Operation"
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleChangeusermajor(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="handleDeleteusermajor(scope.row)" type="success" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--添加角色信息      -->
      <el-dialog title="添加权限" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="80px" size="small" :data="usermajor">
          <el-form-item label="专业">
            <el-input v-model="usermajor.major" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Describe">
            <el-input v-model="usermajor.describe" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="usermajor.status" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddusermajorOrChangeusermajor">确定</el-button>
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


import user from "@/views/ums/User";

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
      usermajorList: [],
      // 分页
      params: {
        totalPage: 0,
        currPage: 1,
        pageSize: 10,
        departmentId: -1,
      },
      pageSizeList: [4, 8, 10, 20],
      // 多选

      // dialog
      usermajor: {},
      dialogFormVisible: false,


    }
  },
  created() {
    this.params.departmentId = this.$route.query.departmentId
    this.getusermajorDetail()
    console.log(this.$route.query.departmentId)
  },


  methods: {
    // 获取书籍信息
    getusermajorDetail() {
      this.request.post("/member/usermajor/major", this.params).then(res => {
        console.log(res)
        if (res) {
          this.params = res.page
          this.usermajorList = res.page.list
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getusermajorDetail()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currPage = val
      this.getusermajorDetail()
      console.log(`当前页: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // switch
    switchChangeStatus(row) {
      this.request.post("/member/usermajor/update", row).then(res => {
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
    handleChangeusermajor(row) {
      this.changeDialogFormVisible()
      this.usermajor = row
    },
    change() {
      this.request.post("/member/usermajor/update", this.usermajor).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.changeDialogFormVisible()
          this.getusermajorDetail()
          this.usermajor = {}
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
      this.usermajor = {}
      console.log(this.usermajor)
    },
    // 删除
    handleDeleteusermajor(row) {
      console.log([row.id])
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/usermajor/delete", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getusermajorDetail()
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

    handleChangeusermajorBatch() {
      let ids = this.multipleSelection.map(item => {
        return value.push(item.id)
      })
      console.log(value)
      this.request.post("/book/usermajor/change", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getusermajorDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    // 批量删除
    handleDeleteusermajorBatch() {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.$confirm('此操作将永久删除个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/usermajor/delete", ids).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getusermajorDetail()
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
      this.usermajor = {}
    },
    // 添加角色
    handleAddusermajorOrChangeusermajor() {
      console.log(this.usermajor)
      this.$confirm('是否确定添加？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.usermajor.id == null) {
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
      this.usermajor.departmentId = this.params.departmentId
      console.log(this.usermajor)
      this.request.post("/member/usermajor/save", this.usermajor).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.getusermajorDetail()
          this.changeDialogFormVisible()
          this.usermajor = {}
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
