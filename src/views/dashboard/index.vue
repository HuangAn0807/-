<script setup lang='ts' name='Dashboard'>
import {report} from '@/api/order'
import Select from '@/components/Select.vue';
import MyInput from '@/components/MyInput.vue';
import {ref, watchEffect} from 'vue'
report().then(data=>{
  console.log(data);
  
})

const selectValue = ref('')
watchEffect(() => {
  console.log(selectValue.value);
  
})
const options = ref([
  {value:"1" ,label:"深圳"},
  {value:"2", label:"广州"},
  {value:"3" ,label:"上海"},
  {value:"4" ,label:"北京"}
]
  
)
const inputValue = ref('黄小安')
</script>
<template>
  <div >
    权限管理
    <Select v-model="selectValue" :options="options"/>
    <MyInput v-model="inputValue" />
    <!-- <MyInput :modelValue="inputValue" @updata:modelValue="inputValue = $event"/> -->
</div>

</template>

<style scoped >

</style>