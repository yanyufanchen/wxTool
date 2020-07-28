import wepy from 'wepy';
import {updateTimeShow} from '../pageA_tool/wxchattime'
import {
  chatMesApi,
  chatsendApi,
  chatPastRecordApi,
  chatreadApi
} from '@/mixins/tool/request.js'
let TimeSetInt = null
// webSocket对象
var SocketTask
// url地址
var url
// websocket开启状态
var socketOpen=false

export default class Home extends wepy.mixin {
  data = {
    openid: '',
    uid: '',
    sid: '',
    // 聊天室基本信息
    chatMessage: null,
    chatList: [],
    inputValue: '',
    imgPathList: [],
    // 语音发送按钮
    recordbtn: false,
    // 语音对话框
    showrecordbox: false,
    // 上划取消对话框
    offrecordbox: false,
    // 是否推送当前语音消息
    recordflag: true,
    // 此段语音缓存地址
    recordPath: '',
    // 此段语音的时间
    recordTime: 0
  }
  onShow() {
  }
  onHide(){
    console.log('页面隐藏')
    // SocketTask.close({

    // })
  }
  onUnload(){
    // 页面销毁时关闭连接
    console.log('页面销毁')
    SocketTask.close()
  }
  onReady() {}
  async onLoad(options) {
    console.log(options)
    this.uid = options.uid
    this.sid = this.$parent.globalData.eid
    // this.sid = this.$parent.globalData.storeMes.sid
    this.openid=this.$parent.globalData.openid
    this.$apply()
    const res = await this.getMessage()
    console.log(res, '基本数据')
    if(res.statu===0){
      wepy.Toast(res.mes)
      return
    }
    this.chatMessage = res.data
    this.$apply()
    console.log('开始聊天')
    //载入时先查询一遍聊天记录
	  const newres=await this.getNews({
      fromman: this.chatMessage.list2.usOpenid,
      toman: this.chatMessage.dm.uid
    })
    if(newres.statu===0) return wepy.Toast('查询失败')
    if(newres.statu===1) return wepy.Toast('无聊天记录','none')
    this.chatList=newres.data
    this.$apply()
    this.filterTime()
    // 滚动到底部
    this.pageScrollTo()
    
    const openres=await this.openSocket()
    console.log(openres,'初次开启成功回调')
    
    // this.pageScrollTo()
  }

