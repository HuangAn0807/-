import request from '@/utils/request'

// 获取账号管理列表
export const getAdmin = (params) => request.get('/auth/admin',{params})

// 获取权限菜单列表
export const getPowerMenu = () => request.get('/user/getmenu')

// 菜单权限修改
export const setPowerMenu = (data) => request.post('/user/setmenu',data)

// 获取菜单权限列表
export const getPowerMenuList= (params) => request.get('/menu/list',{params})

// 菜单权限下拉
export const getSelectList = () => request.get('/menu/selectlist')
// 用户数据修改
export const editUser = (data) => request.post('/update/user',data)
// 权限修改
export const editPower = (data) => request.post('/user/setmenu',data)

// 用户菜单权限
export const userMenuPower = () => request.get('/menu/permissions')