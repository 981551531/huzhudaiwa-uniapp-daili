/**
 * 全局字典数据
 * 用于存储和管理业务字典数据
 */

export const dictData = {
  orderStatus: [
    { label: '已取消', value: 0, color: '#999999' },
    { label: '待支付', value: 1, color: '#ff9500' },
    { label: '待发货', value: 2, color: '#1890ff' },
    { label: '待收货', value: 3, color: '#1890ff' },
    { label: '已完成', value: 4, color: '#52c41a' },
    { label: '退款中', value: 5, color: '#faad14' },
    { label: '已退款', value: 6, color: '#999999' }
  ],

  payStatus: [
    { label: '未支付', value: 0, color: '#999999' },
    { label: '支付中', value: 1, color: '#1890ff' },
    { label: '支付成功', value: 2, color: '#52c41a' },
    { label: '支付失败', value: 3, color: '#ff4d4f' },
    { label: '已退款', value: 4, color: '#999999' }
  ],

  payType: [
    { label: '微信支付', value: 1, icon: 'weixin-fill', color: '#07c160' },
    { label: '支付宝支付', value: 2, icon: 'zhifubao-fill', color: '#1677ff' },
    { label: '余额支付', value: 3, icon: 'wallet-fill', color: '#ff9500' },
    { label: '银行卡支付', value: 4, icon: 'bank-card-fill', color: '#722ed1' }
  ],

  gender: [
    { label: '未知', value: 0 },
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ],

  userStatus: [
    { label: '正常', value: 1, color: '#52c41a' },
    { label: '禁用', value: 0, color: '#ff4d4f' },
    { label: '待审核', value: 2, color: '#faad14' }
  ],

  auditStatus: [
    { label: '待审核', value: 0, color: '#faad14' },
    { label: '审核通过', value: 1, color: '#52c41a' },
    { label: '审核不通过', value: 2, color: '#ff4d4f' }
  ],

  productStatus: [
    { label: '下架', value: 0, color: '#999999' },
    { label: '上架', value: 1, color: '#52c41a' },
    { label: '售罄', value: 2, color: '#ff4d4f' }
  ],

  addressType: [
    { label: '家', value: 1, icon: 'home' },
    { label: '公司', value: 2, icon: 'office-building' },
    { label: '学校', value: 3, icon: 'school' },
    { label: '其他', value: 4, icon: 'map' }
  ],

  weekDays: [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 7 }
  ],

  timeSlots: [
    { label: '上午', value: 1, timeRange: '08:00-12:00' },
    { label: '中午', value: 2, timeRange: '12:00-14:00' },
    { label: '下午', value: 3, timeRange: '14:00-18:00' },
    { label: '晚上', value: 4, timeRange: '18:00-22:00' }
  ],

  couponType: [
    { label: '满减券', value: 1, color: '#ff4d4f' },
    { label: '折扣券', value: 2, color: '#faad14' },
    { label: '代金券', value: 3, color: '#1890ff' },
    { label: '兑换券', value: 4, color: '#52c41a' }
  ],

  couponStatus: [
    { label: '未使用', value: 0, color: '#1890ff' },
    { label: '已使用', value: 1, color: '#999999' },
    { label: '已过期', value: 2, color: '#ff4d4f' }
  ],

  refundReason: [
    { label: '不想要了', value: 1 },
    { label: '商品描述与实际不符', value: 2 },
    { label: '商品质量问题', value: 3 },
    { label: '商品损坏', value: 4 },
    { label: '发错货/漏发', value: 5 },
    { label: '其他原因', value: 6 }
  ],

  feedbackType: [
    { label: '功能建议', value: 1 },
    { label: '问题反馈', value: 2 },
    { label: '投诉举报', value: 3 },
    { label: '其他', value: 4 }
  ]
}

/**
 * 根据字典名称和值获取标签
 * @param {string} dictName 字典名称
 * @param {number|string} value 值
 * @returns {string} 标签
 */
export function getDictLabel(dictName, value) {
  const dict = dictData[dictName]
  if (!dict) return ''
  const item = dict.find(d => d.value === value)
  return item ? item.label : ''
}

/**
 * 根据字典名称和值获取颜色
 * @param {string} dictName 字典名称
 * @param {number|string} value 值
 * @returns {string} 颜色
 */
export function getDictColor(dictName, value) {
  const dict = dictData[dictName]
  if (!dict) return ''
  const item = dict.find(d => d.value === value)
  return item?.color || ''
}

/**
 * 根据字典名称和值获取完整项
 * @param {string} dictName 字典名称
 * @param {number|string} value 值
 * @returns {Object|null} 字典项
 */
export function getDictItem(dictName, value) {
  const dict = dictData[dictName]
  if (!dict) return null
  return dict.find(d => d.value === value) || null
}

/**
 * 获取字典列表
 * @param {string} dictName 字典名称
 * @returns {Array} 字典列表
 */
export function getDictList(dictName) {
  return dictData[dictName] || []
}

/**
 * 获取字典选项（用于选择器）
 * @param {string} dictName 字典名称
 * @returns {Array} 选项列表
 */
export function getDictOptions(dictName) {
  const dict = dictData[dictName]
  if (!dict) return []
  return dict.map(item => ({
    label: item.label,
    value: item.value
  }))
}

export default {
  dictData,
  getDictLabel,
  getDictColor,
  getDictItem,
  getDictList,
  getDictOptions
}
