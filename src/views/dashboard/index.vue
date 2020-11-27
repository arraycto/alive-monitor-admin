<template>
  <div class="dashboard-container">
    <el-card>
      <el-row class="dashboard-top" :gutter="20">
        <el-col :span="6">
          <div>
            <div class="title">负面评论</div>
            <el-row>
              <el-col :span="24">
                <div class="number">
                  {{ percentageWarp(quickLook.bad_comment.today_bad_per) }}%

                </div>
              </el-col>

              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.bad_comment.yesterday_bad_per) }}%
                </div>
                <span class="des">环比</span>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.bad_comment.seven_days_bad_per) }}%
                </div>
                <span class="des">同比</span>
              </el-col>
            </el-row>
            <br>
            <div class="des">
              负评数
              {{ numberWarp(quickLook.bad_comment.today_bad_all) }} |
              总评数
              {{ numberWarp(quickLook.bad_comment.today_all) }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="border">
            <div class="title">直播卡顿</div>
            <el-row>
              <el-col :span="24">
                <div class="number">
                  {{ percentageWarp(quickLook.ka.today_ka_per) }}%
                </div>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.ka.yesterday_ka_per) }}%
                </div>
                <span class="des">环比</span>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.ka.seven_days_ka_per) }}%
                </div>
                <span class="des">同比</span>
              </el-col>
            </el-row>
            <br>
            <div class="des">
              卡顿数 {{ numberWarp(quickLook.ka.today_ka_all )|| 0 }} | 总人数
              {{ numberWarp(quickLook.ka.today_all) || 0 }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="border">
            <div class="title">访问异常</div>
            <el-row>
              <el-col :span="24">
                <div class="number">
                  {{ percentageWarp(quickLook.page.today_per) }}%
                </div>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.page.yesterday_per) }}%
                </div>
                <span class="des">环比</span>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ percentageWarp(quickLook.page.seven_days_page_per) }}%
                </div>
                <span class="des">同比</span>
              </el-col>
            </el-row>
            <br>
            <div class="des">
              异常数 {{ numberWarp(quickLook.page.today_page_all) }} | 访问数
              {{ numberWarp(quickLook.page.today_all) }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="border">
            <div class="title">编辑异常</div>
            <el-row>
              <el-col :span="24">
                <div class="number">
                  {{ numberWarp(quickLook.operate.today_all) }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ numberWarp(quickLook.operate.yesterday_all) }}
                </div>
                <span class="des">环比</span>
              </el-col>
              <el-col :span="12">
                <div class="">
                  {{ numberWarp(quickLook.operate.seven_days_all) }}
                </div>
                <span class="des">同比</span>
              </el-col>
            </el-row>
            <br>
            <div style="visibility:hidden">/</div>
          </div>
        </el-col>
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
          @change="timePiker"
        />
      </div>
      <br>
      <br>
      <br>
      <!-- 图表📈 -->
      <Charts ref="chart" v-loading="loading" :chart-data="chartData" />
    </el-card>
    <br>
  </div>
</template>
<script>
import Charts from '../../components/Charts'
import { getRealTimeData, getTrendData } from '@/api/query'

const now = new Date()

export default {
  name: 'Dashboard',
  components: { Charts },
  data() {
    return {
      timeLimit: [new Date(now.getFullYear(), now.getMonth(), now.getDate()), new Date()],
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
      },
      quickLook: {
        bad_comment: { title: '负面评论率' },
        ka: { title: '卡顿率' },
        operate: { title: '创建编辑失败数' },
        page: { title: '页面异常率' }
      },
      chartData: {},
      loading: false
    }
  },

  mounted() {
    getRealTimeData({}).then((res) => {
      const { data } = res
      this.quickLook = data
    })
    this.loading = true
    const start = this.timeLimit[0]
    const end = this.timeLimit[1]
    getTrendData({
      type: 2,
      start_time: `${start.getFullYear()}-${
        start.getMonth() + 1
      }-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`,
      end_time: `${end.getFullYear()}-${
        end.getMonth() + 1
      }-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`
    }).then((res) => {
      this.loading = false
      const { data } = res
      this.chartData = data
      this.$refs.chart.initChart(this.chartData)
    })
  },
  methods: {
    timePiker() {
      const start = this.timeLimit[0]
      const end = this.timeLimit[1]
      let type = 2

      const dateGap = (end - start) / 1000 / 60
      if (dateGap <= 60) {
        type = 1
      } else if (dateGap > 60 * 24) {
        type = 3
      }
      console.log(dateGap, 'time')
      this.loading = true
      getTrendData({
        type,
        start_time: `${start.getFullYear()}-${
          start.getMonth() + 1
        }-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`,
        end_time: `${end.getFullYear()}-${
          end.getMonth() + 1
        }-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`
      }).then((res) => {
        this.loading = false
        const { data } = res
        this.chartData = data
        this.$refs.chart.initChart(this.chartData)
      })
    },
    numberWarp(num) {
      if (!num) return 0
      if (num >= 100000000) {
        return Math.floor(num / 100000000) + ' 亿'
      } else if (num >= 10000) {
        return Math.floor(num / 10000) + ' 万'
      } else {
        return num
      }
    },
    percentageWarp(num) {
      if (!num) return 0
      // return num;
      return num.toFixed(2)
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
.title {
  text-align: center;
}
.name {
  display: inline-block;
  width: 120px;
}
.dashboard-top {
  padding: 0 0 2px;
  color: #666;
  text-align: center;

  .el-col-6 {
    min-height: 128px;
  }
  .title {
    font-size: 20px;
    font-weight: 400;
  }
  .des {
    font-size: 14px;
    // padding-bottom: 20px;
  }
  .number {
    color:#000;
    padding: 16px 0 10px;
    font-size: 26px;
    font-weight: bold;
  }
  .border {
    border-left: solid 1px #ddd;
  }
}
</style>
