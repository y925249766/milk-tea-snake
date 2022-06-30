import deteCollision from "./DeteCollision";
import Square from "./Square";
import dropMilkTea from "./MilkTea";
import { ElMessage } from 'element-plus'
import { baseSize } from "./constant";

// 蛇的构造函数
function Snake(length = 0, ctx, canvas, img) {
  this.ctx = ctx
  this.canvas = canvas
  this.img = img
  this.length = length
  this.head = new Square(canvas.width / 2, canvas.height / 2, baseSize, baseSize, img)
  this.body = []
  let x = this.head.x - baseSize
  let y = this.head.y
  for (let index = 0; index < length; index++) {
    this.body.push(new Square(x, y, baseSize, baseSize, img))
    x -= baseSize
  }
}
Snake.prototype.draw = function (timer) {
  if (deteCollision(this, this.canvas)) {
    console.log('碰撞到一起啦！');
    clearInterval(timer)
  }
  // 绘制蛇头
  this.head.draw(this.ctx)
  // 绘制蛇身
  for (let index = 0; index < this.body.length; index++) {
    this.body[index].draw(this.ctx)
  }
}
// 让蛇动起来！
Snake.prototype.move = function (milkTea) {

  const albumImgList = Array.from(document.getElementsByClassName('album-img'))
  const albumIndex = Math.round(Math.random() * (albumImgList.length - 1))
  // 将蛇头上一次状态，拼到蛇身首部
  const square = new Square(this.head.x, this.head.y, this.head.width, this.head.height, albumImgList[albumIndex])
  // 只移动蛇身第一个位置，不需要移动每一格，提升性能
  this.body.unshift(square)
  // 如果蛇头移动时碰到奶茶，则身体加长1格，重新投放奶茶
  if (milkTea.x === this.head.x && milkTea.y === this.head.y) {

    console.log('dropMilkTea');
    const milkTeaImgList = Array.from(document.getElementsByClassName('milk-tea'))
    const imgIndex = Math.round(Math.random() * (milkTeaImgList.length - 1))
    const selectedMilkImg = milkTeaImgList[imgIndex]
    ElMessage.closeAll()
    ElMessage({
      message: `${ selectedMilkImg.title }奶茶+1`,
      type: 'success',
      duration: 1800
    })
    let newMilkTea = dropMilkTea(this, this.canvas, selectedMilkImg)
    milkTea.x = newMilkTea.x
    milkTea.y = newMilkTea.y
    milkTea.image = newMilkTea.image
    milkTea.draw(this.ctx)
  } else {// 没吃到奶茶，蛇尾就要去掉
    this.body.pop()
  }
  // 根据方向，控制蛇头的坐标
  switch (this.direction) {
    case 'left': // 向左移动
        this.head.x -= this.head.width
        break
    case 'top': // 向上移动
        this.head.y -= this.head.height
        break
    case 'right': // 向右移动
        this.head.x += this.head.width
        break
    case 'bottom': // 向下移动
        this.head.y += this.head.height
        break
  }
}
export default Snake