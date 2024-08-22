import request from '@/utils/request'

// 订单列表
export const adminOrder =  (params) => request.get('/admin/order',{params})

// 服务已完成
export const orderOver =  (data) => request.post('/update/order',data)

// 首页报表信息
export const report = () => request.get('/report')