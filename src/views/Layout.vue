<script setup name="layout">
import Aside from "@/components/Aside.vue"
import NameHeader from '@/components/NavHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Aside></Aside>
      <el-container>
        <el-header>
          <NavHeader></NavHeader></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped lang="less">
.common-layout{
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>
