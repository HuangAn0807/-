import {defineStore} from 'pinia'
import {ref} from 'vue'
export const useMenuStore = defineStore('menu',() => {
  // 控制侧边栏的收缩与展开
  const isCollapse = ref(false)
  const selectMenu = ref([])

  // 默认高亮下标
  const active = ref('1-1')
  // 动态路由列表
  const menuList = ref([])
  // 控制侧边栏的收缩与展开
  const changeCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  // 添加菜单
  const addMenu = (palyload) => {
    // 不能重复添加菜单
    if(selectMenu.value.findIndex(item=>item.path===palyload.path)===-1){
      // 将新菜单添加到菜单数组中
      selectMenu.value.push(palyload)
    }
  }
  // 删除菜单
  const delMenu = (tab) => {
    const index = selectMenu.value.findIndex(item=>item.path===tab.path)
    selectMenu.value.splice(index,1)
  }

  // 用户菜单列表
  const  userMenuList = (palyload) => {
    //  通过glob导入文件
   const modules =  import.meta.glob('../views/**/**/*.vue')
   console.log(modules);
   
      function routerSet(router){
        // 判断是否有子菜单拼接路由数据
        router.forEach(route => {
          
            // 判断是否有子菜单，拼接路由数据
            if(!route.children){
              const url = `../views${route.meta.path}/index.vue`             
              // 拿到获取的vue组件
              route.component = modules[url]
            }else{
              routerSet(route.children)
            }
        })
      }
      routerSet(palyload)
      menuList.value = palyload
  }

  // 删除动态路由信息
  const removeMenuList = () => {
    menuList.value = null
    localStorage.clear()
  }

  // 更新高亮下标
 const updataActive = (newValue) => {
  active.value = newValue
 }
  return {
    isCollapse,
    selectMenu,
    menuList,
    active,
    changeCollapse,
    addMenu,
    delMenu,
    userMenuList,
    removeMenuList,
    updataActive
  }
  
},
// 将动态路由菜单进行持久化存储避免页面刷新出现空白页
{persist:{paths:['menuList','active']}})