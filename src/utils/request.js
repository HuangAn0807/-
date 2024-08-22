import axios from 'axios'
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
 const instance =  axios.create({
    baseURL:'https:/v3pz.itndedu.com/v3pz',
    timeout:10 * 1000 //超时时间
  })
  // 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const userStore = useUserStore()
  const token = userStore.token
  // 不需要携带token的页面
  const whiteUrl = ['/login','/get/code','/user/authentication']
  // 将token携带至响应头
  if(token && !whiteUrl.includes(config.url)){
    config.headers['x-token'] = token
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 对于接口异常的数据，给用户提示
  // if(response.data.code===-1){
  //   ElMessage.warning(response.data.message)
  // }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default instance
