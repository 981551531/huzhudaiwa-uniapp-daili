function normalizeModalOptions(options) {
  if (typeof options === 'string') {
    return {
      content: options
    }
  }

  return options || {}
}

export function showAlert(options = {}) {
  const {
    title = '提示',
    content = '',
    confirmText = '确定'
  } = normalizeModalOptions(options)

  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      showCancel: false,
      confirmText,
      success: () => resolve(true),
      fail: () => resolve(false)
    })
  })
}

export function showConfirm(options = {}) {
  const {
    title = '提示',
    content = '',
    confirmText = '确定',
    cancelText = '取消'
  } = normalizeModalOptions(options)

  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      success: (res) => resolve(!!res.confirm),
      fail: () => resolve(false)
    })
  })
}

export function showActionSheet(options = {}) {
  const {
    itemList = [],
    itemColor = '#303133'
  } = options

  return new Promise((resolve, reject) => {
    uni.showActionSheet({
      itemList,
      itemColor,
      success: (res) => resolve(res.tapIndex),
      fail: reject
    })
  })
}

export default {
  showAlert,
  showConfirm,
  showActionSheet
}
