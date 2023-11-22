import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)


/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => (import("../views/Login"))
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'), hidden: true},
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    meta: { title: 'Home'},
    component:() => (import("../views/Manage")),
    children: [
        // 首页
      {
        path: '/home',
        name: 'Home',
        meta: { title: 'Home'},
        component: () => (import("../views/Home"))
      },
        // 书籍
      {
        path: 'bms',
        name: 'Book',
        meta: { title: 'Book'},
        component: () => (import("../views/bms/index")),
        children: [
          {
            path: 'book',
            name: 'Book list',
            meta: { title: 'Book list'},
            component: () => (import("../views/bms/Book"))
          },
          {
            path: 'bookManage',
            name: 'book Manage',
            meta: { title: 'book Manage'},
            component: () => (import("../views/bms/BookManager"))
          },
        ]
      },
        // 用户
      {
        path: 'ums',
        name: 'User',
        meta: { title: 'User'},
        component: () => (import("../views/ums/index")),
        children: [
          {
            path: 'user',
            name: 'User List',
            meta: { title: 'user list'},
            component: () => (import("../views/ums/User"))
          },
          {
            path: 'userInfo',
            name: 'User Information',
            meta: { title: 'User Information'},
            component: () => import('../views/ums/UserInfo')
          },
          {
            path: 'second/major',
            name: 'majorlist',
            meta: { title: 'majorlist'},
            component: () => (import("../views/ums/second/Major"))
          },
          {
            path: 'userCollection',
            name: 'Star record',
            meta: { title: 'Star record'},
            component: () => import('../views/ums/UserCollection')
          },
          {
            path: 'userHistory',
            name: 'Borrow record记录',
            meta: { title: 'Borrow record记录'},
            component: () => import('../views/ums/UserHistory')
          },
        ],
      },
      // 权限
      {
        path: 'sms',
        name: '权限',
        meta: {title: '权限'},
        component: () => (import('../views/auth/index')),
        children: [
          {
            path: 'role',
            name: '角色列表',
            meta: { title: '角色列表'},
            component: () => (import("../views/auth/Role"))
          },{
            path: 'userRole',
            name: '用户角色',
            meta: { title: '用户角色'},
            component: () => (import("../views/auth/UserRole"))
          },
          {
            path: 'menu',
            name: '菜单列表',
            meta: { title: '菜单列表'},
            component: () => (import("../views/auth/Menu"))
          },
          {
            path: 'permission',
            name: '权限列表',
            meta: { title: '权限列表'},
            component: () => (import("../views/auth/Permission"))
          },
          {
            path: 'second/menuDistribution',
            name: '角色列表',
            meta: { title: '角色列表'},
            component: () => (import("../views/auth/second/MenuDistribution"))
          },
        ]
      },

      {
        path: 'person',
        name: '个人信息',
        meta: { title: '基本信息'},
        component: () => import('../views/Person')
      },


    ]
  },

]

const router = new VueRouter({
  routes
})

// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menus");
  if (storeMenus) {

    // 获取当前的路由对象名称数组
    const currentRouteNames = router.getRoutes().map(v => v.name)
    if (!currentRouteNames.includes('Manage')) {
      // 拼装动态路由
      const manageRoute = { path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: "/home", children: [
          { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')}
          // { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')}
        ] }
      const menus = JSON.parse(storeMenus)
      menus.forEach(item => {
        if (item.path) {  // 当且仅当path不为空的时候才去设置路由
          let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
          manageRoute.children.push(itemMenu)
        } else if(item.children.length) {
          item.children.forEach(item => {
            if (item.path) {
              let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
              manageRoute.children.push(itemMenu)
            }
          })
        }
      })
      // 动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }6

  }
}

// 重置我就再set一次路由
setRoutes()



router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
  store.commit("setPath")

  // 未找到路由的情况
  /*if (!to.matched.length) {
    const storeMenus = localStorage.getItem("menus")
    if (storeMenus) {
      next("/404")
    } else {
      // 跳回登录页面
      next("/login")
    }
  }*/
  // 其他的情况都放行
  next()

})

export default router
