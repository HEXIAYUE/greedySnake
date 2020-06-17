let timer = ''; //定时器
const app = new Vue({
  el: "#app",
  data: {
    //设定地图大小
    rows: 0,
    cols: 0,
    //蛇的初始位置
    snake: [{
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: 3,
        y: 0,
      }
    ],
    //food的位置
    food: {
      x: 0,
      y: 0,
    },
    //蛇行走的方向
    way: 1,
    //分数
    grader: 0,


    //初始速度
    //蛇运动的速度
    inSpeed: 50,
    speed: 1000,

  },
  watch: {
    speed(val, oldVal) {

    }
  },
  methods: {
    //显示身体
    showSnake(x, y) {
      for (index in this.snake) {
        if (this.snake[index].x === x && this.snake[index].y === y)
          return true;
      }
    },
    showHeader(x, y) {
      if (this.snake[this.snake.length - 1].x === x && this.snake[this.snake.length - 1].y === y) {
        return true;
      }
    },
    //创造食物
    createFood() {
      this.food.x = Math.floor(Math.random() * this.cols);
      this.food.y = Math.floor(Math.random() * this.rows);
      //不能和身体重叠
      for (index in this.snake) {
        if (this.snake[index].x === this.food.x && this.snake[index].y === this.food.y)
          this.createFood();
      }
    },

    // 显示food
    showFood(x, y) {
      if (this.food.x === x && this.food.y === y)
        return true;
    },

    //键盘事件
    keyboard() {
      document.onkeydown = function (ev) {
        //二层函数中 this指向keyboard而不是app 所以这里用app.
        if (ev.keyCode === 37) {
          console.log("左");
          app.changeWay(-1);
        } else if (ev.keyCode === 38) {
          console.log("上");
          app.changeWay(-2);
        } else if (ev.keyCode === 39) {
          console.log("右");
          app.changeWay(1);
        } else {
          console.log("下");
          app.changeWay(2);
        }
      }
    },
    //控制方向
    changeWay(dir) {
      // 在上下时，只能左右移动，左右时只能上下移动
      if (Math.abs(dir) === Math.abs(this.way)) { //如果方向相同或者相反，不做任何操作
        return
      } else {
        this.way = dir //否则改变方向
      }

    },
    //蛇运动
    autorun() {
      //蛇头的位置
      let direction = this.way; //目前方向
      let headX = this.snake[this.snake.length - 1].x;
      let headY = this.snake[this.snake.length - 1].y;
      //左右
      if (Math.abs(direction) === 1) {
        if (direction > 0) {
          headX++;
        } else {
          headX--;
        }
      } else {
        if (direction > 0) {
          headY++;
        } else {
          headY--;
        }
      }

      let obj = {
        x: headX,
        y: headY
      };

      if (headX < 0 || headX > this.cols || headY < 0 || headY > this.rows || this.showSnake(headX, headY)) {
        this.$refs.die.play();
        clearInterval(timer);
        setTimeout(function () {
          alert("游戏失败");
          //初始化游戏
          location.reload(false);
        }, 2000)
      
      } else {
        //吃食物
        if (!(headX === this.food.x && headY === this.food.y)) {
          this.snake.shift();
        } else {
          this.$refs.eatFood.play();
          this.createFood();
          //记录分数
          this.grader++;
          this.speed -= 20;
        }
        this.snake.push(obj);
      }

    },

    start() { //开始按钮

      timer = setInterval(this.autorun, 300);
    },
    stop() {
      clearInterval(timer);
    },
        //根据设备不同 地图不同
    isPhone() {
      let ua = navigator.userAgent;
      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
      if (isMobile) {
        this.rows = 15;
        this.cols = 10;
        console.log("2");
      } else {
        this.rows = 20;
        this.cols = 25;
        console.log("1");
      }
    },


  },

  created() {
    //根据设备不同 地图不同
    this.isPhone();
    this.createFood();
    this.keyboard();
    
  },

})