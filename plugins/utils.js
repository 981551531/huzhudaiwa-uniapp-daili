import Vue from 'vue';
// #ifdef APP-PLUS
import {
    judgePermission
} from './permission'
// #endif
//金额过滤
Vue.filter('money', function (val) {
    if (val) {
        let value = Math.round(parseFloat(val) * 100) / 100;
        let valMoney = value.toString().split(".");
        if (valMoney.length == 1) {
            value = value.toString() + ".00";
            return value;
        }
        if (valMoney.length > 1) {
            if (valMoney[1].length < 2) {
                value = value.toString() + "0";
            }
            return value;
        }
        return value;
    } else {
        return "0.00";
    }
});
//手机号中间4位为*
Vue.filter('phone', function (val) {
    var tel = val;
    tel = "" + tel;
    var telShort = tel.replace(tel.substring(3, 7), "****")
    return telShort
})
//获取系统信息、判断ipX安全距离
export const getTabbarHeight = function () {
    var systemInfo = uni.getSystemInfoSync()
    var data = {
        ...systemInfo,
        tabbarH: 50, //tabbar高度--单位px
        tabbarPaddingB: 0, //tabbar底部安全距离高度--单位px
        device: systemInfo.system.indexOf('iOS') != -1 ? 'iOS' : 'Android', //苹果或者安卓设备
    }
    let modelArr = ['10,3', '10,6', 'X', 'XR', 'XS', '11', '12', '13', '14', '15', '16'];
    let model = systemInfo.model;
    model && modelArr.forEach(item => {
        //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
        if (model.indexOf(item) != -1 && (model.indexOf('iPhone') != -1 || model.indexOf('iphone') != -1)) {
            data.tabbarH = 70
            data.tabbarPaddingB = 20
        }
    })
    return data;
}

//计算两点距离
export const commonDistance = function (lat1, lng1, lat2, lng2) {
    var f = ((lat1 + lat2) / 2) * Math.PI / 180.0;
    var g = ((lat1 - lat2) / 2) * Math.PI / 180.0;
    var l = ((lng1 - lng2) / 2) * Math.PI / 180.0;
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    var s, c, w, r, d, h1, h2;
    var a = 6378137.0; //地球的直径
    var fl = 1 / 298.257;
    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    var num = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
    // 换算单位
    if (num == undefined) {
        num = "0.0 m"
    }
    ;
    if (num < 1000) {
        num = (Math.round(num)).toFixed(1) + "m"
    } else if (num > 1000) {
        num = (Math.round(num / 100) / 10).toFixed(1) + "km"
    }
    return num
}
// px转upx
export const px2upx = function (n) {
    return n / (uni.upx2px(n) / n);
}

