<template>
  <div ref="charts" :class="className" :style="{ height: height, width: width }" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'Charts',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '340px'
    },
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      data: {}
    }
  },
  // watch:{

  // },
  mounted() {
    this.chart = echarts.init(this.$refs.charts)
    this.$nextTick(() => {
      this.initChart({
        ka: [],
        bad_comment: [],
        operate: [],
        page: []
      })
    })
  },
  updated() {
    this.data = this.chartData
    this.$nextTick(() => {
      // this.initChart()
    })
  },
  methods: {
    initChart(chartData) {
      // var colors = ['#5793f3', '#d14a61', '#675bba'];
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['卡顿率', '负面评论率', '创建失败率', '页面异常数']
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        // 工具栏
        toolbox: {
          feature: {
            // 保存截图
            saveAsImage: {}
          }
        },
        // 缩放工具
        // dataZoom: [
        //   {
        //     type: 'slider'
        //   }
        // ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartData.data_x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '卡顿率',
            type: 'line',
            stack: '总量',
            data: chartData.ka
          },
          {
            name: '负面评论率',
            type: 'line',
            stack: '总量',
            data: chartData.bad_comment
          },
          {
            name: '创建失败率',
            type: 'line',
            stack: '总量',
            data: chartData.operate
          },
          {
            name: '页面异常数',
            type: 'line',
            stack: '总量',
            data: chartData.page
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
