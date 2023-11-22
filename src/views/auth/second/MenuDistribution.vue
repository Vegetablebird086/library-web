<template>
  <div>
    <el-card>
      <el-tree
          ref="refTree"
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
          :current-node-key="currentNodeKey"
          :show-checkbox="true"
          :props="defaultProps"
      >
      </el-tree>
      <div>
        <template >
          <el-button @click="changeMenu" type="primary" size="small">Save</el-button>
          <el-button @click="refresh" type="success" size="small">Empty</el-button>
          <el-button type="info" size="small">
          <router-link to="/sms/role"
                       style="text-decoration:none color:#ffffff"
          >
            Back</router-link>
          </el-button>
        </template>
      </div>
    </el-card>
  </div>
</template>


<script>
import menu from "@/views/auth/Menu";

export default {
  data() {
    return {
      // route-link接收参数
      roleId : this.$route.query.roleId,

      data: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      // 选中节点
      currentNodeKey: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  created() {
    this.getChild()
    this.getRoleMenu()
  },
  mounted() {
    console.log(this.roleId)
  },
  methods: {
    // 获取菜单列表
    getChild() {
      this.request.get("/member/menu/child").then(res => {
        console.log(res)
        this.data = res.list
      })
    },
    // 获取角色的菜单
    getRoleMenu() {
      this.request.get("/member/menu/child/"+ this.roleId).then(async res => {
        if (res.code == 200) {
          console.log(res.array)
          this.$refs.refTree.setCheckedKeys(res.array)
        } else {

        }
      })
    },
    // 更改菜单
    changeMenu() {
      var menuIds = this.$refs.refTree.getCheckedKeys()
      var req = {
        roleId : this.roleId,
        menuIdList :  menuIds
      }
      console.log(req)
      this.$confirm('此操作将永久修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/member/rolemenurelation/change", req).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
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
          message: '已取消'
        });
      });

      console.log(menuIds)
    },
    // 清空
    refresh () {
      this.$refs.refTree.setCheckedKeys([])
    }

  }
};
</script>
