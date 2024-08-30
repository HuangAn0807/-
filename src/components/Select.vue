<script setup lang='js' name=''>
const selectValue = defineModel()
defineProps(['modelValue','options'])
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div >
    <!-- 写法一使用prop和自定义事件 -->
    <!-- <select :value="modelValue" @change="emit('update:modelValue',$event.target.value)" >
      <option v-for="item in options" :value="item.value" :label="item.label"></option>
    </select> -->

    <!-- 写法二使用defineModel实现 -->
    <select v-model="selectValue" >
      <option v-for="item in options" :value="item.value" :label="item.label"></option>
    </select>
</div>
</template>

<style scoped >

</style>