// 判断两时间段之间活动状态、判断活动还有多长时间开始、多长时间结束----添加定时器运行此方法可倒计时
// var startTime = new Date(item.startTime.replace(/-/g, '/')).getTime(); //转时间戳
// var closeTime = new Date(item.closeTime.replace(/-/g, '/')).getTime(); //转时间戳
// var djs = this.djsTime(startTime, closeTime);
export const djsTime = function (startTime, endTime) {
    var bbb = new Date().getTime(),
        leftTime = startTime - bbb,
        rightTime = endTime - bbb,
        djsTime = '',
        speed = 0,
        activityStatus = 0, //活动状态 1：未开始 2：进行中 3：已结束
        dd, hh, mm, ss;
    if (leftTime > 0) { //还未开始
        activityStatus = 1
        dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        hh = Math.floor((leftTime / 1000 / 60 / 60) % 24) < 10 ? '0' + Math.floor((leftTime / 1000 / 60 / 60) %
            24) : Math.floor((leftTime / 1000 / 60 / 60) % 24);
        mm = Math.floor((leftTime / 1000 / 60) % 60) < 10 ? '0' + Math.floor((leftTime / 1000 / 60) % 60) : Math
            .floor((leftTime / 1000 / 60) % 60);
        ss = Math.floor((leftTime / 1000) % 60) < 10 ? '0' + Math.floor((leftTime / 1000) % 60) : Math.floor((
            leftTime / 1000) % 60);
        if (dd != 0) {
            djsTime = dd + "天 " + hh + ":" + mm + ":" + ss;
        } else {
            djsTime = hh + ":" + mm + ":" + ss;
        }
    } else if (leftTime <= 0) {
        if (rightTime > 0) { //进行中
            activityStatus = 2;
            speed = (1 - rightTime / (endTime - startTime)) * 100;
            dd = Math.floor(rightTime / 1000 / 60 / 60 / 24);
            hh = Math.floor((rightTime / 1000 / 60 / 60) % 24) < 10 ? '0' + Math.floor((rightTime / 1000 / 60 /
                60) % 24) : Math.floor((rightTime / 1000 / 60 / 60) % 24);
            mm = Math.floor((rightTime / 1000 / 60) % 60) < 10 ? '0' + Math.floor((rightTime / 1000 / 60) % 60) :
                Math.floor((rightTime / 1000 / 60) % 60);
            ss = Math.floor((rightTime / 1000) % 60) < 10 ? '0' + Math.floor((rightTime / 1000) % 60) : Math.floor((
                rightTime / 1000) % 60);
            if (dd != 0) {
                djsTime = dd + "天 " + hh + ":" + mm + ":" + ss;
            } else {
                djsTime = hh + ":" + mm + ":" + ss;
            }
        } else { //已结束
            speed = 100;
            djsTime = '已结束';
            activityStatus = 3;
        }
    }
    var item = {
        djsTime: djsTime, //距离当前时间差
        activityStatus: activityStatus, //活动状态 1：未开始 2：进行中 3：已结束
        speed: speed, //进度（单位%）
        dd: dd, //天
        hh: hh, //小时
        mm: mm, //分
        ss: ss, //秒
    }
    return item;
}

// 小程序获取定位权限判断
// isOpenSetting  默认false:不检验授权，true:检验授权后获取地址
function getMpLocation(successCallback, errCallback, isOpenSetting) {
    uni.getSetting({
        success: res => {
            if (res.authSetting['scope.userLocation'] || !isOpenSetting) {
                uni.getLocation({
                    // #ifndef MP-ALIPAY
                    type: 'gcj02',
                    // #endif
                    isHighAccuracy: true,
                    success(res) {
                        console.log('successCallback')
                        successCallback(res);
                    },
                    fail(err) {
                        console.log("位置信息错误", err);
                        errCallback("位置信息获取失败");
                    }
                });
            } else {
                errCallback("“位置信息”未授权");
                isOpenSetting && uni.showModal({
                    title: '提示',
                    content: '请先在设置页面打开“位置信息”使用权限',
                    confirmText: '去设置',
                    cancelText: '再逛会',
                    success: res => {
                        if (res.confirm) {
                            uni.openSetting();
                        }
                    }
                });
            }
        }
    });
}

