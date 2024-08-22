import '@/assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from './stores/user'
import PanelHead from './components/PanelHead.vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia().use(persist))
app.use(router)
app.component('PanelHead',PanelHead)
const userStore = useUserStore()
// 添加路由守卫
router.beforeEach((to, from) => {
 if(!userStore.token && to.path !== '/login' ) {
  return router.push('/login')
 }else if(userStore.token && to.path == '/login'){
  return router.push('/')
 }
 return true
  // 返回 false 以取消导航
 
})
app.mount('#app')
