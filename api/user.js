/**
 * 用户相关接口
 * 统一管理接口地址，便于维护和查找
 */

import http from '@/utils/request.js'

/**
 * 用户登录
 * @param {object} data - { username, password }
 */
export function loginApi(data) {
  return http.post('/auth/login', data, { noAuth: true })
}

/**
 * 手机号登录
 * @param {object} data - { phone, code }
 */
export function phoneLoginApi(data) {
  return http.post('/auth/phone-login', data, { noAuth: true })
}

/**
 * 发送验证码
 * @param {object} data - { phone }
 */
export function sendSmsCodeApi(data) {
  return http.post('/auth/sms-code', data, { noAuth: true, noRepeat: true })
}

/**
 * 用户注册
 * @param {object} data - { username, password, phone, code }
 */
export function registerApi(data) {
  return http.post('/auth/register', data, { noAuth: true })
}

/**
 * 获取用户信息
 */
export function getUserInfoApi() {
  return http.get('/user/info')
}

/**
 * 更新用户信息
 * @param {object} data - 用户信息
 */
export function updateUserInfoApi(data) {
  return http.put('/user/info', data)
}

/**
 * 修改密码
 * @param {object} data - { oldPassword, newPassword }
 */
export function changePasswordApi(data) {
  return http.post('/user/change-password', data)
}

/**
 * 上传头像
 * @param {string} filePath - 文件路径
 */
export function uploadAvatarApi(filePath) {
  return http.upload({
    url: '/user/avatar',
    filePath,
    name: 'avatar',
    loading: true,
    loadingText: '上传中...'
  })
}

/**
 * 退出登录
 */
export function logoutApi() {
  return http.post('/auth/logout')
}
