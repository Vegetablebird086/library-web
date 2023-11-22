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
              <el-input style="width: 203px" v-model="searchParams.bookId" placeholder="Book Number"></el-input>
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
<!--            <el-form-item label="Listing Status：">-->
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
                @click="handleLendBookBatch()"
                type="primary"
                size="small">
              Borrow Books in Bulk
            </el-button>
            <el-button
                style="float: right;margin-right: 15px"
                @click="handleReturnBookBatch()"
                size="small">
              Return Books in Bulk
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
            label="Number">
        </el-table-column>
        <el-table-column
            prop="bookName"
            label="Name">
        </el-table-column>
        <el-table-column
            prop="writer"
            label="Author">
        </el-table-column>
        <el-table-column
            prop="publisher"
            label="Publisher">
        </el-table-column>
        <el-table-column
            prop="category"
            label="Book Categorie">
        </el-table-column>
        <el-table-column
            prop="describe"
            label="Describe">
        </el-table-column>
<!--        Operation-->
        <el-table-column
            fixed="right"
            label="Operation"
            width="300">
          <template slot-scope="scope">
            <el-button @click="handleLendBook(scope.row)" type="primary" size="small">Borrow</el-button>
            <el-button @click="handleReturnBook(scope.row)" type="success" size="small">Return</el-button>
            <el-button @click="handleCollectionBook(scope.row)" type="success" size="small">Star</el-button>
          </template>
        </el-table-column>

      </el-table>



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
      // publishStatusOptions: [{
      //   value: 1,
      //   label: 'on'
      // }, {
      //   value: 0,
      //   label: 'off'
      // }],

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



    }
  },
  created () {
    this.getBookDetail()
    this.getBookCategoryList()
  },

  methods: {
    // 获取书籍信息
    getBookDetail() {
      this.requestBook.post("/book/user/list", this.params).then(res => {
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
      console.log(`${val} items / page`);
    },
    handleCurrentChange(val) {
      this.params.currPage=val
      this.getBookDetail()
      console.log(`Current page: ${val}`);
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格操作
    // Borrow
    handleLendBook(row) {
      console.log([row.id])
      console.log(JSON.stringify(row.id))
      this.requestBook.post("/book/user/lend", [row.id]).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
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
    // Return
    handleReturnBook(row) {
      console.log([row.id])
      this.requestBook.post("/book/user/return", [row.id]).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
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

    handleLendBookBatch() {
      var value = []
      let ids = this.multipleSelection.map(item => {
        return value.push(item.id)
      })
      console.log(value)
      this.requestBook.post("/book/user/lend", JSON.stringify(ids)).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Borrow successfully',
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
    handleReturnBookBatch(row) {
      var ids = this.multipleSelection.map(item => {
        return item.id
      })
      console.log(ids)
      this.requestBook.post("/book/user/return", ids).then(res => {
        if (res.code == 200) {
          this.$message({
            message: 'Return successfully',
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
             message: 'Star Failed',
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
      this.searchParams.pageNum = 0;
      this.searchParams.categoryId = this.selectCategoryValue[0]
      console.log(this.searchParams)
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
