<template>
  <div class="dashboard-container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">  <el-input v-model="url" placeholder="请输入直播地址" /></el-col>
        <el-col :span="4">   <el-button type="primary" @click="search">搜索</el-button></el-col>
        <el-col :span="8" />
      </el-row>
    </el-card>
    <br>
    <el-card>
      <div style="float: right">
        <el-date-picker
          v-model="timeLimit"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          @change="search"
        />
      </div>
      <br>
      <br>
      <br>
      <br>
      <Charts ref="chart" v-loading="loading" :chart-data="chartData" />
    </el-card>
  </div>
</template>
<script>
import Charts from '@/components/Charts/index'
import { getTrendData } from '@/api/query'

const now = new Date()

export default {
  components: { Charts },
  data() {
    return {
      url: '',
      chartData: {},
      timeLimit: [new Date(now.getFullYear(), now.getMonth(), now.getDate()), new Date()],
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    search() {
      this.loading = true
      //                      apppchqltpt3482
      // 处理一下链接   https://appaklwlitn7978.h5.xiaoeknow.com/ https://appaklwlitn7978.h5.xiaoeknow.com/v1/course/alive/l_5fbdc184e4b04db7c090c2d8?type=2&pro_id=p_5fbdc175e4b04db7c090c2d0
      const appId = this.url.match(/app[a-z0-9]{12}/)
      const aliveId = this.url.match(/l_[a-z0-9]{24}/)
      console.log(appId, aliveId)
      if (!appId && !aliveId) this.$message.warning('请输入正确的URL地址')
      let option = {}
      if (aliveId && appId) {
        option['app_id'] = appId[0]
        option['alive_id'] = aliveId[0]
      } else {
        option['app_id'] = appId[0]
      }
      // live优先级大于merchant
      option = {
        ...option,
        ...this.getTimeWrap()
      }
      console.log(option)
      // 发起请求
      getTrendData(option).then((res) => {
        console.log(res.data, '获取的数据')
        this.loading = false
        this.$refs.chart.initChart(res.data)
      })
    },
    getTimeWrap() {
      const start = this.timeLimit[0]
      const end = this.timeLimit[1]
      console.log(start, end)
      let type = 2
      const dateGap = (end - start) / 1000 / 60
      if (dateGap <= 60) {
        type = 1
      } else if (dateGap > 60 * 24) {
        type = 3
      }
      const option = {
        type,
        start_time: `${start.getFullYear()}-${
          start.getMonth() + 1
        }-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`,
        end_time: `${end.getFullYear()}-${
          end.getMonth() + 1
        }-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`
      }
      return option
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboad-top{
  .title{
    font-size: 22px;
  }
}
</style>
