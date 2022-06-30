// 碰撞检测：1、计算蛇头是否到达canvas边缘 2、计算蛇头是否碰到蛇身体
function deteCollision(snake, canvas) {
  const head = snake.head
  const x = head.x
  const y = head.y
  // 蛇头碰到canvas边缘
  if(x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    return true
  }
  // 蛇头碰到蛇身体
  if (snake.body.find(item => { item.x === x && item.y === y })) {
    return true
  }
  return false
}
export default deteCollision