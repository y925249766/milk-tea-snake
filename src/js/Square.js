// 正方形蛇身体的构造函数
function Square(x, y, width, height, image) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.image = image
}
Square.prototype.draw = function (ctx) {
  ctx.beginPath()
  ctx.fillStyle = '#070e19'
  // ctx.fillRect(this.x, this.y, this.width, this.height)
  // ctx.strokeRect(this.x, this.y, this.width, this.height)
  if (this.image) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
export default Square