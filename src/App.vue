/* eslint-disabed */
<template>
  <div class="container">
    <canvas id="canvas" width="800" height="800"></canvas>
    <!-- 星空背景 -->
    <canvas id="star-canvas"></canvas> 

    <div class="milk-tea-list" style="display: none;">
      <img class="milk-tea" :src="item.url" :title="item.name" v-for="item in milkImageList" :key="item.index" alt="">
    </div>
    <div class="album-list" style="display: none;">
      <img class="album-img" :src="item.url" v-for="item in albumImageList" :key="item.index" alt="">
    </div>
    <img class="first-jay" style="display: none;" src="./assets/first.jpeg" alt="">

  </div>
</template>

<script>
import Square from "./js/Square";
import Snake from "./js/Snake";
import dropMilkTea from "./js/MilkTea";
let milkTea = null
console.log('Square', Square);
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      timer: null,
      snake: null,
      ctx: null,
      canvas: null,
      img: null,
      milkTea: null,
      milkImageList: [],
      albumImageList: [],
    }
  },
  created() {
    let albumFiles = require.context('./assets/Jay', false, /\.jpeg$/)
    let milkFiles = require.context('./assets/MilkTea', false, /\.jpeg$/)
    
    let requireAll = (req) => {
      return req.keys().map(req)
    }
    let albumList = requireAll(albumFiles)
    let milkList = requireAll(milkFiles)

    albumList.map((item, index) => {
      this.albumImageList.push({
        index,
        url: item
      })
    })
    milkList.map((item, index) => {
      console.log('split', item.split('/img/')[1].split('.')[0]);
      // 字符分割获取奶茶名
      const milkTeaName = item.split('/img/')[1].split('.')[0]
      this.milkImageList.push({
        index,
        url: item,
        name: milkTeaName
      })
    })
  },
  mounted() {
    // 开始绘制
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.img2 = document.getElementsByClassName('first-jay')[0]
    this.getStarEffects()
    this.startDraw()
  },
  methods: {
    // 生成星空效果
    getStarEffects() {
      //宇宙特效
      var canvas = document.getElementById('star-canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = document.documentElement.offsetWidth,
        h = canvas.height = document.documentElement.offsetHeight,
        hue = 217,
        stars = [],
        count = 0,
        maxStars = 2500;//星星数量
      var canvas2 = document.createElement('canvas'),
        ctx2 = canvas2.getContext('2d');
      canvas2.width = 100;
      canvas2.height = 100;
      var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
      gradient2.addColorStop(0.025, '#CCC');
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
      gradient2.addColorStop(1, 'transparent');

      ctx2.fillStyle = gradient2;
      ctx2.beginPath();
      ctx2.arc(half, half, half, 0, Math.PI * 2);
      ctx2.fill();

      // End cache
      function random(min, max) {
        if (arguments.length < 2) {
          max = min;
          min = 0;
        }
        if (min > max) {
          var hold = max;
          max = min;
          min = hold;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function maxOrbit(x, y) {
        var max = Math.max(x, y),
          diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
        //星星移动范围，值越大范围越小，
      }

      var Star = function() {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 18; 
        //星星大小
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 500000; 
        //星星移动速度
        this.alpha = random(2, 10) / 10;
        count++;
        stars[count] = this;
      }

      Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
          y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
          twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }

      for (var i = 0; i < maxStars; i++) {
        new Star();
      }

      function animation() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.5; //尾巴
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
          stars[i].draw();
        };
        window.requestAnimationFrame(animation);
      }
      animation();
    },
    startDraw() {
      this.snake = new Snake(1, this.ctx, this.canvas, this.img2)
      milkTea = dropMilkTea(this.snake, this.canvas, document.getElementsByClassName('milk-tea')[0])
      // 初始时，默认向右移动
      this.snake.direction = 'right'
      // 投放奶茶
      milkTea.draw(this.ctx)
      this.addKeydownListener()
      this.snake.draw(this.timer)
      this.timer = setInterval(() => {
        this.animate()
      }, 500);
    },
    animate(){
      // 先清空旧画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.snake.move(milkTea)
      // 重新绘制
      this.snake.draw(this.timer)
      // 奶茶也重新绘制
      console.log('this.milkTea', milkTea);
      milkTea.draw(this.ctx, 'milk')
    },
    addKeydownListener() {
      document.onkeydown = (e) => {
        // 键盘事件
        e = e || window.event
        // 左37  上38  右39  下40
        switch (e.keyCode) {
          case 37:
              console.log('向左')
              // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
              this.snake.direction = this.snake.direction === 'right' ? 'right' : 'left'
              this.snake.move(milkTea)
              break
          case 38:
              console.log('向上')
              this.snake.direction = this.snake.direction === 'bottom' ? 'bottom' : 'top'
              break
          case 39:
              console.log('向右')
              this.snake.direction = this.snake.direction === 'left' ? 'left' : 'right'
              break
          case 40:
              console.log('向下')
              this.snake.direction = this.snake.direction === 'top' ? 'top' : 'bottom'
              break
        }
      }
    }
  }
}
</script>

<style>
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  vertical-align: middle;
  height: 100%;
}
.container {
  flex: 1;
}
#canvas {
  background: #00000000;
  border-radius: 10px;
  box-shadow:
  inset 0 0 50px #fff,      /* inner white */
  inset 20px 0 80px #f0f,   /* inner left magenta short */
  inset -20px 0 80px #0ff,  /* inner right cyan short */
  inset 0px 0 0px #f0f,  /* inner left magenta broad */
  inset -20px 0 300px #0ff, /* inner right cyan broad */
  0 0 50px #fff,            /* outer white */
  -10px 0 80px #f0f,        /* outer left magenta */
  10px 0 80px #0ff;         /* outer right cyan */


}
#star-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
