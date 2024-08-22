<script setup lang='js' name='Group'>
import {ref,onMounted,reactive, nextTick} from 'vue'
import { getPowerMenu, setPowerMenu, getPowerMenuList } from '@/api/menu';
import { Edit,Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
const dialogFormVisible = ref(false)
// 菜单权限列表
const powerMenuList = ref([])
// 默认勾选的菜单
const defaultChecked = ref([4,5])
// 控制弹窗标题
const isEdit = ref(true)
// 表单数据
const form = ref({
  id:'',
  name:'',
  permissions:''
})
// 获取路由实例
const route = useRoute()
// 定义校验规则
const rules = {name:{required:true,message:'权限名称不能为空',trigger:'blur'}}

// 获取数据的数量 和当前页数
const pageObj = reactive({
  pageNum:1,
  pageSize:10
 })

// 定义表单唯一标识
const formRef = ref()
const treeRef = ref()

// 菜单权限列表数据
const tableData = ref({
  list:[],
  total:null
})

// 组件挂载之后获取数据列表
onMounted(async () => {
  const res = await getPowerMenu()
  // 权限菜单列表
  powerMenuList.value = res.data.data 
})

// 控制编辑状态和弹窗开关
const change = () => {
  dialogFormVisible.value = true
  isEdit.value = true
}

// 添加权限
const addPower = async () => {
 await formRef.value.validate()
 form.value.permissions = JSON.stringify(treeRef.value.getCheckedKeys())
//  判断行为是添加还是编辑
 if(isEdit.value){
    const res = await setPowerMenu(form.value)
    if(res.data.code===10000){
      ElMessage.success('添加权限成功')
      // 渲染数据
      getData()
      // 关闭弹窗 重置列表
      closeDialog()
    }else{
      ElMessage.success('添加权限失败')
    }
 }else{
  const res =await setPowerMenu(form.value)
  if(res.data.code===10000){
      ElMessage.success('权限修改成功')
      // 渲染数据
      getData()
      // 关闭弹窗 重置列表
      closeDialog()
    }else{
      ElMessage.success('权限修改失败')
    }
    isEdit.value = true
 }
 
  dialogFormVisible.value = false
}

//  获取菜单权限列表数据
 const getData =async() => {
  const res = await  getPowerMenuList(pageObj)
  tableData.value.list = res.data.data.list
  tableData.value.total = res.data.data.total
  console.log( res);
  
 }
 getData()

//  编辑权限
 const editMenuPower =async ({row}) => {
  dialogFormVisible.value = true
  isEdit.value = false
  // 弹窗打开是异步的
  nextTick(async () => {
  // 回显数据到编辑菜单中
  form.value = {id:row.id,name:row.name}
  // 回显多选框
  treeRef.value.setCheckedKeys(row.permission)
  // isEdit.value = true 
  })
   
 }

//  关闭弹窗
 const closeDialog = () => {
  // 重置表单数据
  formRef.value.resetFields()
  // 重置多选表单
  treeRef.value.setCheckedKeys(defaultChecked.value)
 }

 //页面展示的数据个数发生变化时触发
 const handleSizeChange = (size) => {
    pageObj.pageSize = size
    getData()
 }

// 当前页数发生变化时触发
 const handleCurrentChange = (value) => {
    pageObj.pageNum = value
    getData()
 }
</script>
<template>
  <PanelHead :meta="route.meta"/>

  <div class="add-btn">
    <el-button :icon="Plus" type="primary" @click="change">
    添加
  </el-button>
  </div>

  <!-- 表格 -->
   <el-table :data="tableData.list" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column width="500px" prop="permissionName" label="菜单权限" />
      <el-table-column  label="操作" > 
          <template #default="$row">
            <el-button 
            @click="editMenuPower($row)"
            circle 
            type="primary" 
            :icon="Edit"/>
          </template>
      </el-table-column>
   </el-table>
<div class="paginntion">
       <!-- 分页 -->
   <el-pagination
      v-model:current-page="pageObj.pageNum"
      v-model:page-size="pageObj.pageSize"
      :disabled="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</div>


  <!-- 弹窗 -->
  <el-dialog @close="closeDialog"  v-model="dialogFormVisible" :title="isEdit?'添加权限':'编辑权限' " width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item v-show="false">
          <el-input v-model="form.id"/>
      </el-form-item>
      <el-form-item 
      label="名称" 
      :label-width="'80px'" 
      label-position="left"
      prop="name"
      >
        <el-input v-model="form.name" placeholder="请填写权限名称" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <!--  :default-checked-keys="[5]" 默认被选中 -->
        <el-tree
        ref="treeRef"
        :title="权限"
        style="max-width: 600px"
        :data="powerMenuList"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultChecked"
        :default-expanded-keys="[2]"
        :props="defaultProps"
      />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addPower">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped >
  .paginntion{
    width: 100%;
    background-color: #ffffff;
    .el-pagination{
     justify-content: end;
     padding-right: 100px;
      width: 100%;
      height: 40px;
    }
  }
  .add-btn{
    padding: 20px 0px 10px 10px;
    background-color: #fff;
  }
</style>