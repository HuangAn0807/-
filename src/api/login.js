import request from '@/utils/request'
// 获取验证码
export const getCode = (data) => request.post('/get/code',data)

// 注册
export const register = (data) => request.post('/user/authentication',data)

// 登录
export const login = (data) => request.post('/login',data)