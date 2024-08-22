<script setup lang='ts' name='Admin'>
 import { getAdmin, getSelectList,editUser } from '@/api/menu';
import {onMounted,reactive,ref} from 'vue'
import dayjs from 'dayjs'
import {Clock} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';import { useRoute } from 'vue-router';
 const pageObj = reactive({
  pageNum:1,
  pageSize:10
 })
//  用户列表
const tableData = ref({
  list:[],
  total:null
})
// 获取路由实例
const route = useRoute()

// 控制弹窗显示隐藏
const dialogFormVisible = ref(false)
// 为表单设置唯一标识
const formRef = ref()
const form = reactive({
  name:'',
  permissions_id:'',
  mobile:''
})
//检验规则
const rules  ={
  name:[
    {required:true,message:'昵称不能为空',trigger:'blur'},
    {pattern:/^[0-9a-zA-Z_-]{4,16}$/,message:'昵称应为4到16的字符或数字',trigeger:'blur'}
  ],
  permissions_id:[
  {required:true,message:'权限不能为空',trigger:'blur'},
  ]
}
//  权限下拉列表
const premissionList = ref([])
//  当组件挂载后获取用户列表
 onMounted( async () => {
  getData()
  const result = await getSelectList()
  premissionList.value = result.data.data 
  
 })
//  获取用户列表
 const getData =async ()=>{
  const res = await getAdmin(pageObj)
  tableData.value.total= res.data.data.total
  tableData.value.list = res.data.data.list 
  // 将获取到的时间戳转为年月日
  tableData.value.list.forEach(item=>{
    item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
  })
 }
 
 const permission =(id) => {
    const data = premissionList.value.find(item =>item.id===id )  
    return data ? data.name : '超级管理员'
    
 }
 
// 编辑用户弹窗回显数据
 const editMenuPower = (row)=>{
    dialogFormVisible.value = true
    form.mobile = row.mobile
    form.name = row.name
    form.permissions_id = row.permissions_id

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

 //  关闭弹窗
 const closeDialog = () => {
  // 重置表单数据
 
  // 重置多选表单
 }

//  编辑用户
 const EditUser =async () => {
 await formRef.value.validate()
  const {name,permissions_id} = form
  const res =await editUser({name,permissions_id})
  if(res.data.code===10000){
    ElMessage.success('修改成功')
  }else{
    ElMessage.error('修改失败')
  }
  dialogFormVisible.value = false
  getData()
 }
</script>
<template>
  <PanelHead :meta="route.meta"/>
    <!-- 表格 -->
   <el-table :data="tableData.list" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column  prop="permissions_id" label="所属组别" >
        <template #default="scoped">
          {{ permission(scoped.row.permissions_id) }}
          </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column label="状态" prop="active">
        <template #default="scoped">
          <el-tag v-if="scoped.row.active" type="success">正常</el-tag>
          <el-tag v-else type="error">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time">
        <template #default=scoped>
          <el-icon><Clock/></el-icon>
          <span>{{ scoped.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" > 
          <template #default="scoped">
            <el-button 
            @click="editMenuPower(scoped.row)"
            type="primary">
            编辑
           </el-button>
          </template>
      </el-table-column>
   </el-table>

   <!-- 分页 -->
   <div class="paginntion">
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
<el-dialog 
    @close="closeDialog"  
    v-model="dialogFormVisible" 
    title="编辑用户" 
    width="500"
    :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item 
      label="手机号" 
      :label-width="'80px'" 
      label-position="left"
      prop="mobile"
      >
        <el-input v-model="form.mobile" autocomplete="off" disabled/>
      </el-form-item>

      <el-form-item 
      label="昵称" 
      :label-width="'80px'" 
      label-position="left"
      prop="name"
      >
        <el-input v-model="form.name" placeholder="请填写昵称" autocomplete="off" />
      </el-form-item>
      <el-form-item 
        label="菜单权限" 
        :label-width="'80px'" 
        label-position="left"
        prop="permissions_id"
      >
          <el-select  v-model="form.permissions_id" placeholder="请选择权限" style="width: 240px">
          <el-option
            v-for="item in premissionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >{{ item.name }}</el-option>
        </el-select>
  </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="EditUser">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped >
.el-icon{
  vertical-align: middle;
  margin-right: 5px;
}
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