<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1;">
      <span :class="collapseBtnClass" style="cursor: pointer; font-size: 18px" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px" >
        <el-breadcrumb-item
            v-for="item in breadcrumbList"
            :to="{ path : item.path}"
            :key="item.path"
          >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--      右上角个人信息-->
    <el-dropdown style="width: 150px; cursor: pointer; text-align: right">
      <div class="block">
        <el-avatar :size="50"
                   slot="error"
                   :src="user.image">

        </el-avatar>
        <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
<!--        <span>{{user.username}}</span>-->
      </div>

      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link to="/person" style="text-decoration:none; color:#fff;">
            <span >Personal Information</span></router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <span style="text-decoration: none" @click="logout">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    // 直接接收父组件传值
    user: Object
  },
  computed: {
    breadcrumbList() {
      return this.$route.matched
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    collapse() {
      // this.$parent.$parent.$parent.$parent.collapse()  // 通过4个 $parent 找到父组件，从而调用其折叠方法
      this.$emit("asideCollapse")
    },
    logout() {
      this.request.post("/member/user/logout").then(res => {
        console.log(res)
        this.$store.commit("logout")
        if (res.code == 200) {
          this.$message.success("Log out succesfully")
        } else {
          this.$message.error("Log out fail, server error失败，服务器异常")
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
