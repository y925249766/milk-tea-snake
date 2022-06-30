/* eslint-disabed */
import Square from "./Square";
import { baseSize } from "./constant";

console.log('baseSize', baseSize);
// 随机投放奶茶
function dropMilkTea(snake,canvas, img) {
  // 标识是否生成的奶茶落在蛇上
  let isInSnake = true
  let square
  while (isInSnake) {
    // 保证奶茶x、y值是40的倍数
    let x = Math.round(Math.random()*(canvas.width - baseSize) / baseSize) * baseSize
    let y = Math.round(Math.random() * (canvas.height - baseSize) / baseSize) * baseSize
    console.log('snake', snake);
    console.log('奶茶位置:', x, y)
    // debugger // eslint-disable-line
    square = new Square(x, y, baseSize, baseSize, img)
    // 判断奶茶位置是否和蛇重叠
    if (square.x === snake.head.x && square.y === snake.head.y || snake.body.find(item => item.x === x && item.y === y)) {
      console.log('重叠了');
      isInSnake = true
      // 重叠则停止本次循环，重新生成奶茶位置
      continue
    } else if (square.x <= baseSize || square.x >= (canvas.width - baseSize) || square.y <= baseSize || square.y >= (canvas.height - baseSize) ) {
      console.log('奶茶跑到canvas边缘了');
      isInSnake = true
      // 奶茶在canvas边缘则停止本次循环，重新生成奶茶位置
      continue
    } else {
      isInSnake = false
    }
  }
  return square
}
export default dropMilkTea