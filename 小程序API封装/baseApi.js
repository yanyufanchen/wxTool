// 微信的api封装
import wepy from 'wepy'

// -----------------------------------------------加载弹框-------------------------------------------------
// 可扩展版 icon:success/loading/none
wepy.Toast = (str = '加载中',state='loading') => {
    wepy.showToast({
        title: str,
        icon: state,
        duration: 1500
    })
}
// 后台请求数据失败的提示
wepy.baseToast = (str = '加载成功') => {
    wepy.showToast({
        title: str,
        icon: 'success',
        duration: 1500
    })
}

// -----------------------------------------------http请求-------------------------------------------------
// 请求根路径
// get
// const baseURL = 'https://m.ligesoft.com/wx/wxsa'
const baseURL = 'http://t.ligesoft.com/wx/wxsa'
// const baseURL = 'http://192.168.10.129:9091/wx/wxsa'
wepy.get = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'GET',
        data
    })
}
// post
wepy.post = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
            'auth': "ligesofts"
          }
    })
}

// 模拟数据
const mockURL = 'https://www.easy-mock.com/mock/5d9bf7713950512b2d158d7f/lama'
wepy.mockget = (url, data = {}) => {
    return wepy.request({
        url: mockURL + url, 
        method: 'GET',
        data,
        header: {
            'content-type': 'application/json' // 默认值
          }
    })
}
// post
wepy.mockpost = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json' // 默认值
          }
    })
}


// test
const testURL = 'https://itjustfun.cn/api/public/v1'
// const testURL = 'https://www.zhengzhicheng.cn/api/public/v1'
// const testURL = 'https://www.easy-mock.com/mock/5d9bf7713950512b2d158d7f/lama'
wepy.gettest = (url, data = {}) => {
    return wepy.request({
        url: testURL+url,
        method: 'GET',
        data
    })
}
wepy.posttest = (url, data = {}) => {
    return wepy.request({
        url: testURL+url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
          }
    })
}