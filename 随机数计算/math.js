// function randomNum(minNum,maxNum){ 
//     switch(arguments.length){ 
//         case 1: 
//             return parseInt(Math.random()*minNum+1,10); 
//         break; 
//         case 2: 
//             return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
//         break; 
//             default: 
//                 return 0; 
//             break; 
//     } 
// } 
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
module.exports = {
    randomNum
}