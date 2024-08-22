<script setup lang='js' name='Order'>
import {useRoute} from 'vue-router'
import {ref,onMounted} from 'vue'
import {adminOrder,orderOver} from '@/api/order'
import PanelHead from '@/components/PanelHead.vue';
import dayjs from 'dayjs';
import {InfoFilled} from '@element-plus/icons-vue'
const route = useRoute()
// 订单数据
const orderList = ref([])
// 订单总数
const total = ref(0)
// 订单状态
const status = (key) => {
  const obj = {
    '已取消':'info',
    '待支付':'warning',
    '已完成':'success'
  }
  return obj[key]
}
// 分页数据
const page = ref({
  pageNum:1,
  pageSize:6
})
// 获取订单列表数据
const getData = async (params = {}) => {
  const res = await adminOrder({...page.value,...params})
  orderList.value = res.data.data.list
  total.value = res.data.data.total
  console.log(orderList.value);
  
}
onMounted(() => {
  getData()
  
})
// 服务完成
const confirmCompany =async (id) => {
const res = await orderOver(id)
console.log(res);

if(res.data.code===10000){
  ElMessage.success('更新成功')
}else{
  ElMessage.error('更新失败')
}
getData()
}

// 当前页码
const handleCurrentChange = (val) => {
    page.pageNum = val
    getData()
}

// 每页显示的数据
const handleSizeChange = (val) => {
    page.pageSize = val
    getData()
}

const searchFrom  = ref({
  out_trade_no:''
})

const onSearch = () => {
  getData(searchFrom.value)
}
</script>
<template>
    <PanelHead :meta="route.meta"/>
    <el-form class="search" :model="searchFrom">
        <el-form-item  style="margin-right: 20px;">
          <el-input  v-model="searchFrom.out_trade_no" placeholder="订单号"/>
        </el-form-item>

        <el-form-item >
          <el-button type="primary"  @click="onSearch">查询</el-button>
        </el-form-item>
 
    </el-form>
    <el-table :data="orderList">
      <el-table-column 
      prop="out_trade_no" 
      label="订单号"
      width="150"
      fixed="left"
      />

      <el-table-column width="120" prop="hospital_name" label="就诊医院"/>

      <el-table-column width="140" prop="service_name" label="陪诊服务"/>

      <el-table-column  label="陪护师头像">
          <template #default="scoped">
            <el-image style="width: 40px; border-radius: 50%;" :src="scoped.row.companion.avatar"/>
          </template>
      </el-table-column>

      <el-table-column  width="120" label="陪护师手机号">
        <template #default="scoped">
           {{ scoped.row.companion.mobile }}
          </template>
      </el-table-column>

      <el-table-column prop="price" label="总价"/>
      <el-table-column prop="paidPrice" label="已付"/>
      <el-table-column  width="120" label="下单时间">
        <template #default="scoped">
          {{ dayjs(scoped.row.order_start_time).format('YYYY-MM-DD')  }}
        </template>
      </el-table-column>

      <el-table-column prop="service_name" label="订单状态">
        <template #default="scoped">
          <el-tag :type="status(scoped.row.trade_state)">
            {{scoped.row.trade_state}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column   prop="service_state"  label="接单状态"/>
      <el-table-column  width="120" prop="tel"  label="联系人手机号"/>

      <el-table-column  fixed="right" width="100" prop="service_name" label="操作">
        <template #default="scoped">
              <el-popconfirm
              v-if="scoped.row.trade_state === '待服务'"
                width="220"
                confirm-button-text="是"
                cancel-button-text="否"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="是否确认完成？"
                @confirm="confirmCompany(scoped.row.out_trade_no)"
              >
              <template #reference>
                <el-button type="primary" link >服务完成</el-button>
              </template>
            </el-popconfirm>
            <el-button v-else type="primary" link disabled>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页效果 -->
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
</template>

<style scoped >
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
  .search{
    padding: 20px 200px 0 0;
    display: flex;
    justify-content: end;
  }
</style>