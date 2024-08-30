<script setup lang='ts' name='navHeader'>
  import {useMenuStore} from '@/stores'
  import {useRoute,useRouter} from 'vue-router'
  import {useUserStore} from '@/stores/index'
  const menuStore =useMenuStore()
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  // 点击叉号删除菜单
  const closeMenu = (item,index) => {
    // 调用删除菜单方法
   menuStore.delMenu(item)
  //  删除的非当前页
   if(route.path !== item.path){
      return
   }
   const menuList = menuStore.selectMenu
  // 如果删除的是最后一项
   if(index === menuList.length){
    // 如果只有一个菜单
     if(!menuList.length){
        router.push('/')
     }else{
        router.push({path:menuList[index-1].path})
     }
   }else{//如果删除的是 中间位置
    router.push({path:menuList[index].path})
   }
  }
  
  // 退出登录
  const exitLogin = () => {
    // 删除token并且跳转到登录页
    userStore.removeToken()
    userStore.setUserInfo({})
    menuStore.removeMenuList()
    router.push('/login')
  }
</script>
<template>
  <div class="nav-contairen flex-box">
    <div class="nav-left flex-box">
      <el-icon @click="menuStore.changeCollapse" class="icon">
        <Fold />
      </el-icon>
      <ul class="flex-box menuList">
        <li v-for="(item,index) in menuStore.selectMenu" :key="item.path"  class="menuitem flex-box" :class="{active:route.path===item.path}">
          <div class="menu-contairen flex-box">
            <el-icon class="menu-icon" size="12">
            <component :is="item.icon"/>
          </el-icon>
          <RouterLink :to="{path:item.path}" class="menu-name">{{item.name}}</RouterLink>
          </div>
         
          <el-icon ><Close @click="closeMenu(item,index)"/></el-icon>
        </li>
      </ul>
    </div>
    <div class="nav-right ">
      <el-dropdown>
        <div class="dropdown flex-box">
          <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <p class="username">{{userStore.user.userName}}</p>
        </div>
       
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="exitLogin">退出</el-dropdown-item>
        
      </el-dropdown-menu>
    </template>
  </el-dropdown>
    </div>
</div>
</template>

<style scoped >
.flex-box{
  display: flex;
  align-items: center;
}
.nav-contairen{
  justify-content: space-between;
  background-color: #fff;
  height: 100%;
  padding-right: 25px;
  .nav-left{
    height: 100%;
    .menuList{
      height: 100%;
      .menuitem{
        padding: 0 10px;
        height: 100%;
        line-height: 100%;
        .menu-name{
          margin: 0 10px;
          line-height: 100%;
        }
        .menu-name{
          cursor: default
        }
        .el-icon{
          cursor: pointer;
        }
      }
      .menuitem:hover{
        color: #5782ca;
        background-color:#f1f4f6 ;
      }
      
      
    }
    .icon{
      width: 45px;
      height: 100%;
    }
    .icon:hover{
      background-color:#f1f4f6 ;
      cursor: pointer;
    }
    
  }
  .nav-right{
    margin-right: 20px;
    .dropdown{
      .username{
        margin-left: 10px;
      }
    }
  }
  a{
    color: #000;
  }
  .active{
    background-color:#f1f4f6 ;
    a, .el-icon{
      color: #5782ca;
    }
  }
}
</style>