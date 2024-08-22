import request from '@/utils/request'

// 获取陪护师头像
export const getAvatar = () => request.get('/photo/list')

// 创建陪护师
export const createCompany = (data) => request.post('/companion',data)

// 获取陪护师列表
export const getCompany = (params) => request.get('/companion/list',{params})

// 删除陪护师
export const deleteCompany = data =>request.post('/delete/companion',data)