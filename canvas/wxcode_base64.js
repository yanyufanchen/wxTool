import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
import QR from "@/mixins/tool/wxqrcode.js"
// 条形码采用wx自带的方法(先生成条形码，然后获取条形码信息，再使用api生成src)
// 二维码采用插件的方法，封装了tool的方法，转化二维码未base64的src
export default class Home extends wepy.mixin {
    data = {
        // 当前优惠券详情
        coupon:[],
        // 二维码图片src
        qrcode: '',
        // 条形码图片src
        BARImgUrl: ''
    }
    onShow() { }
    onLoad(options) {
        wx.showLoading({
            title: '加载中'
          })
        this.coupon=options
        this.$apply()
          //   生成条形码
      tool.barcode('barcode', options.cid, 750, 150)

        setTimeout(() => {
            // 利用插件生成二维码图片
            let qrcodeSize = this.getQRCodeSize()
            this.createQRCode(options.cid, qrcodeSize)

            // 获取条形码画布的图像信息
            this.saveCanvas()
            wx.hideLoading()
          }, 500);
    }
    
    //适配不同屏幕大小的canvas
  getQRCodeSize() {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      size = width;

    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败"+e);
    }
    return size;
  }
  createQRCode(text, size) {
    //调用插件中的draw方法，绘制二维码图片

    let that = this

    // console.log('QRcode: ', text, size)
    let _img = QR.createQrCodeImg(text, {
      size: parseInt(size)
    })
    that.qrcode = _img
    this.$apply()
  }
// 获取条形码画布的图像信息
saveCanvas() {
    wx.canvasToTempFilePath({
      canvasId: 'barcode',
      success: (res) => {
        this.BARImgUrl = res.tempFilePath
        this.$apply()
      },
      fail(res) {
        console.log(res);
      }
    })
  }
    methods = {
        // 前往会员详情
        toMydetail(){
            wx.navigateTo({
                url: '/pages/other/mydetail'})
        }
    }
    // 计算函数
    computed = {

    }
}