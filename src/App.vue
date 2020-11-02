<template>
  <div id="app">
    <ul class="draw-list">
      <li @click="handleNone">鼠标</li>
      <li @click="handlePath">笔画</li>
      <li @click="handleCirlc">圆</li>
      <li>矩形</li>
    </ul>
    <canvas id="c"></canvas>
  </div>
</template>

<script>
import Fabric from "fabric";
export default {
  name: "app",
  data() {
    return {
      appWidth: null,
      appHeight: null,
      refCircle: null,
    };
  },
  methods: {
    handleNone() {
      this.canvas.isDrawingMode = false;
    },
    handlePath() {
      this.canvas.isDrawingMode = true;
    },
    initCanvas(width, height) {
      this.canvas = new fabric.Canvas("c", {
        width: width,
        height: height,
        // isDrawingMode: true,
      });

      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 20,
        height: 20,
      });
      this.canvas.add(rect);
    },

    handleCirlc() {
      this.canvas.on("mouse:down", (e) => {
        var circle = new fabric.Circle({
          left: 100,
          top: 100,
          stroke: "red",
          strokeWidth: 3,
          fill: "",
        });
        this.refCircle = circle;
        this.canvas.add(circle);
      });

      this.canvas.on("mouse:move",  (event) => {
        this.refCircle.radius = 50;
        // this.refCircle.radius = Math.abs(100 - this.refCircle.left)
        // this.canvas.renderAll();
      });

      this.canvas.on("mouse:up",  () => {
        console.log()
        this.canvas.add(this.refCircle);
      });
    },
  },
  mounted() {
    this.appWidth = window.innerWidth;
    this.appHeight = window.innerHeight;
    this.initCanvas(this.appWidth, this.appHeight);
  },
};
</script>

<style lang="scss" scoped>
.draw-list {
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  display: flex;
  height: 50px;
  background-color: red;
  z-index: 10001;
  li {
    margin: 0 10px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    background: #c9c9c9;
    text-align: center;
    cursor: pointer;
  }
}
</style>