<template>
  <div class="container">
    <canvas id="box" width="700" height="500"></canvas>
  </div>
</template>


<script>
export default {
  name: "wh",
  data() {
    return {
      ctx: null,
      cavnasLeft: null,
      canvasTop: null,
      move: {
        x: 0,
        y: 0,
      },
      type: "rect", // freedom rect
    };
  },
  methods: {
    initCanvas() {
      const canvas = document.getElementById("box");
      this.cavnasLeft = canvas.offsetLeft;
      this.canvasTop = canvas.offsetTop;
      this.ctx = canvas.getContext("2d");
      //   this.drawRect(this.ctx);
      //   this.drawPath(this.ctx);
      //   this.drawArc(this.ctx);
      //   this.drawArcTo(this.ctx);
      this.canvasDown();
    },
    drawFreedom(x, y) {
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = "red";
      this.ctx.stroke();
    },
    drawRect(x, y) {
    //   this.ctx.fillRect(this.move.x, this.move.y, x, y);
    //   this.ctx.stroke();
    },
    canvasDown() {
      document.addEventListener("mousedown", (e) => {
        this.move.x = e.clientX - this.cavnasLeft;
        this.move.y = e.clientY - this.canvasTop;
        if (this.move.x >= 0 && this.move.y >= 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.move.x, this.move.y);
          this.cavnasMove();
          this.canvasUp();
        }
      });
    },
    cavnasMove() {
      document.onmousemove = (e) => {
        let x = e.offsetX;
        let y = e.offsetY;

        switch (this.type) {
          case "freedom":
            this.drawFreedom(x, y);
            break;
          case "rect":
            this.drawRect(x, y);
          default:
            break;
        }
      };
    },
    canvasUp() {
      document.addEventListener("mouseup", () => {
        this.ctx.closePath();
        document.onmousemove = null;
      });
    },
  },
  mounted() {
    this.initCanvas();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  #box {
    margin-top: 20px;
    border: 1px solid #c0c0c0;
    cursor: url("./../assets/images/qianbi.png"), auto;
  }
}
</style>