// 获取地址信息
let locationAuthorize = true;
export const getAppLatLon = function (successCallback, errCallback, isOpenSetting) {
    // #ifdef MP
    // #ifndef MP-ALIPAY
    if (locationAuthorize && isOpenSetting) {
        uni.authorize({
            scope: 'scope.userLocation',
            success: () => {
                getMpLocation(successCallback, errCallback, isOpenSetting);
                locationAuthorize = false;
            },
            fail: (err) => {
                locationAuthorize = false;
            }
        });
    } else {
        getMpLocation(successCallback, errCallback, isOpenSetting);
    }
    // #endif
    // #ifdef MP-ALIPAY
    getMpLocation(successCallback, errCallback, false);
    // #endif
    // #endif
    // #ifdef H5
    uni.getLocation({
        type: 'gcj02',
        success(res) {
            console.log('successCallback')
            successCallback(res);
        },
        fail(err) {
            console.log("位置信息错误", err);
            errCallback("位置信息获取失败");
        }
    });
    // #endif
    // #ifdef APP-PLUS
    judgePermission("location", function (result) {
        if (result == 1) {
            uni.getLocation({
                type: 'gcj02',
                success: res => {
                    successCallback(res);
                },
                fail: (err) => {
                    console.log("位置信息错误", err);
                    errCallback("位置信息获取失败");
                }
            });
        }
    });
    // #endif
}
// 打开外链
export const openLink = function (href) {
    var that = this
    // #ifdef APP-PLUS
    plus.runtime.openURL(href)
    // #endif
    // #ifdef H5
    window.open(href)
    // #endif
    // #ifdef MP
    uni.setClipboardData({
        data: href,
        success: () => {
            uni.hideToast();
            that.$nextTick(() => {
                that.$u.toast('链接已复制，请在浏览器打开');
            })
        }
    });
    // #endif
}
// 保存图片
let settingWritePhotosAlbum = false;
let scopeAlbum = 'scope.writePhotosAlbum'
// #ifdef MP-TOUTIAO
scopeAlbum = 'scope.album'
// #endif
export const saveImg = function (url, callback) {
    if (url) {
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-MP-KUAISHOU
        if (settingWritePhotosAlbum) {
            uni.getSetting({
                success: res => {
                    if (res.authSetting[scopeAlbum]) {
                        uni.showLoading({
                            title: '正在下载'
                        });
                        uni.downloadFile({
                            url: url,
                            success: data => {
                                if (data.statusCode == 200) {
                                    uni.saveImageToPhotosAlbum({
                                        filePath: data.tempFilePath,
                                        success: () => {
                                            uni.hideLoading();
                                            callback && callback();
                                            uni.showToast({
                                                title: '保存成功'
                                            });
                                        },
                                        fail(e) {
                                            uni.hideLoading();
                                            tip({
                                                title: '下载失败，错误原因：' + e
                                                    .errMsg,
                                                icon: "none"
                                            });
                                        }
                                    });
                                } else {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '下载失败',
                                        icon: "none"
                                    });
                                }
                            },
                            fail(e) {
                                uni.hideLoading();
                                uni.showToast({
                                    title: '下载失败，错误原因：' + e.errMsg,
                                    icon: "none"
                                });
                            }
                        });
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: '请先在设置页面打开“保存相册”使用权限',
                            confirmText: '去设置',
                            cancelText: '算了',
                            success: data => {
                                if (data.confirm) {
                                    uni.openSetting();
                                }
                            }
                        });
                    }
                }
            });
        } else {
            settingWritePhotosAlbum = true;
            uni.authorize({
                scope: scopeAlbum,
                success: () => {
                    uni.showLoading({
                        title: '正在下载'
                    });
                    uni.downloadFile({
                        url: url,
                        success: data => {
                            if (data.statusCode == 200) {
                                uni.saveImageToPhotosAlbum({
                                    filePath: data.tempFilePath,
                                    success: () => {
                                        uni.hideLoading();
                                        callback && callback();
                                        uni.showToast({
                                            title: '保存成功'
                                        });
                                    },
                                    fail(e) {
                                        uni.hideLoading();
                                        tip({
                                            title: '下载失败，错误原因：' + e.errMsg,
                                            icon: "none"
                                        });
                                    }
                                });
                            } else {
                                uni.hideLoading();
                                uni.showToast({
                                    title: '下载失败',
                                    icon: "none"
                                });
                            }
                        },
                        fail(e) {
                            uni.hideLoading();
                            uni.showToast({
                                title: '下载失败，错误原因：' + e.errMsg,
                                icon: "none"
                            });
                        }
                    });
                }
            });
        }
        // #endif
        // #ifdef H5
        uni.showLoading({
            title: '正在下载'
        });
        uni.downloadFile({
            url: url,
            success: data => {
                uni.hideLoading();
                if (data.statusCode == 200) {
                    callback && callback();
                    window.open(data.tempFilePath);
                } else {
                    uni.showToast({
                        title: '下载失败',
                        icon: "none"
                    });
                }
            },
            fail(e) {
                uni.hideLoading();
                uni.showToast({
                    title: '下载失败，错误原因：' + e.errMsg,
                    icon: "none"
                });
            }
        });
        // #endif
        // #ifdef APP-PLUS || MP-ALIPAY
        uni.showLoading({
            title: '正在下载'
        });
        uni.saveImageToPhotosAlbum({
            filePath: url,
            success: () => {
                uni.hideLoading();
                callback && callback();
                uni.showToast({
                    title: '保存成功'
                });
            },
            fail(e) {
                uni.hideLoading();
                uni.showToast({
                    title: '下载失败，错误原因：' + e.errMsg,
                    icon: "none"
                });
            }
        });
        // #endif
    } else {
        uni.showToast({
            title: '未找到图片',
            icon: 'none'
        });
    }
};

function tip(data) {
    setTimeout(() => {
        uni.showToast(data);
    }, 500);
}

