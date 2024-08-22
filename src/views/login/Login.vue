<script setup lang='js' name='Login'>
import {Lock,User} from '@element-plus/icons-vue'
 import {ref,toRaw} from 'vue'
 import {getCode,register,login} from '@/api/login'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import {userMenuPower} from '@/api/menu'
import {useMenuStore} from '@/stores'
 const isLogin = ref(false)
 //用来获取表单实例
 const refFrom = ref(null)
//  获取路由实例
 const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()
//  用户表单数据
const userForm = ref({
  userName:'',
  passWord:'',
  validCode:''
  
})
// 校验手机号和密码
const rules = {
  userName:[
    {required:true,message:'请输入手机号',trigger:'blur'},
    {pattern:/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    message:'请输入正确的手机号',trigger:'blur'}
  ],
  passWord:[
  {required:true,message:'请输入密码',trigger:'blur'},
  {pattern:/^[a-zA-Z0-9_-]{4,16}$/,
    message:'密码应由4到16位的数字英文或_-组成',trigger:'blur'}
  ]
}

const validCodeDown = ref({
  time:60,
  text:'获取验证码'
})
//  切换登录和注册
 const handelChange = () => {
  isLogin.value = !isLogin.value
  userForm.value = {
  userName:'',
  passWord:'',
  validCode:''
  }
 }
//  标识
 let flag = false
//  发送短信
 const getValidCode =async () => {
   await refFrom.value.validate()
  //  只有当倒计时结束时才可以再次开启定时器
   if(!flag){
    const res = await getCode({tel:userForm.value.userName}) 
    if(res.data.code===10000){
      ElMessage.success(res.data.msg)
    }else{
      return ElMessage.error('获取验证码失败')
    }
    flag = true
    let timer = setInterval(() => {
      if(validCodeDown.value.time <= 0){
        clearInterval(timer)
        // 倒计时结束后恢复文本和数据
        validCodeDown.value.time = 60
        validCodeDown.value.text = '获取验证码'
        flag = false
        return 
      } 
      validCodeDown.value.text = `剩余时间${validCodeDown.value.time}`
      validCodeDown.value.time--

   },1000)
   }
 }
//  登录
const submitLogin=async () => {
  await refFrom.value.validate()
  const res = await login(userForm.value)
  if(res.data.code === 10000){
    ElMessage.success('登录成功')
    userStore.setToken(res.data.data.token)
    userStore.setUserInfo(userForm.value)
    const result = await userMenuPower()
    // 将获取到的菜单列表进行路径拼接实现动态路由
   menuStore.userMenuList(result.data.data)
  //  添加路由
  toRaw(menuStore.menuList).forEach(item=>{
    router.addRoute('layout',item)
   })

     // 跳转至首页
    router.push('/')
  }else{
    ElMessage.error('用户名或密码错误')
  }
 
}
// 注册
const submitRegister =async () => {
  await refFrom.value.validate()
  if(!userForm.value.validCode){
    return ElMessage.error('请输入验证码') 
  }
  const res = await register(userForm.value)
  if(res.data.code === 10000){
    ElMessage.success('注册成功')
  // 注册成功后跳转到登录页
  isLogin.value = true
  }else{
    ElMessage.error('验证码不正确或该用户已被注册')
  }  
}
</script>
<template>
 <el-row class="login" justify="center" align="middle">
    <el-card v-if="isLogin" style="max-width: 480px" >
      <h3 class="login-title">DiDi陪诊</h3>
      <h4>登录</h4>
      <el-form ref="refFrom" :model="userForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input 
          :prefix-icon="User"
          v-model="userForm.userName" 
          placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="userForm.passWord" :prefix-icon="Lock"
          type="password" 
          placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item  >
          <el-link @click="handelChange" type="primary">去注册</el-link>
          <el-button  @click="submitLogin" class="submit" style="width: 150px;" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>


      <!-- 注册模块 -->
    <el-card v-else >
      <h3 class="login-title">DiDi陪诊</h3>
      <h4>注册</h4>
      <el-form ref="refFrom" :model="userForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input 
          :prefix-icon="User" 
          v-model="userForm.userName"
          placeholder="请输手机号" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input 
          :prefix-icon="Lock" 
          v-model="userForm.passWord"  
          type="password" 
          placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item prop="validCode"> 
            <el-input
            v-model="userForm.validCode" 
            :prefix-icon="Lock" 
            placeholder="验证码">
            <template #append>
              <el-button 
              @click="getValidCode" 
              class="validCode"
              style="width: 100px;">{{ validCodeDown.text }}</el-button> 
            </template>
            </el-input>
        </el-form-item>
        <el-form-item  >
          <el-link @click="handelChange" type="primary">去登录</el-link>
          <el-button @click="submitRegister" class="submit" style="width: 100px;" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
      
    </el-card>
 </el-row>
</template>

<style scoped >
.login{
  height: 100vh;
  .el-card{
    min-width:350px;
  }
  h4{
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
  }
  .login-title{
    padding-bottom: 20px;
  }
  .submit{
    margin-left: 20%;
  }
}
</style>