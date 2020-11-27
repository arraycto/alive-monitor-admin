import request from '@/utils/request'

// 获取趋势数据
export function getTrendData(params) {
  return request({
    url: '/_panel/get_trend_data',
    method: 'get',
    params
  })
}

// 获取实时面板数据
export function getRealTimeData(params) {
  return request({
    url: '/_panel/get_real_time_data',
    method: 'get',
    params
  })
}
