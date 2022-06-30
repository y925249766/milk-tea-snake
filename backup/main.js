// 正方形蛇身体的构造函数
function Square(x, y, width, height, image) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.image = image
}
Square.prototype.draw = function () {
  ctx.beginPath()
  ctx.fillStyle = '#ccc'
  ctx.fillRect(this.x, this.y, this.width, this.height)
  ctx.strokeRect(this.x, this.y, this.width, this.height)
  if (this.image) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// 蛇的构造函数
function Snake(length = 0) {
  this.length = length
  this.head = new Square(canvas.width / 2, canvas.height / 2, 40, 40, img)
  this.body = []
  let x = this.head.x - 40
  let y = this.head.y
  for (let index = 0; index < length; index++) {
    this.body.push(new Square(x, y, 40, 40, img))
    x -= 40
  }
}
Snake.prototype.draw = function (timer) {
  if (deteCollision(this)) {
    console.log('碰撞到一起啦！');
    clearInterval(timer)
  }
  // 绘制蛇头
  this.head.draw()
  // 绘制蛇身
  for (let index = 0; index < this.body.length; index++) {
    this.body[index].draw()
  }
}
// 让蛇动起来！
Snake.prototype.move = function () {
  // 将蛇头上一次状态，拼到蛇身首部
  const square = new Square(this.head.x, this.head.y, this.head.width, this.head.height, img)
  // 只移动蛇身第一个位置，不需要移动每一格，提升性能
  console.log('before', this.body.length);
  this.body.unshift(square)
  console.log('after', this.body.length);

  // 如果蛇头移动时碰到奶茶，则身体加长1格，重新投放奶茶
  if (milkTea.x === this.head.x && milkTea.y === this.head.y) {
    milkTea = dropMilkTea(this)
    milkTea.draw()
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
// 随机投放奶茶
function dropMilkTea(snake) {
  // 标识是否生成的奶茶落在蛇上
  let isInSnake = true
  let square
  while (isInSnake) {
    // 保证奶茶x、y值是40的倍数
    let x = Math.floor(Math.random()*(canvas.width - 40) / 40) * 40
    let y = Math.round(Math.random() * (canvas.height - 40) / 40) * 40
    console.log('snake', snake);
    console.log('奶茶位置:', x, y)
    square = new Square(x, y, 40, 40, img2)
    // 判断奶茶位置是否和蛇重叠
    if (square.x === snake.head.x && square.y === snake.head.y || snake.body.find(item => item.x === x && item.y === y)) {
      console.log('重叠了');
      isInSnake = true
      // 重叠则停止本次循环，重新生成奶茶位置
      continue
    } else {
      isInSnake = false
    }
  }
  return square
}

// 碰撞检测：1、计算蛇头是否到达canvas边缘 2、计算蛇头是否碰到蛇身体
function deteCollision(snake) {
  const head = snake.head
  const x = head.x
  const y = head.y
  // 蛇头碰到canvas边缘
  if(x <= 0 || x >= canvas.width || y <= 0 || y >= canvas.height) {
    return true
  }
  // 蛇头碰到蛇身体
  if (snake.body.find(item => { item.x === x && item.y === y })) {
    return true
  }
  return false
}
// 开始绘制
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const img = document.getElementsByClassName('img')[0]
const img2 = document.getElementsByClassName('img')[1]

let milkTea = null
let timer = null
function draw() {
  let snake = new Snake(3)
  // 初始时，默认向右移动
  snake.direction = 'right'
  // 投放奶茶
  milkTea = dropMilkTea(snake)
  milkTea.draw()
  document.onkeydown = function (e) {
    // 键盘事件
    e = e || window.event
    console.log('e===', e);
    // 左37  上38  右39  下40
    switch (e.keyCode) {
      case 37:
          console.log('向左')
          // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
          snake.direction = snake.direction === 'right' ? 'right' : 'left'
          snake.move()
          break
      case 38:
          console.log('向上')
          snake.direction = snake.direction === 'bottom' ? 'bottom' : 'top'
          break
      case 39:
          console.log('向右')
          snake.direction = snake.direction === 'left' ? 'left' : 'right'
          break
      case 40:
          console.log('向下')
          snake.direction = snake.direction === 'top' ? 'top' : 'bottom'
          break
    }
  }
  snake.draw(timer)
  timer = setInterval(() => {
    // 先清空旧画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    // 重新绘制
    snake.draw(timer)
    // 奶茶也重新绘制
    milkTea.draw()
  }, 300);
}
draw()