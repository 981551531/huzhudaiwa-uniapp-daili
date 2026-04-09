/**
 * 定位工具
 * 支持 GPS 定位、IP 定位、逆地理解析和地点选择
 */

import { getEnvConfig } from '@/config/env.js'

const CACHE_DURATION = 1000 * 60 * 10

const IP_LOCATION_APIS = [
  {
    url: 'https://api.ip.sb/geoip',
    parser: (data) => ({
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      province: data.region,
      country: data.country
    })
  },
  {
    url: 'https://ipapi.co/json/',
    parser: (data) => ({
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      province: data.region,
      country: data.country_name
    })
  }
]

export function reverseGeocode(latitude, longitude, mapKey) {
  return new Promise((resolve) => {
    // #ifdef H5
    if (mapKey) {
      const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${mapKey}&output=jsonp&callback=QQmapCallback`
      jsonp(url, 'QQmapCallback').then((res) => {
        if (res && res.status === 0 && res.result) {
          const addr = res.result.address_component || {}
          const adInfo = res.result.ad_info || {}
          resolve({
            province: adInfo.province || addr.province || '',
            city: adInfo.city || addr.city || '',
            district: adInfo.district || addr.district || '',
            street: addr.street || '',
            address: res.result.address || '',
            formatted_address: res.result.formatted_addresses?.recommend || res.result.address || ''
          })
          return
        }

        resolve(getDefaultAddress(latitude, longitude))
      }).catch((error) => {
        console.warn('逆地理编码失败', error)
        resolve(getDefaultAddress(latitude, longitude))
      })
      return
    }
    // #endif

    resolve(getDefaultAddress(latitude, longitude))
  })
}

function getDefaultAddress(latitude, longitude) {
  return {
    province: '未知省份',
    city: '未知城市',
    district: '未知区域',
    street: '未知街道',
    address: `位置：${latitude}, ${longitude}`,
    formatted_address: `位置：${latitude}, ${longitude}`
  }
}

function jsonp(url, callbackName) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('当前环境不支持 JSONP'))
      return
    }

    const script = document.createElement('script')
    script.src = url

    window[callbackName] = (data) => {
      resolve(data)
      document.body.removeChild(script)
      delete window[callbackName]
    }

    script.onerror = () => {
      reject(new Error('JSONP 请求失败'))
      document.body.removeChild(script)
      delete window[callbackName]
    }

    document.body.appendChild(script)
  })
}

export function getLocationByIP() {
  return new Promise(async (resolve, reject) => {
    for (const api of IP_LOCATION_APIS) {
      try {
        const response = await new Promise((res, rej) => {
          uni.request({
            url: api.url,
            method: 'GET',
            timeout: 5000,
            success: res,
            fail: rej
          })
        })

        if (response.statusCode === 200 && response.data) {
          const locationData = api.parser(response.data)
          if (locationData.latitude && locationData.longitude) {
            const addressInfo = await reverseGeocode(locationData.latitude, locationData.longitude)
            resolve({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              accuracy: 1000,
              address: addressInfo,
              source: 'ip'
            })
            return
          }
        }
      } catch (error) {
        console.warn(`IP 定位接口失败：${api.url}`, error)
      }
    }

    reject(new Error('所有 IP 定位服务均不可用'))
  })
}

export function getLocationByGPS(options = {}) {
  const defaultOptions = {
    type: 'gcj02',
    geocode: true,
    altitude: false,
    isHighAccuracy: true,
    highAccuracyExpireTime: 5000,
    timeout: 10000,
    ...options
  }

  return new Promise((resolve, reject) => {
    uni.getLocation({
      ...defaultOptions,
      success: async (res) => {
        try {
          let addressInfo = res.address

          if (!addressInfo || !addressInfo.city) {
            const envConfig = getEnvConfig()
            addressInfo = await reverseGeocode(res.latitude, res.longitude, envConfig.MAP_KEY)
          }

          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            accuracy: res.accuracy,
            speed: res.speed,
            altitude: res.altitude,
            address: addressInfo,
            source: 'gps'
          })
        } catch (error) {
          console.warn('地址解析失败，已回退为默认地址', error)
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            accuracy: res.accuracy,
            speed: res.speed,
            altitude: res.altitude,
            address: getDefaultAddress(res.latitude, res.longitude),
            source: 'gps'
          })
        }
      },
      fail: (error) => {
        console.warn('GPS 定位失败', error)
        reject(error)
      }
    })
  })
}

export function getLocation(options = {}) {
  return new Promise(async (resolve, reject) => {
    const cachedLocation = getCachedLocation()
    if (cachedLocation && !options.forceRefresh) {
      resolve(cachedLocation)
      return
    }

    try {
      const location = await getLocationByGPS(options)
      cacheLocation(location)
      resolve(location)
    } catch (gpsError) {
      console.warn('GPS 定位失败，尝试使用 IP 定位', gpsError)
      try {
        const location = await getLocationByIP()
        cacheLocation(location)
        resolve(location)
      } catch (ipError) {
        reject(ipError)
      }
    }
  })
}

function cacheLocation(location) {
  try {
    uni.setStorageSync('cachedLocation', {
      ...location,
      timestamp: Date.now()
    })
  } catch (error) {
    console.warn('缓存定位信息失败', error)
  }
}

export function getCachedLocation() {
  try {
    const cached = uni.getStorageSync('cachedLocation')
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached
    }
  } catch (error) {
    console.warn('读取定位缓存失败', error)
  }

  return null
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  const f = ((lat1 + lat2) / 2) * Math.PI / 180.0
  const g = ((lat1 - lat2) / 2) * Math.PI / 180.0
  const l = ((lng1 - lng2) / 2) * Math.PI / 180.0

  const sg = Math.sin(g) ** 2
  const sl = Math.sin(l) ** 2
  const sf = Math.sin(f) ** 2

  const s = sg * (1 - sl) + (1 - sf) * sl
  const c = (1 - sg) * (1 - sl) + sf * sl
  const w = Math.atan(Math.sqrt(s / c))
  const r = Math.sqrt(s * c) / w
  const d = 2 * w * 6378137.0
  const h1 = (3 * r - 1) / (2 * c)
  const h2 = (3 * r + 1) / (2 * s)
  const fl = 1 / 298.257

  const distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))

  if (distance < 1000) {
    return `${distance.toFixed(0)}m`
  }

  return `${(distance / 1000).toFixed(1)}km`
}

export function chooseLocation() {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          name: res.name,
          address: res.address
        })
      },
      fail: (error) => {
        if (error.errMsg?.includes('cancel')) {
          reject(new Error('用户取消了位置选择'))
          return
        }

        reject(error)
      }
    })
  })
}

export default {
  getLocation,
  getLocationByGPS,
  getLocationByIP,
  reverseGeocode,
  getCachedLocation,
  calculateDistance,
  chooseLocation
}
