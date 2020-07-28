import wepy from 'wepy'
import 'wepy-async-function'
import '@/mixins/tool/baseApi.js'
// 全局登录sessionkey
export const sessionkey_api=async (params)=>{
    return await wepy.post('/session/getsessionkey', params)
}

// 首页积分商城列表获取
export const pointsShopList_api=async (params)=>{
    return await wepy.post('/wx/wxsa/score/getscoregoods', params)
}
// 首页积分商城详情数据
export const pointsShopDetail_api=async (params)=>{
    return await wepy.post('/wx/wxsa/score/getgooddetail', params)
}
// 首页积分商城详情兑换积分商品获取订单信息
export const pointsorder_api=async (params)=>{
    return await wepy.post('/wx/wxsa/score/getorderskuinfo', params)
}
// 首页积分商城详情兑换积分商品--立即兑换
export const pointsShopPay_api=async (params)=>{
    return await wepy.post('/wx/wxsa/score/toinsertOrder', params)
}
// 收货地址列表获取
export const getAddressList_api=async (params)=>{
    return await wepy.post('/wx/wxsa/userAddr/manager', params)
}
// 点击单选框修改默认
export const alterAddressCheck_api=async (params)=>{
    return await wepy.post('/wx/wxsa/userAddr/updateatype', params)
}
// 点击添加收货地址
export const addAddress_api=async (params)=>{
    return await wepy.post('/wx/wxsa/userAddr/add', params)
}
// 点击删除收货地址
export const deleteAddress_api=async (id)=>{
    return await wepy.get('/wx/wxsa/userAddr/delete/'+id)
}
// 点击编辑保存收货地址
export const saveAddress_api=async (params)=>{
    return await wepy.post('/wx/wxsa/userAddr/update', params)
}
// 限时抢购列表
export const seckillList_api=async (params)=>{
    return await wepy.post('/wx/wxsa/seckilld/getseckilldlist', params)
}
