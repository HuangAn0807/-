import {defineStore} from 'pinia'
import {ref} from 'vue'
export const useUserStore = defineStore('user',() => {
  // 用户信息
  const user = ref({
    userName:'',
    passWord:''
  })
  // token
  const token = ref('')
  const setToken = (value) => {
      token.value = value
    }
  const setUserInfo = (userObj) => {
      user.value = userObj
  }
    return {token,setToken,setUserInfo,user}
},{persist:true})