/**
 * 文件上传工具
 * 支持图片、视频、文件的选择和上传
 */

import { getEnvConfig } from '@/config/env.js'
import { getToken } from './auth.js'
import { UPLOAD } from '@/config/constants.js'

/**
 * 格式化文件大小
 * @param {number} size 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(size) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

/**
 * 选择图片
 * @param {Object} options 配置选项
 * @returns {Promise<Object>} 选择的图片信息
 */
export function chooseImage(options = {}) {
  const defaultOptions = {
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    maxSize: UPLOAD.IMAGE_MAX_SIZE,
    ...options
  }

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: defaultOptions.count,
      sizeType: defaultOptions.sizeType,
      sourceType: defaultOptions.sourceType,
      success: (res) => {
        if (defaultOptions.maxSize) {
          const oversizedFiles = res.tempFiles.filter(file => file.size > defaultOptions.maxSize)
          if (oversizedFiles.length > 0) {
            uni.showToast({
              title: `文件大小不能超过${formatFileSize(defaultOptions.maxSize)}`,
              icon: 'none'
            })
            reject(new Error('文件大小超出限制'))
            return
          }
        }
        resolve({
          tempFilePaths: res.tempFilePaths,
          tempFiles: res.tempFiles
        })
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) {
          reject(new Error('用户取消选择'))
        } else {
          reject(err)
        }
      }
    })
  })
}

/**
 * 选择视频
 * @param {Object} options 配置选项
 * @returns {Promise<Object>} 选择的视频信息
 */
export function chooseVideo(options = {}) {
  const defaultOptions = {
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    compressed: true,
    ...options
  }

  return new Promise((resolve, reject) => {
    uni.chooseVideo({
      sourceType: defaultOptions.sourceType,
      maxDuration: defaultOptions.maxDuration,
      compressed: defaultOptions.compressed,
      success: (res) => {
        resolve({
          tempFilePath: res.tempFilePath,
          duration: res.duration,
          size: res.size,
          width: res.width,
          height: res.height
        })
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) {
          reject(new Error('用户取消选择'))
        } else {
          reject(err)
        }
      }
    })
  })
}

/**
 * 选择文件（仅支持部分平台）
 * @param {Object} options 配置选项
 * @returns {Promise<Object>} 选择的文件信息
 */
export function chooseFile(options = {}) {
  const defaultOptions = {
    count: 1,
    ...options
  }

  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.chooseMessageFile({
      count: defaultOptions.count,
      success: (res) => {
        resolve({
          tempFiles: res.tempFiles
        })
      },
      fail: reject
    })
    // #endif

    // #ifdef H5
    uni.chooseFile({
      count: defaultOptions.count,
      success: (res) => {
        resolve({
          tempFilePaths: res.tempFilePaths,
          tempFiles: res.tempFiles
        })
      },
      fail: reject
    })
    // #endif

    // #ifndef MP-WEIXIN || H5
    reject(new Error('当前平台不支持选择文件'))
    // #endif
  })
}

/**
 * 上传文件
 * @param {Object} options 上传配置
 * @returns {Promise<Object>} 上传结果
 */
export function uploadFile(options = {}) {
  const envConfig = getEnvConfig()
  const token = getToken()

  const defaultOptions = {
    url: envConfig.UPLOAD_URL || (envConfig.BASE_URL + '/upload'),
    filePath: '',
    name: 'file',
    formData: {},
    header: {},
    loading: true,
    loadingText: '上传中...',
    onProgress: null,
    ...options
  }

  if (!defaultOptions.filePath) {
    return Promise.reject(new Error('请选择要上传的文件'))
  }

  if (defaultOptions.loading) {
    uni.showLoading({ title: defaultOptions.loadingText, mask: true })
  }

  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: defaultOptions.url,
      filePath: defaultOptions.filePath,
      name: defaultOptions.name,
      formData: defaultOptions.formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...defaultOptions.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
            if (data.code === 200 || data.success) {
              resolve(data.data || data)
            } else {
              reject(new Error(data.message || data.msg || '上传失败'))
            }
          } catch (e) {
            reject(new Error('解析上传结果失败'))
          }
        } else {
          reject(new Error(`上传失败，状态码: ${res.statusCode}`))
        }
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '上传失败'))
      },
      complete: () => {
        if (defaultOptions.loading) {
          uni.hideLoading()
        }
      }
    })

    if (defaultOptions.onProgress && typeof defaultOptions.onProgress === 'function') {
      uploadTask.onProgressUpdate(defaultOptions.onProgress)
    }
  })
}

/**
 * 批量上传图片
 * @param {Array} filePaths 文件路径数组
 * @param {Object} options 上传配置
 * @returns {Promise<Array>} 上传结果数组
 */
export async function uploadImages(filePaths, options = {}) {
  const results = []
  for (const filePath of filePaths) {
    try {
      const result = await uploadFile({
        filePath,
        ...options
      })
      results.push({ success: true, data: result, filePath })
    } catch (error) {
      results.push({ success: false, error: error.message, filePath })
    }
  }
  return results
}

/**
 * 压缩图片
 * @param {string} src 图片路径
 * @param {number} quality 压缩质量 0-100
 * @returns {Promise<string>} 压缩后的图片路径
 */
export function compressImage(src, quality = 80) {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src,
      quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: reject
    })
  })
}

/**
 * 获取图片信息
 * @param {string} src 图片路径
 * @returns {Promise<Object>} 图片信息
 */
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 * @param {string} filePath 图片路径
 * @returns {Promise<void>}
 */
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({ title: '保存成功', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        if (err.errMsg?.includes('auth deny')) {
          uni.showModal({
            title: '提示',
            content: '请授权保存图片到相册',
            confirmText: '去授权',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 保存视频到相册
 * @param {string} filePath 视频路径
 * @returns {Promise<void>}
 */
export function saveVideoToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveVideoToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({ title: '保存成功', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        if (err.errMsg?.includes('auth deny')) {
          uni.showModal({
            title: '提示',
            content: '请授权保存视频到相册',
            confirmText: '去授权',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 预览图片
 * @param {Array} urls 图片URL数组
 * @param {number} current 当前显示图片的索引
 */
export function previewImage(urls, current = 0) {
  uni.previewImage({
    urls,
    current: typeof current === 'number' ? current : urls.indexOf(current)
  })
}

export default {
  chooseImage,
  chooseVideo,
  chooseFile,
  uploadFile,
  uploadImages,
  compressImage,
  getImageInfo,
  saveImageToPhotosAlbum,
  saveVideoToPhotosAlbum,
  previewImage
}
