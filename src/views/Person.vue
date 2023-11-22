<template>
  <el-card style="width: 500px; margin: auto">
    <el-form label-width="80px" size="small">
      <el-upload
          action="upload"
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"

      >
        <img v-if="form.image" :src="form.image" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>


      <el-form-item label="user name" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="college">
        <el-cascader
            clearable
            v-model="selectDepartmentValue"
            :options="departmentOptions"
            @change="handleChangeDepartment"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="major">
        <el-cascader
            clearable
            v-model="selectMajorValue"
            :options="majorOptions"
            @change="handleChangeMajor"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="class">
        <el-input v-model="form.classNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="gender">
<!--        <el-radio v-model="1" label="1">男</el-radio>-->
<!--        <el-radio v-model="0" label="0">女</el-radio>-->
      </el-form-item>
      <el-form-item label="phone" prop="telephone">
        <el-input v-model="form.telephone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Books available for loan">
        <el-input type="text" v-model="form.remain" autocomplete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="change" :disabled="false">Modify personal information</el-button>
        <el-button type="primary" @click="changeDialogFormVisible" :disabled="false">Change Password</el-button>
      </el-form-item>
    </el-form>


    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="password[0]" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="password[1]" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword" @blur="checkPassword">确定</el-button>
          <el-button type="primary" @click="changeDialogFormVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-card>
</template>

<script>

export default {
  name: "Person",
  data() {



    return {
      // 表格初始化
      form: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      // 数据备份
      user: {},
      // 学院下拉框
      selectDepartmentValue: {},
      // 专业下拉框
      departmentOptions: [],
      selectMajorValue: {},
      majorOptions: [],
      // dialog
      dialogFormVisible: false,
      // 密码
      password: [],

      // // 表单校验
      // rules: {
      //   // username: [
      //   //   { required: true, message: '请输入用户名', trigger: 'blur' },
      //   //   { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' },
      //   //   {validator: checkUsername, trigger: 'blur'}
      //   // ],
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //     { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
      //   ],
      //   confirmPassword: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //     { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
      //   ],
      //   telephone: [
      //     {required: true, message: '请输入手机号', trigger: 'blur'},
      //     {min: 11, max: 11, message: '长度在为 11 个字符', trigger: 'blur'},
      //     {validator: checkTelephone, trigger: 'blur'},
      //     {
      //       pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
      //       message: 'Your phone number is incorrect, try again'
      //     }
      //   ]
      // },
      // 数据回显
      departmentList: {},
      majorList: {}
    }
  },
  created: async function () {
    this.user = this.form
    if (this.form.majorId == null) {
      this.getDepartmentList()
    } else {
      await this.init()
      this.getDepartmentList()
    }
  },

  methods: {
    // 回显数据 专业和学院
    async init() {
      console.log("init方法")
      this.selectMajorValue[0] = this.form.majorId

      await this.getDepartmentByMajorId()
      await this.getMajorList()
      this.form.major = this.majorList[0].major
      console.log(this.form.department)
    },
    // 获取学院下拉列表
    getDepartmentList() {
      this.request.get("/member/userdepartment/list", null).then(res => {
        this.departmentOptions = []
        this.selectDepartmentValue = {}
        if (res != null) {
          console.log(res)
          var list = res.page.list
          this.departmentList= list
          for (var i = 0; i < list.length; i++) {
            this.departmentOptions.push({value:list[i].id, label:list[i].department})
          }
          // console.log(this.departmentOptions)
        }
      })
    },
    // 获取专业下拉列表
    async getMajorList(){
      var departmentId = this.form.departmentId
      console.log(departmentId)
      if (departmentId == null) return
      await this.request.get('/member/departmentmajorrelation/major/'+ departmentId ).then(res => {
        this.majorOptions = []
        this.selectMajorValue = {}
        if (res != null) {
          console.log(res)
          var list = res.major
          this.majorList = list
          for (var i = 0; i < list.length; i++) {
            this.majorOptions.push({value:list[i].id, label:list[i].major})

          }
          // console.log(this.majorOptions)
        }
      })
    },
    // 一个专业 对应一个学院
    async getDepartmentByMajorId() {
      var majorId = this.form.majorId
      if (majorId == null) return
      await this.request.get('/member/departmentmajorrelation/department/'+ majorId ).then(res => {
        this.departmentOptions = []
        this.selectDepartmentValue = {}
        if (res != null) {
          let list = res.department
          if (list == null) return
          this.departmentList = list
          for (let i = 0; i < 1; i++) {
            this.departmentOptions.push({value:list[i].id, label:list[i].department})
            this.form.departmentId = list[i].id
            this.form.department = list[i].department;
            console.log("getDepartmentByMajorId : " + list[i].id + this.form.department)
          }
          // console.log(this.majorOptions)
          this.getMajorList()
        } else {
          this.getDepartmentList()
        }
      })
    },
    // 通过学院id确定专业id
    handleChangeDepartment(value) {
      // this.getDepartmentList()
      console.log(value[0])
      this.form.departmentId = value[0]
      this.getMajorList()
    },
    handleChangeMajor(value) {
      console.log(value[0])
      this.form.majorId = value[0]
    },


  /*
    // 监听值的变化，记录值
  watch: {
    selectDepartmentValue: function (newValue) {
      console.log(newValue[1], newValue[0])
      if (newValue != null && newValue.length == 2) {
        this.form.departmentId = newValue[0];
      } else {
        this.form.department = newValue[1];
      }

    }
  },
   */
    change() {
      this.$confirm('此操作将永久修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("quding")
        this.request.post("/member/user/change", this.form).then(res =>{
          if(res.code == 200) {
            this.$message({
              message: 'update successfully',
              type: 'success'
            })
            // 成功就重新设置
            localStorage.setItem("user", JSON.stringify(this.form))
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
            // 失败回显数据
            this.form = this.user
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });

    },
    // 修改密码展示框
    changeDialogFormVisible() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    changePassword(){
      this.request.post("/member/user/change/password", this.password).then(res =>{
        if (res == 200) {
          this.$message({
            type: 'success',
            message: "password update successfully"
          })
          this.changeDialogFormVisible()
        } else {
          this.$message({
            type: 'error',
            message: "Failed to change the password"
          })
        }
      })
    },
    checkPassword() {
      this.request.post("/member/user/check/password", this.password).then(res =>{
        if (res.code == 200) {
          return true
        } else {
          return false;
        }
      })
    },

    handleAvatarSuccess(res) {
      this.form.avatarUrl = res
    },
    // changeMessage() {
      //   this.request.post("/book/user/change", this.form).then(res => {
      //     if (res.user) {
      //       this.form = res.user
      //       localStorage.getItem("user")
      //     }
      //   })
      // },
      // open() {
      //   this.$confirm('此操作将永久修改信息, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.changeMessage()
      //     this.$message({
      //       type: 'success',
      //       message: 'update successfully!'
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消修改'
      //     });
      //   });
    // }
  }
}
</script>

<style>
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