// 保存视频
export const saveVideo = function (url, callback) {
    if (url) {
        // #ifdef MP
        if (settingWritePhotosAlbum) {
            uni.getSetting({
                success: res => {
                    if (res.authSetting[scopeAlbum]) {
                        // #ifdef MP-WEIXIN
                        let urlArr = url.split("/");
                        let updateUrl = urlArr[urlArr.length - 1];
                        let filePath = wx.env.USER_DATA_PATH + '/' + (Math.random() * 100) + updateUrl;
                        // #endif
                        uni.showLoading({
                            title: '正在下载'
                        });
                        uni.downloadFile({
                            url: url,
                            // #ifdef MP-WEIXIN
                            filePath: filePath,
                            // #endif
                            success: data => {
                                if (data.statusCode == 200) {
                                    var tempFilePath = ''
                                    // #ifdef MP-WEIXIN
                                    tempFilePath = data.filePath
                                    // #endif
                                    // #ifndef MP-WEIXIN
                                    tempFilePath = data.tempFilePath
                                    // #endif
                                    uni.saveVideoToPhotosAlbum({
                                        filePath: tempFilePath,
                                        success: () => {
                                            uni.hideLoading();
                                            callback && callback();
                                            tip({
                                                title: '保存成功'
                                            });
                                        },
                                        fail(e) {
                                            uni.hideLoading();
                                            if (e.errMsg.indexOf('fail cancel') >=
                                                0) {
                                                tip({
                                                    title: '已取消',
                                                    icon: "none"
                                                });
                                            } else {
                                                console.log('下载失败，错误原因1：' + e
                                                    .errMsg)
                                                tip({
                                                    title: '下载失败，错误原因：' + e
                                                        .errMsg,
                                                    icon: "none"
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    uni.hideLoading();
                                    tip({
                                        title: '下载失败',
                                        icon: "none"
                                    });
                                }
                            },
                            fail(e) {
                                uni.hideLoading();
                                console.log('下载失败，错误原因2：' + e.errMsg)
                                tip({
                                    title: '下载失败，错误原因：' + e.errMsg,
                                    icon: "none"
                                });
                            }
                        });
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: '请先在设置页面打开“保存相册”使用权限',
                            confirmText: '去设置',
                            cancelText: '算了',
                            success: data => {
                                if (data.confirm) {
                                    uni.openSetting();
                                }
                            }
                        });
                    }
                }
            });
        } else {
            settingWritePhotosAlbum = true;
            uni.authorize({
                scope: scopeAlbum,
                success: () => {
                    // #ifdef MP-WEIXIN
                    let urlArr = url.split("/");
                    let updateUrl = urlArr[urlArr.length - 1];
                    let filePath = wx.env.USER_DATA_PATH + '/' + updateUrl;
                    // #endif
                    uni.showLoading({
                        title: '正在下载'
                    });
                    uni.downloadFile({
                        url: url,
                        // #ifdef MP-WEIXIN
                        filePath: filePath,
                        // #endif
                        success: data => {
                            if (data.statusCode == 200) {
                                var tempFilePath = ''
                                // #ifdef MP-WEIXIN
                                tempFilePath = data.filePath
                                // #endif
                                // #ifndef MP-WEIXIN
                                tempFilePath = data.tempFilePath
                                // #endif
                                uni.saveVideoToPhotosAlbum({
                                    filePath: tempFilePath,
                                    success: () => {
                                        uni.hideLoading();
                                        callback && callback();
                                        tip({
                                            title: '保存成功'
                                        });
                                    },
                                    fail(e) {
                                        uni.hideLoading();
                                        if (e.errMsg.indexOf('fail cancel') >= 0) {
                                            tip({
                                                title: '已取消',
                                                icon: "none"
                                            });
                                        } else {
                                            tip({
                                                title: '下载失败，错误原因：' + e
                                                    .errMsg,
                                                icon: "none"
                                            });
                                        }
                                    }
                                });
                            } else {
                                uni.hideLoading();
                                tip({
                                    title: '下载失败，错误原因：' + data.errMsg,
                                    icon: "none"
                                });
                            }
                        },
                        fail(e) {
                            uni.hideLoading();
                            tip({
                                title: '下载失败，错误原因：' + e.errMsg,
                                icon: "none"
                            });
                        }
                    });
                }
            });
        }
        // #endif
        // #ifdef H5
        uni.showLoading({
            title: '正在下载'
        });
        uni.downloadFile({
            url: url,
            success: data => {
                uni.hideLoading();
                if (data.statusCode == 200) {
                    callback && callback();
                    window.open(data.tempFilePath);
                } else {
                    tip({
                        title: '下载失败',
                        icon: "none"
                    });
                }
            },
            fail(e) {
                uni.hideLoading();
                tip({
                    title: '下载失败，错误原因：' + e.errMsg,
                    icon: "none"
                });
            }
        });
        // #endif
        // #ifdef APP-PLUS
        uni.showLoading({
            title: '正在下载'
        });
        uni.saveVideoToPhotosAlbum({
            filePath: url,
            success: () => {
                uni.hideLoading();
                callback && callback();
                tip({
                    title: '保存成功'
                });
            },
            fail(e) {
                uni.hideLoading();
                tip({
                    title: '下载失败，错误原因：' + e.errMsg,
                    icon: "none"
                });
            }
        });
        // #endif
    } else {
        tip({
            title: '未找到视频',
            icon: 'none'
        });
    }
};

// 金额逗号前后分离
export const sepAmounts = function (value, type) {
    value = value.toString();
    if (type == 1) {
        return value.split('.')[1];
    } else {
        return value.split('.')[0];
    }
}

export const Jsonp = function (url, callback, callbackname) {
    // #ifdef H5
    window[callbackname] = callback;
    let tuiScript = document.createElement("script");
    tuiScript.src = url;
    tuiScript.type = "text/javascript";
    document.head.appendChild(tuiScript);
    document.head.removeChild(tuiScript);
    // #endif
}

// 得到当前日期时间后的23小时的时间段
export const getTimeRange = function (startDate) {
    const endDate = new Date(startDate.getTime() + 23 * 60 * 60 * 1000); // 从startDate开始的23小时后
    const result = [];
    for (let dt = new Date(startDate.getTime()); dt <= endDate; dt.setHours(dt.getHours() + 1)) {
        const formattedDate = uni.$u.timeFormat(dt, 'yyyy-mm-dd hh:MM:ss');
        // 精确判断跨天且小时为0的情况
        const isNextDay = dt.getHours() === 0 && dt.getDate() > startDate.getDate();
        result.push({
            date: formattedDate,
            isNextDay: isNextDay,
            occupied: false
        });
    }
    return result;
}

export const updateRoomTimeline = function (roomTimeline, occupyList) {
    for (var j = 0; j < occupyList.length; j++) {
        var occupiedBeginTime = new Date(parseDateTime(occupyList[j].beginTime));
        var occupiedEndTime = new Date(parseDateTime(occupyList[j].endTime));

        // 调整开始和结束时间，只保留日期和小时
        occupiedBeginTime.setMinutes(0);
        occupiedBeginTime.setSeconds(0);
        occupiedEndTime.setMinutes(0);
        occupiedEndTime.setSeconds(0);

        for (var i = 0; i < roomTimeline.length; i++) {
            var checkTime = new Date(parseDateTime(roomTimeline[i].date));
            checkTime.setMinutes(0);
            checkTime.setSeconds(0);

            if (checkTime >= occupiedBeginTime && checkTime <= occupiedEndTime) {
                roomTimeline[i].occupied = true;
            }
        }
    }

    // occupyList.forEach(item => {
    // 	const startDate = new Date(item.beginTime);
    // 	const endDate = new Date(item.endTime);

    // 	for (let i = 0; i < roomTimeline.length; i++) {
    // 		const entryDate = new Date(roomTimeline[i].date);

    // 		console.log("getFullYear",entryDate.getFullYear() === startDate.getFullYear())
    // 		console.log("getMonth",entryDate.getMonth() === startDate.getMonth())
    // 		console.log("getDate",entryDate.getDate() === startDate.getDate())
    // 		console.log("getHours",entryDate.getHours() === startDate.getHours())

    // 		// 只比较日期和小时
    // 		if (entryDate.getFullYear() === startDate.getFullYear() &&
    // 			entryDate.getMonth() === startDate.getMonth() &&
    // 			entryDate.getDate() === startDate.getDate() &&
    // 			entryDate.getHours() >= startDate.getHours()) {
    // 			if (entryDate.getFullYear() === endDate.getFullYear() &&
    // 				entryDate.getMonth() === endDate.getMonth() &&
    // 				entryDate.getDate() === endDate.getDate() &&
    // 				entryDate.getHours() <= endDate.getHours()) {
    // 				roomTimeline[i].occupied = true;
    // 			}
    // 		}
    // 	}
    // });
    // for (const timelineEntry of roomTimeline) {
    // 	const entryTime = new Date(timelineEntry.date);

    // 	for (const occupy of occupyList) {
    // 		const beginTime = new Date(occupy.beginTime);
    // 		const endTime = new Date(occupy.endTime);

    // 		if (entryTime >= beginTime && entryTime <= endTime) {
    // 			timelineEntry.occupied = true;
    // 			break; // Once found, no need to continue searching
    // 		}
    // 	}
    // }
    // for (const timelineEntry of roomTimeline) {
    // 	const entryTime = parseDateTime(timelineEntry.date);

    // 	for (const occupy of occupyList) {
    // 		const beginTime = parseDateTime(occupy.beginTime);
    // 		const endTime = parseDateTime(occupy.endTime);

    // 		if (entryTime.getFullYear() === beginTime.getFullYear() &&
    // 			entryTime.getMonth() === beginTime.getMonth() &&
    // 			entryTime.getDate() === beginTime.getDate() &&
    // 			entryTime.getHours() >= beginTime.getHours() &&
    // 			entryTime.getHours() <= endTime.getHours()) {
    // 			timelineEntry.occupied = true;
    // 			break;
    // 		}
    // 	}
    // }

    return roomTimeline;
}

// 时间日期格式化
export const parseDateTime = function (dateTimeStr) {
    return new Date(dateTimeStr.replace(/-/g, '/'));
}

export const isTimeOverlapTime = function (range1Start, range1End, range2Start, range2End) {
    return range1Start <= range2End && range2Start <= range1End;
}

// 得到指定日期的后几天日期
export const getNextNDaysDates = function (days = 5, initialDate = new Date()) {
    var datesWithWeekdays = [];

    for (var i = 0; i < days; i++) {
        var currentDate = new Date(initialDate);
        currentDate.setDate(currentDate.getDate() + i);

        var formattedDate = uni.$u.timeFormat(currentDate, 'yyy-mm-dd hh:MM:ss');

        if (currentDate.toDateString() !== new Date().toDateString()) {
            formattedDate = uni.$u.timeFormat(currentDate, 'yyy-mm-dd');
            formattedDate = formattedDate + " 00:00:00";
        }

        let weekday = currentDate.getDay();
        let weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

        if (currentDate.toDateString() === new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()) {
            weekday = '明天';
        } else if (currentDate.toDateString() === new Date().toDateString()) {
            weekday = '今天';
        } else {
            weekday = weekArray[weekday];
        }

        datesWithWeekdays.push({
            date: formattedDate,
            weekday: weekday
        });
    }

    return datesWithWeekdays;
}

// 得到指定日期时间后几个小时的日期时间
export const getHoursAfter = function (date, hours) {
    var futureDate = date instanceof Date ? date : new Date(parseDateTime(date));
    futureDate.setHours(futureDate.getHours() + hours);
    return futureDate;
}

// 修改日期不更改时分秒
export const setSameYearMonthDay = function (dateToChange, referenceDate) {
    var newDate = new Date(dateToChange);
    var referenceYear = referenceDate.getFullYear();
    var referenceMonth = referenceDate.getMonth();
    var referenceDay = referenceDate.getDate();

    newDate.setFullYear(referenceYear);
    newDate.setMonth(referenceMonth);
    newDate.setDate(referenceDay);

    return uni.$u.timeFormat(newDate, 'yyyy-mm-dd hh:MM:ss');
}

/**
 * 计算两个日期之间的天数差
 * @param date1
 * @param date2
 * @returns {number}
 */
export const daysBetweenDates = function (date1, date2) {
    // 将日期字符串转换为 Date 对象
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // 计算两个日期之间的毫秒数差异
    const millisecondsBetween = Math.abs(d2 - d1);

    // 将毫秒数转换为天数
    const daysBetween = millisecondsBetween / (1000 * 60 * 60 * 24);

    // 返回结果
    return Math.floor(daysBetween);
}
// 格式化时间
export const dateFormat = function (fmt = 'YYYY-MM-DD', date = new Date()) {
    const time = new Date(date)
    const weekArr = ['日', '一', '二', '三', '四', '五', '六']
    var o = {
        'M+': time.getMonth() + 1, //月份
        'D+': time.getDate(), //日
        'h+': time.getHours(), //小时
        'm+': time.getMinutes(), //分
        's+': time.getSeconds(), //秒
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度
        S: time.getMilliseconds(), //毫秒
        W: time.getDay(), //星期
    }
    if (/(Y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1 == 'W' ?
                    weekArr[o[k]] :
                    RegExp.$1.length == 1 ?
                        o[k] :
                        ('00' + o[k]).substr(('' + o[k]).length)
            )
    return fmt
}

/**
 * 从完整URL字符串中提取路径和查询参数部分，并实现页面跳转
 * @param {string} urlStr - 完整的URL字符串
 */
export const extractAndRedirect = function (urlStr) {
    // 1. 校验输入
    if (!urlStr || typeof urlStr !== 'string') {
        console.error('extractAndRedirect: Invalid URL input');
        uni.showToast({
            title: 'URL无效',
            icon: 'none'
        });
        return;
    }

    try {
        // 2. 解析 URL (兼容 App 和小程序环境，不使用 new URL)
        let pathWithQuery = urlStr;

        // 如果是完整 URL (包含协议)，去除协议和域名
        const protocolIndex = urlStr.indexOf('://');
        if (protocolIndex !== -1) {
            // 从 "://" 后面的位置开始找第一个 "/"
            const pathStartIndex = urlStr.indexOf('/', protocolIndex + 3);
            if (pathStartIndex !== -1) {
                pathWithQuery = urlStr.substring(pathStartIndex);
            } else {
                // 只有域名的情况，默认为根路径
                pathWithQuery = '/';
            }
        }

        // 分离 pathname 和 search
        const queryIndex = pathWithQuery.indexOf('?');
        let pathname = '';
        let search = '';

        if (queryIndex !== -1) {
            pathname = pathWithQuery.substring(0, queryIndex);
            search = pathWithQuery.substring(queryIndex);
        } else {
            pathname = pathWithQuery;
            search = '';
        }

        // 3. 组合跳转路径
        const targetUrl = pathname + search;
        console.log('Extract path:', pathname, 'search:', search, 'Target:', targetUrl);
console.log(2222244)
console.log(targetUrl)
        // 4. 跳转实现
        uni.redirectTo({
            url: targetUrl,
            success: () => {
                console.log('Jump success');
            },
            fail: (err) => {
                console.warn('navigateTo failed, trying switchTab:', err);
                uni.navigateBack();

            }
        });

    } catch (error) {
        // 5. 异常捕获
        console.error('URL parsing error:', error);
        uni.showToast({
            title: 'URL解析异常',
            icon: 'none'
        });
    }
}

export const hasConflict = function (startTimeStr, endTimeStr, roomData) {
    let start = new Date(parseDateTime(startTimeStr));
    let end = new Date(parseDateTime(endTimeStr));

    for (let i = 0; i < roomData.length; i++) {
        let roomStart = new Date(parseDateTime(manipulateTime(roomData[i].beginTime, {minutes: 29, isAdd: false})));

        let roomEnd = new Date(parseDateTime(manipulateTime(roomData[i].endTime, {minutes: 29})));
        // 如果开始时间在房间开始时间之后并且结束时间在房间结束时间之前，存在冲突
        if (end >= roomStart && roomEnd >= start) {
            console.log(
                `时间范围 [${startTimeStr}, ${endTimeStr}] 与房间 [${roomData[i].beginTime}, ${roomData[i].endTime}] 存在冲突。`
            );
            return true;
        }
    }

    console.log("没有时间冲突。");
    return false;
}

export const calculateHourDifference = function (dateStr1, dateStr2) {
    // 分割日期字符串
    const [datePart1, timePart1] = dateStr1.split(' ');
    const [datePart2, timePart2] = dateStr2.split(' ');

    // 分割时间字符串
    const [hours1, minutes1, seconds1] = timePart1.split(':').map(Number);
    const [hours2, minutes2, seconds2] = timePart2.split(':').map(Number);

    // 创建Date对象
    const date1 = new Date(`${datePart1.replace(/-/g, '/')} ${hours1}:${minutes1}:${seconds1}`);
    const date2 = new Date(`${datePart2.replace(/-/g, '/')} ${hours2}:${minutes2}:${seconds2}`);

    // 计算毫秒差
    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    // 转换为小时
    const hoursDifference = diffInMilliseconds / (1000 * 60 * 60);

    return Math.floor(hoursDifference);
}

export const calculateMinuteDifference = function (dateStr1, dateStr2) {
    // 分割日期字符串
    const [datePart1, timePart1] = dateStr1.split(' ');
    const [datePart2, timePart2] = dateStr2.split(' ');

    // 分割时间字符串
    const [hours1, minutes1, seconds1] = timePart1.split(':').map(Number);
    const [hours2, minutes2, seconds2] = timePart2.split(':').map(Number);

    // 创建Date对象
    const date1 = new Date(`${datePart1.replace(/-/g, '/')} ${hours1}:${minutes1}:${seconds1}`);
    const date2 = new Date(`${datePart2.replace(/-/g, '/')} ${hours2}:${minutes2}:${seconds2}`);

    // 计算毫秒差
    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    // 转换为小时
    const hoursDifference = diffInMilliseconds / (1000 * 60);

    return Math.floor(hoursDifference);
}

/**
 * 时间加减方法，兼容苹果设备
 * @param dateStr 传入的时间字符串
 * @param hours 加减的小时数
 * @param minutes 加减的分钟数
 * @param isAdd 是否加
 * @returns {`${number}-${string}-${string} ${string}:${string}:${string}`}
 */
export const manipulateTime = (dateStr, {hours = 0, minutes = 0, isAdd = true}) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [hoursToAdd, minutesToAdd] = isAdd ? [hours, minutes] : [-hours, -minutes];
    const [hoursCurrent, minutesCurrent, seconds] = timePart.split(':').map(Number);

    const date = new Date(`${datePart.replace(/-/g, '/')} ${hoursCurrent}:${minutesCurrent}:${seconds}`);
    date.setHours(date.getHours() + hoursToAdd);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}


/**
 * 两个数字相加
 */
export const floatAdd = (arg1, arg2) => {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 * 数字相减
 */
export const floatSub = (arg1, arg2) => {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 数字相乘
 */
export const floatMul = (arg1, arg2) => {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 数字相除
 */
export const floatDiv = (arg1, arg2) => {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }

    r1 = Number(arg1.toString().replace(".", ""));

    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

export const htmlUnEscape = (str) => {
    if (!str) {
        return "";
    }
    return str.replace(/&lt;|&gt;|&quot;|&amp;/g, (match) => {
        switch (match) {
            case '&lt;':
                return '<'
            case '&gt;':
                return '>'
            case '&quot;':
                return '"'
            case '&amp;':
                return '&'
        }
    })
}

export const isTimeRangeDisabled = (begin, end, disabledBegin, disabledEnd) => {
    // 将时间字符串转换为Date对象
    const beginTime = new Date(begin);
    const endTime = new Date(end);
    const disabledBeginTime = new Date(disabledBegin);
    const disabledEndTime = new Date(disabledEnd);

    // 判断begin和end是否在disabledBegin和disabledEnd之间
    return (beginTime >= disabledBeginTime && beginTime <= disabledEndTime) ||
        (endTime >= disabledBeginTime && endTime <= disabledEndTime) ||
        (beginTime <= disabledBeginTime && endTime >= disabledEndTime);
}

export const getOS = () => {
    // 获取浏览器的用户代理字符串，转小写方便统一匹配
    const userAgent = navigator.userAgent.toLowerCase();

    // 1. 判断iOS系统（iPhone/iPad/iPod）
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
    }
    // 2. 判断Android系统
    else if (/android/.test(userAgent)) {
        return 'android';
    }
    // 3. 新增：判断Windows系统（匹配userAgent中的windows关键词）
    else if (/windows/.test(userAgent)) {
        return 'windows';
    }
    // 4. 其他系统（鸿蒙、Linux、macOS、Unix等）
    else {
        return 'other';
    }
}


