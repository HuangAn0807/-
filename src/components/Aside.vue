<script setup lang='js' name='Aside'>
import TreeMenu from '@/components/TreeMenu.vue'
import {useRouter} from 'vue-router'
import {useMenuStore} from '@/stores'
const router = useRouter()

// 获取实例
const menu = useMenuStore()
// 获取动态路由菜单列表
const menuData = menu.menuList

const handleOpen = () => {}
const handleClose = () => {}
</script>
<template>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="menu.isCollapse"
        :default-active="menu.active"
      >
      <h3 class="mb-2">{{menu.isCollapse?'':'DiDi陪诊'}}</h3>
      <TreeMenu :index="1" :menuData="menuData"/>
      </el-menu>

</template>

<style scoped lang="less" >
.aside-container{
  height: 100%;
  overflow: hidden;
}
.mb-2{
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  background-color: #545c64;
}
</style>