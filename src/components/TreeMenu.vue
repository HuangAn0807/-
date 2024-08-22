<script setup lang='js' name='treeMenu'>
import {Platform} from '@element-plus/icons-vue'
import {useRouter}from 'vue-router'
import {useMenuStore} from '@/stores'
const props = defineProps(['menuData','index'])
const router = useRouter()
const menuStore = useMenuStore()
const handelClick = (item,index) => {
  // 将点击的菜单添加到菜单数组中
    menuStore.addMenu(item.meta)
    menuStore.updataActive(index)
    router.push(item.meta.path)
}
</script>
<template>
    <template  v-for="(item,index) in props.menuData" :key='item.meta.id'>
      <!-- 判断是否有子路由来渲染 -->
      <el-menu-item 
      @click="handelClick(item,`${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length==0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`">
        <el-icon size="20">
        <!-- 菜单图标 -->
        <component :is="item.meta.icon"/>
      </el-icon>
      <!-- 菜单名 -->
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
      <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
        <template #title>
          <el-icon size="20">
            <component :is="item.meta.icon"/>
          </el-icon>
          <span>{{ item.meta.name }}</span>
        </template>
        
          <TreeMenu :index="`${props.index}-${item.meta.id}`" :menuData="item.children"/>
      </el-sub-menu>
    </template>
   
</template>

<style scoped >
a{
  color: #fff;
}

</style>