<script setup lang='ts' name='Staff'>
import { ref, onMounted } from 'vue'
import {Plus,Delete,Clock,InfoFilled} from '@element-plus/icons-vue'
import { getAvatar, createCompany,getCompany,deleteCompany} from '@/api/company';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
// 控制弹窗显示隐藏
const dialogVisible = ref(false)

const route = useRoute()
// 页面显示数据的个数
const page = {
  pageNum:1,
  pageSize:10
}
// 数据总数
const total = ref()

// 表单唯一 标识
const formRef = ref()

// 删除数据的id
const idArray = ref([])
// 表单数据
const form = ref({
  id:'',
  mobile:'',
  active:1,
  age:20,
  avatar:'',
  name:'',
  sex:''
})
// 表单校验规则
const rules = {
  mobile:[
    {required:true,message:'请输入手机号',trigger:'blur'},
    {pattern:/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    message:'请输入正确的手机号',trigger:'blur'}
  ],
  avatar:[
    {required:true,mesage:'请选择头像'}
  ],
  name:[
    {required:true,message:'请输入姓名',trigger:'blur'},
    {pattern:/[\u4e00-\u9fa5]+(?:[\s\.-]?[\u4e00-\u9fa5]+)*/,message:'姓名格式不正确',trigger:'blur'}
  ],
  sex:[{required:true,message:'请选择性别',trigger:'blur'}]
}

// 选择头像弹窗的显示与隐藏
const dialogImgVisible = ref(false)

// 选中的头像下标
const selectIndex = ref(0)

// 头像列表
const avataList = ref([])

// 陪护师列表
const companyList = ref([])

const getCompanyList =async () => {
  const res = await getCompany(page)
  companyList.value = res.data.data.list
  total.value = res.data.data.total
  // 将获取到的时间戳转为年月日
  companyList.value.forEach(item=>{
    item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
  })
}

// 组件挂载后获取数据
onMounted(async() => {
  const res = await getAvatar()
  avataList.value = res.data.data
  getCompanyList()
})
// 确认头像函数
const confirmImg = () => {
  dialogImgVisible.value = false
  // 将选中的头像路径存到表单中
  form.value.avatar = avataList.value[selectIndex.value].url
}

// 打开弹窗后执行的函数
const open = () => {
  dialogVisible.value = true
}

// 关闭弹窗的回调函数
const beforeClose = () => {
  dialogVisible.value = false
 formRef.value.resetFields()
}

// 确认提交数据
const confirm =async () => {
 await formRef.value.validate()
 const res =await createCompany(form.value)
 if(res.data.code===10000){
  ElMessage.success('创建成功')
  // 添加成功后清空表单
  formRef.value.resetFields()
  // 重新渲染列表
  getCompanyList()
 }else{
  ElMessage.error('创建失败')
 }
  // 关闭弹窗
  dialogVisible.value = false
}

// 编辑陪护师 点击后将当前行数据赋值给表单用于回显数据
const editCompany = (row) => {
  dialogVisible.value = true
  form.value = row
}

// 多选框勾选
const handleSelectionChange = (val) => {
  // 将手机到的数据id取出来
  idArray.value = val.map(item=>({id:item.id}))  
}

// 删除陪护师
const delCompany = async () => {
  if(idArray.value.length===0){
    return ElMessage.warning('请至少选择一项数据')
  }
  console.log(idArray.value);
  
  const res = await deleteCompany({id:idArray.value})
  if(res.data.code===10000){
    ElMessage.success('删除成功')
    getCompanyList()
 }else{
  ElMessage.error('删除失败')
 }
console.log(res);

}

// 当前页码
const handleCurrentChange = (val) => {
    page.pageNum = val
    getCompanyList()
}

// 每页显示的数据
const handleSizeChange = (val) => {
    page.pageSize = val
    getCompanyList()
}
</script>
<template>
   <PanelHead :meta="route.meta"/>
  <!-- 按钮 -->
  <div class="btn">
    <el-button type="primary" :icon="Plus" @click="open">
    新增
    </el-button>
    <el-popconfirm
    width="220"
    confirm-button-text="确认"
    cancel-button-text="取消"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="你确定要删除吗？"
    @confirm="delCompany"
  >
    <template #reference>
      <el-button type="danger" :icon="Delete">删除</el-button>
    </template>
  </el-popconfirm>

  </div>

<!-- 表格区域 -->
  <el-table 
  :data="companyList" 
  style="width: 100%; min-width: 950px;"
  @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="id" prop="id"/>
    <el-table-column label="昵称" prop="name"/>
    <el-table-column label="头像" prop="avatar">
      <template #default="scoped">
        <el-image :src="scoped.row.avatar" style="width: 60px;vertical-align: middle"/>
      </template>
        
    </el-table-column>

    <el-table-column label="性别" prop="sex">
      <template #default="scoped">
        <span>{{ scoped.row.sex==1?'男':'女' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="手机号" prop="mobile"/>

    <el-table-column label="状态" prop="active">
      <template #default="scoped">
        <el-tag 
        type="success" 
        v-if="scoped.row.active">
        正常
      </el-tag>
      <el-tag 
        type="danger" 
        v-else>
        异常
      </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" prop="create_time">
      <template #default="scoped">
        <el-icon><Clock/></el-icon>
        <span>{{ scoped.row.create_time }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" >
      <template #default="scoped">
       <el-button type="primary" @click="editCompany(scoped.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
    <!-- 分页 -->
    <div class="paginntion">
   <el-pagination
      v-model:current-page="page.pageNum"
      v-model:page-size="page.pageSize"
      :disabled="false"
      layout="total, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</div>
  <!-- 弹窗 -->
  <el-dialog 
    v-model="dialogVisible"
    title="添加陪护师"
    width="500"
    :before-close="beforeClose"
    >

    <el-form 
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules"
    >
      <el-form-item v-show="false" >
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"/>
      </el-form-item>
      <!-- 头像上传 -->
      <el-form-item label="头像" prop="avatar">
        <el-button @click="dialogImgVisible=true" type="primary" v-if="!form.avatar">点击上传
        </el-button>
        <el-image v-else 
        :src="form.avatar"
        style="width: 100px;height: 100px;"/>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"/>
          <el-option label="女" value="2"/>
        </el-select>
      </el-form-item>
      <!-- 年龄 -->
       <el-form-item>
        <el-input-number v-model="form.age" :min="18" :max="50" />
       </el-form-item>
      <!-- 手机号 -->
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"/>
      </el-form-item>
      <!-- 是否生效 -->
      <el-form-item label="是否生效">
        <div class="my-4 ml-4">
          <el-radio-group v-model="form.active">
            <el-radio :value="0" size="small">失效</el-radio>
            <el-radio :value="1" size="small">生效</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 选择头像弹窗 -->
  <el-dialog
   v-model="dialogImgVisible"
  title="选择头像"
  width="680"
  >
      <div class="image-list">
          <div 
          v-for="(item,index) in avataList " :key="item.name" 
          class="img-box" 
          @click="selectIndex=index">
          <div v-if="selectIndex===index" class="select">
            <el-icon color="#fff"><Check/></el-icon>
          </div>
            <el-image 
            :src="item.url"
            style="width: 148px;"
            />
          </div>
      </div>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImg">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped >
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.el-icon{
  vertical-align: middle;
  margin-right: 10px;
}
.btn{
  padding: 10px 0 10px 10px;
  background-color: #fff;
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
</style>