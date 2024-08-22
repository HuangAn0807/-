<script setup lang='ts' name='Dashboard'>
import {report} from '@/api/order'
report().then(data=>{
  console.log(data);
  
})
</script>
<template>
  <div >
    权限管理
</div>
</template>

<style scoped >

</style>