  onPullDownRefresh() {}
  // 获取聊天室基本数据
  async getMessage() {
    let params = {
      // eid: "LS000000",
      eid: this.$parent.globalData.eid,
      // wxid: "oYWyHt_QM2JNy8fbK6MxjJiSJSIo",
      // wxid: "oYWyHt8ILsBpt5pKJLH7znqns7GY",
      wxid: this.$parent.globalData.openid,
      uid: this.uid,
      // uid: 'U20180928452912100',
      sid: this.sid
      // sid: 'e20171229481312100'
    }
    const {
      data: res
    } = await chatMesApi(params)
    if (!res.statu) return {
      mes: '连接失败',
      statu: 0
    }
    return {
      mes: res.mes,
      statu: 1,
      data: res.t
    }
  }
  // 开启websocket
  openSocket() {
    let openres=null
    // 临时的
    // let wxid="oYWyHt_QM2JNy8fbK6MxjJiSJSIo",
    // let wxid="oYWyHt8ILsBpt5pKJLH7znqns7GY"
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    // url = 'ws://192.168.10.104:9098/websocket/ws/webSocketServer?token=ADVICE'+wxid;
    url = 'wss://eapp.ligesoft.com/wss/ws/webSocketServer?token='+this.openid
    SocketTask= wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success(res) {
        console.log('WebSocket连接创建', res)
        openres={
          statu: true,
          mes: '连接成功'
        }
      },
      fail: function(err) {
        wepy.Toast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
    // console.log(openres,'连接成功的返回值')
    // 监听webSocket
    this.initSocket()
    return openres
  }

  // socket监听事件
  initSocket(){
    let that=this
    console.log('开始监听',SocketTask)
    SocketTask.onOpen(res=>{
      // 开启
      socketOpen=true
      // 计时
      console.log('监听 WebSocket 连接打开事件。', res)
      // 防止掉线
      setInterval(()=>{
        console.log("发送心跳",SocketTask.readyState == SocketTask.OPEN);
        if (socketOpen&&SocketTask.readyState == SocketTask.OPEN) {
          SocketTask.send("ligesoft-monitor")
          
          } else {
            //掉线自动刷新
            console.log('掉线了----------------------')
            that.openSocket()
          } 
      }, 20000);
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      // SocketTask = false;
      socketOpen = false;
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
    })
    SocketTask.onMessage(onMessage => {
      var onMessage_data = JSON.parse(onMessage.data)
      console.log(onMessage_data,'接收聊天消息')
      // 收到消息后添加到页面上
      this.chatList.push(onMessage_data)
      this.$apply()
      // 滚动到底部
      this.pageScrollTo()
      if (onMessage_data.minipTitle) {
        wx.setTopBarText({ 
          text: onMessage_data.minipTitle,
        })
      }
      // 将收到的消息改为已读
      this.readchat()
    })
  }
  // 修改已读
  async readchat(){
    let params={
      newscontent: onMessage_data.minipTitle,
      fromman: onMessage_data.fromman,
      toman: onMessage_data.toman,
      createtime: onMessage_data.createtime,
      ntype: onMessage_data.ntype,
      nttype: onMessage_data.nttype,
      nstatu: 'Y',
    }
    const {data:res}=await chatreadApi(params)
    console.log(res,'修改已读结果');
    
  }
  //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
  async sendSocketMessage(data){
    let params={
      // token: "oYWyHt_QM2JNy8fbK6MxjJiSJSIo",
      token: this.openid,
      toman: data.toman, // 接收人
      fromman: data.fromman, // 接收人
      newscontent: data.newscontent, // 聊天内容
      createtime: new Date(), // 发送时间
      nttype: data.nttype,  // 聊天对象类型
      ntype: data.ntype,  // 聊天内容类型
      nstatu: 'N',  // 是否已读 N--未读
    }
    let chatflag=false
    const {data: sendres}=await chatsendApi(params)
      console.log(sendres,'发送给服务器信息')
      if(!sendres.statu) return wepy.Toast('发送失败')
      // 添加到前端页面
      this.chatList.push(params)
      this.$apply()
      // // 格式化时间处理
      this.filterTime()
      // 滚动到底部
      this.pageScrollTo()
      chatflag=true
    // params.id=sendres.t // 聊天消息id
    if(socketOpen&&chatflag&&SocketTask.readyState == SocketTask.OPEN){
      console.log('发送send')
      SocketTask.send(JSON.stringify(params))
    }else {
      const openres=await this.openSocket()
      console.log(openres,'重新打开成功的回调')
      console.log('重新打开')
      console.log('发送send')
      SocketTask.send(JSON.stringify(params))
    }
  }
  // 格式化时间处理
  filterTime(){
    this.chatList.forEach(item=>{
      item.wxchattime=updateTimeShow(item.createtime)
    })
    this.$apply()
  }
  // --------------------------------------
  // 计时器
  setInt() {
    TimeSetInt = setInterval(() => {
      // console.log(this);
      this.recordTime++
      this.$apply()
    }, 1000)
  }


  // 获取录音
  async record() {
    // 计时
    this.setInt()
    // 发语音
    const StartRecordres = await this.$parent.getStartRecord()
    console.log(StartRecordres, this.recordflag, '授权语音')
    // 拒绝了授权语音
    if (!StartRecordres.statu) {
      this.recordbtn = false
      this.$apply()
      return
    }
    console.log(this.recordTime, '计时')
    // 赋值初始化
    let timeItem = this.recordTime
    this.recordTime = 0
    this.$apply()
    if (!this.recordflag) return
    // 保存缓存语音
    this.recordPath = StartRecordres.path
    // 如果时间为0，就不推送
    if (timeItem <= 0) return
    // 推送到聊天窗口
    // 将聊天内容推送到数组中
    let chatItem = {
      statuId: 2,
      username: '飞鱼sds',
      text: '',
      recordPath: this.recordPath,
      time: timeItem
    }
    this.chatList.push(chatItem)
    this.$apply()
    // 滚动到底部
    this.pageScrollTo()


  }

  pageScrollTo() {
    // 获取容器高度，使页面滚动到容器底部
    wx.createSelectorQuery().select('#chatA').boundingClientRect(function (rect) {
      console.log(rect,'高度');

      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  }
  // 获取聊天记录
  async getNews(data) {
    let params={
      fromman: data.fromman,
      toman: data.toman
    }
    const {data: newres }=await chatPastRecordApi(params)
    console.log(newres,'获取的历史记录')
    if(!newres.mes) return {
      statu: 0,
      mes: '查询失败'
    }
    if(newres.statu==false) return {
      statu: 1,
      mes: '无聊天记录'
    }
    return {
      statu: 2,
      mes: '连接成功',
      data: newres.t.list
    }
  }
  methods = {
    inputChange(e) {
      console.log(e.detail.value);
      this.inputValue = e.detail.value
    },
    // 确定发送文字消息
    inputChat(e) {
      console.log('确定');
      let that=this
      if(e.detail.value==='') return
      let chattext = e.detail.value
      this.inputValue = ''
      
      let data={
        toman: this.chatMessage.dm.uid, // 接收人
        fromman: this.chatMessage.list2.usOpenid, // 发送人
        newscontent: chattext, // 聊天内容
        nttype: 'openid',  // 聊天对象类型
        ntype: 2,  // 聊天内容类型
      }
      // 发送消息
      this.sendSocketMessage(data)
    },
    // 前往订单
    push_order() {
      wx.navigateTo({
        url: '/packageB/pages/order?otype=otype0'
      })
      // 将聊天内容推送到数组中
      // let chatItem = {
      //   statuId: 3,
      //   type: 'order'
      //   // username: '飞鱼sds',
      //   // text: chattext
      // }
      // this.chatList.push(chatItem)
      // // 滚动到底部
      // this.pageScrollTo()
    },
    // 前往优惠券
    push_coupon() {
      wx.navigateTo({
        url: '/packageB/pages/coupon'
      })
      // console.log('请求优惠券');
      // // 将聊天内容推送到数组中
      // let chatItem = {
      //   statuId: 3,
      //   type: 'coupon'
      //   // username: '飞鱼sds',
      //   // text: chattext
      // }
      // this.chatList.push(chatItem)
      // // 滚动到底部
      // this.pageScrollTo()
    },
    //  查看相册
    async chooseimage() {
      const res = await wepy.chooseImage({
        count: 6,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      }).catch(err => err)
      console.log(res, '查看相册');
      if (res.errMsg !== "chooseImage:ok") {
        console.log('取消了查看相册');
        return
      }
      // 用户所选相册的地址列表
      res.tempFilePaths.forEach((item, index) => {
        // 将聊天内容推送到数组中
        let data={
          toman: this.chatMessage.dm.uid, // 接收人
          fromman: this.chatMessage.list2.usOpenid, // 发送人
          newscontent: item, // 聊天内容
          nttype: 'openid',  // 聊天对象类型
          ntype: 1,  // 聊天内容类型
        }
        this.$apply()
        // 发送给服务器
        this.sendSocketMessage(data)
      })

    },
    // 显示大图
    showMaxImg(item) {
      // console.log(item, '显示大图')
      wx.previewImage({
        current: item.newscontent, // 当前显示图片的http链接
        urls: [item.newscontent]
      })
    },
    // 切换语音
    async trigerbtn() {
      wepy.Toast('待开发')
      // 收回语音按钮不需要执行授权判断
      if (this.recordbtn) {
        this.recordbtn = !this.recordbtn
        this.$apply()
        return
      }

      const Settingres = await this.$parent.getSettingStatus('scope.record')
      console.log(Settingres)
      // Settingres.statu===1 第一次使用可以授权调用
      if (Settingres.statu === 1) {
        this.recordbtn = !this.recordbtn
        this.$apply()
        return
      }
      // 拒绝过授权
      if (Settingres.statu === 2) {
        console.log(Settingres.mes, '手动设置授权')
        const openSettingres = await this.$parent.openSetting('scope.record')
        console.log(openSettingres, '手动设置语音权限')
        return
      }
      // 已授权
      this.recordbtn = !this.recordbtn
      this.$apply()
    },
    // 按住发语音
    Startrecord() {
      console.log('按住发语音')
      this.showrecordbox = true
      // 获取录音
      this.record()
    },
    // 手指触摸动作被打断，如来电提醒，弹窗
    Touchcancel() {
      console.log('打断了,关掉对话框');
      this.showrecordbox = false
      this.recordbtn = false
    },
    // 上划了取消发语音-------性能待优化（高频率触发该时间会出现延迟）
    Moverecord(e) {
      // 获取屏幕高度，移动距离超出底部栏就取消语音
      const res = wx.getSystemInfoSync()
      let height = res.windowHeight
      console.log(height, e.changedTouches[0].pageY, '上划了')

      if (e.changedTouches[0].pageY > height - 100) {
        console.log('距离过小不取消');
        return
      }
      this.showrecordbox = false
      this.offrecordbox = true
    },
    // 离开了发语音
    Stoprecord() {
      console.log('停止并发语音')
      // 判断是否保留语音
      if (this.offrecordbox) {
        console.log('取消过该段语音')
        this.recordflag = false
      } else {
        console.log('没有取消该段语音')
        this.recordflag = true
      }
      this.showrecordbox = false
      this.offrecordbox = false
      this.$apply()
      // 结束录音
      wx.stopRecord()
      // 停止定时器
      clearInterval(TimeSetInt)
    },
    // 播放语音
    playRecord(path) {
      console.log(path);
      wx.playVoice({
        filePath: path,
        complete() {}
      })
    }




  }
  computed = {

  }
}
