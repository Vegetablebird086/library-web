<template>
  <div class="wrapper">
    <div style="margin: 100px auto; background-color: #fff; width: 350px; height: 400px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>注 册</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input placeholder="Please input Username" size="medium" style="margin: 5px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="please input password" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input placeholder="Enter password again" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item prop="telephone">
          <el-input placeholder="Please input phone number" size="medium" style="margin: 5px 0" prefix-icon="el-icon-phone" v-model="user.telephone"></el-input>
        </el-form-item>
        <el-form-item style="margin: 5px 0; text-align: right">
          <el-button type="primary" size="small"  autocomplete="off" @click="login">Register</el-button>
          <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/login')">Back to login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import router, {setRoutes} from "@/router";

export default {
  name: "Login",
  data() {
    // 用户名 是否存在校验
    var checkUsername = (rule , value, callback) => {
      console.log(value)
      // if (value == this.user.username)
      //   callback()
      if (value != null) {
        var username = []
        username.push(value)
        console.log(username)
        this.request.post("/member/user/check/username", [value]).then(res => {
          if (res.code == 200 && res.data == 0) {
            callback();
          } else {
            console.log(res)
            callback("Username already exists")
          }
        })
      }
    }
    // 手机号 是否存在校验
    var checkTelephone = (rule ,value, callback) => {
      // if (value == this.user.telephone)
      //   callback()
      if (value != null) {
        this.request.post("/member/user/check/phone", value).then(res => {
          console.log(res)
          if (res.data == 0 && res.code == 200) {
            callback();
          } else {
            callback("手机号已存在")
          }
        })
      }
    }

    return {
      user: {},
      rules: {
        username: [
          { required: true, message: 'Please input user name', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          {validator: checkUsername, trigger: 'blur'}
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        telephone: [
          {required: true, message: 'Please input phone number', trigger: 'blur'},
          {min: 11, max: 11, message: '长度在为 11 个字符', trigger: 'blur'},
          {validator: checkTelephone, trigger: 'blur'},
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: 'Your phone number is incorrect, try again'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          if (this.user.password !== this.user.confirmPassword) {
            this.$message.error("Enter password differ")
            return false
          }
          console.log(this.user)
          this.request.post("/member/user/register", this.user).then(res => {

            if(res.code === 200) {
              this.$message.success("Register succesfully成功")
              setRoutes()
              router.push("/")
              console.log(res)
              localStorage.setItem("user", JSON.stringify(res.user))
              localStorage.setItem("token", res.token)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },

  }
}
</script>

<style>
  .wrapper {
    height: 100vh;
    background-image: linear-gradient(to bottom right, #FC466B , #3F5EFB);
    overflow: hidden;
  }
</style>
