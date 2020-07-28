import WxRequest from '../../assets/plugins/wx-request/lib/index'

const App = getApp()

Page({
    data: {
        component: App.components[0],
    },
    onLoad() {
        this.WxRequest = new WxRequest({
            baseURL: 'https://api.github.com/',
        })
        console.log(this.WxRequest)
        this.interceptors()
        this.getRepos()
    },
    interceptors() {
        this
            .WxRequest
            .interceptors.use({
                // 请求数据
                request(request) {
                    wx.showLoading({
                        title: '加载中...',
                    })
                    return request
                },
                // 请求失败
                requestError(requestError) {
                    wx.hideLoading()
                    return Promise.reject(requestError)
                },
                // 响应数据
                response(response) {
                    wx.hideLoading()
                    return response
                },
                // 响应失败
                responseError(responseError) {
                    wx.hideLoading()
                    return Promise.reject(responseError)
                },
            })
    },
    // 获取列表数据
    getRepos() {
        this
            .WxRequest
            .getRequest('/users/skyvow/repos')
            .then(res => {
                console.log(res)
                this.setData({
                    items: res.data.sort((a, b) => b.stargazers_count - a.stargazers_count),
                })
            })
    },
})