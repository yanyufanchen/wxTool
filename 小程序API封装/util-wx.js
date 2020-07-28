//生成临时图片
function handleNetImg(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success(res) {
          resolve(res)
        }
      })
    })
  }
  //转译base64图片
  function getBase64ImageUrl(data) {
    /*code是指图片base64格式数据*/
    //声明文件系统
    const fs = wx.getFileSystemManager();
    //随机定义路径名称
    var times = new Date().getTime();
    var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
      console.log(codeimg,'路径');
      
    //将base64图片写入
      return new Promise((resolve,reject)=>{
          fs.writeFile({
              filePath: codeimg,
              data: data,
              encoding: 'base64',
              success: (res) => {
                //写入成功了的话，新的图片路径就能用了
                console.log(res,'1')
                console.log(codeimg,'2')
                resolve(codeimg)
                
              },
              fail:(err)=>{
                reject(codeimg)
              }
            })
      })
  //     return img
  }
  // 获取屏幕尺寸
  function getSystemInfo() {
    const res = wx.getSystemInfoSync()
    return res
  }
  // js生成范围内的随机数(支持小数)//arguments.length表示传入的形参数
  function randomNum(maxNum, minNum, decimalNum) {
    var max = 0, min = 0;
    minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * (max + 1));
            break;
        case 2:
            return Math.floor(Math.random() * (max - min + 1) + min);
            break;
        case 3:
            return (Math.random() * (max - min) + min).toFixed(decimalNum);
            break;
        default:
            return Math.random();
            break;
    }
  }
  
  // 获取元素的高度
  function getDomHeight(className) {
    let query = wx.createSelectorQuery()
    let height=0
    
    return new Promise((resolve,reject)=>{
      query.select('.'+className).boundingClientRect(rect => {
        height = rect.height
        return resolve(height)
      }).exec()
    })
  }
  // 时间字符串转时间错
  // var date = item.createtime;
        // date = date.substring(0,19);    
        // date = date.replace(/-/g,'/'); 
        // var timestamp = new Date(date).getTime();
        // console.log(timestamp,1111);
  module.exports = {
    handleNetImg,
    getBase64ImageUrl,
    getSystemInfo,
    randomNum,
    getDomHeight
  }
  