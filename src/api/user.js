import request from '@/utils/request'

export function login(data) {
  // return request({
  //   url: '/vue-admin-template/user/login',
  //   method: 'post',
  //   data
  // })
  // 暂时模拟登陆
  console.log('模拟请求 login')
  return new Promise((resolve) => {
    resolve({ 'code': 20000, 'data': { 'token': 'admin-token' }})
  })
}

export function getInfo(token) {
  // return request({
  //   url: '/vue-admin-template/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  // 暂时模拟登陆
  console.log('模拟请求 getInfo')
  return new Promise((resolve) => {
    resolve({ 'code': 20000, 'data': { 'roles': ['admin'], 'introduction': 'I am a super administrator', 'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', 'name': 'Super Admin' }})
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
