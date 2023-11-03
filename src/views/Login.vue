<template>
  <div class="wrapper" style="margin: auto">
    <div
        style='margin: 200px auto; background-color: #fff; width: 350px; height: 300px;
        padding: 20px; border-radius: 10px
        '
    >
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>Login</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password
                    v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">Register </el-button>
          <el-button type="primary" size="small" autocomplete="off" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router, {setRoutes} from "@/router";

export default {
  name: "登录",
  data() {
    return {
      user: {},
      rules: {
        username: [
          {required: true, message: 'Please input user name', trigger: 'blur'},
          {min: 3, max: 10, message: 'The length is 3 to 5 characters', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Please input password', trigger: 'blur'},
          {min: 1, max: 20, message: 'The length is 1 to 20 characters', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          this.request.post("/member/user/login", this.user).then(res => {
            console.log(this.user)
            console.log(res)
            if (res.code === 200) {
              console.log(res.user)
              console.log(res.token)
              localStorage.setItem("token", res.token)
              localStorage.setItem("user", JSON.stringify(res.user))  // 存储用户信息到浏览器
              // localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
              // 动态设置当前用户的路由
              setRoutes()
              this.$message.success("Login successfully")

              // 默认管理员
              router.push("/")
              // if (res.data.role === 'ROLE_STUDENT') {
              //   this.$router.push("/front/home")
              // } else {
              //   this.$router.push("/")
              // }
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  overflow: hidden;
}
</style>
