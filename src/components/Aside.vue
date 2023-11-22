<template>
  <el-menu :default-openeds="opens" style="min-height: 100%; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
           unique-opened
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px; position: relative; top: 5px;">
      <b style="color: white; margin-left: 5px" v-show="logoTextShow">library management system</b>
    </div>
    <div>
<!--      -->
      <el-submenu index="1">
<!--        // 大标题-->
        <template slot="title" ><i class="el-icon-s-home"></i>
          <router-link to="/home"  style="text-decoration:none; color:#fff;">
            Home
          </router-link>
        </template>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-notebook-1"></i>
          <span slot="title">Book</span>
        </template>
        <!--          // 子标题-->
        <el-menu-item index="/bms/book">Book List</el-menu-item>
        <el-menu-item index="/bms/bookManage">Book Management</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-user-solid"></i>
          <span slot="title">User</span>
        </template>
        <!--          // 子标题-->
        <el-menu-item index="/ums/user">User List</el-menu-item>
        <el-menu-item index="/ums/userInfo">User Information</el-menu-item>
        <el-menu-item index="/ums/userCollection">Like</el-menu-item>
        <el-menu-item index="/ums/userHistory">Lend</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-unlock"></i>
          <span slot="title">Permission</span>
        </template>
        <!--          // 子标题-->
        <el-menu-item index="/sms/role">Role List</el-menu-item>
        <el-menu-item index="/sms/menu">Menu List</el-menu-item>
        <el-menu-item index="/sms/permission">Permission List</el-menu-item>
      </el-submenu>
    </div>
    <!--    <div v-for="item in menus" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
&lt;!&ndash;          children&ndash;&gt;
        <div  v-for="subItem in item.children" :key="subItem.id">
          <el-menu-item :index="subItem.path">
            <i :class="subItem.icon"></i>
            <span slot="title">{{ subItem.name }}</span>
          </el-menu-item>
        </div>
    </div>
      <div v-else>
        <el-submenu :index="item.id + ''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <div  v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">
              <i :class="subItem.icon"></i>
              <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>-->
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data() {
    return {
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      opens: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map(v => v.id + '') : []
    }
  },
}
</script>

<style>
.el-menu-item.is-active {
  background-color: rgb(38, 52, 69) !important;
}
.el-menu-item:hover {
  background-color: rgb(38, 52, 69) !important;
}

.el-submenu__title:hover {
  background-color: rgb(38, 52, 69) !important;
}
/*解决收缩菜单文字不消失问题*/
.el-menu--collapse span {
  visibility: hidden;
}
</style>
