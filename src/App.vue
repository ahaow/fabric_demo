<template>
  <div id="app">
    <ul class="draw-list">
      <li @click="setType('null')">鼠标</li>
      <li @click="setType('line')">笔画</li>
      <li @click="setType('circle')">圆</li>
      <li>矩形</li>
      <button @click="handleSave">保存</button>
      <button @click="handleUpdate">修改</button>
    </ul>
    <canvas id="c" width="1500" height="500"></canvas>
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
      moveCount: 0,
      mouseFrom: {
        x: 0,
        y: 0,
      },
      mouseTo: {
        x: 0,
        y: 0,
      },
      doDrawing: false,
      drawingObject: null,
      type: null,
      el: null,
    };
  },
  methods: {
    handleSave() {
      console.log(JSON.stringify(this.canvas));
    },
    handleUpdate() {
      let el = this.canvas.getActiveObject()
      el.set('stroke', 'blue')
      this.canvas.renderAll();
    },
    setType(type) {
      this.type = type;
    },
    handlerTypeNone() {
      this.type = "none";
    },
    handlerNone() {
      this.canvas.isDrawingMode = false;
    },
    handlePath() {
      this.canvas.isDrawingMode = true;
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX, y: mouseY };
    },
    canvasGetObj() {
      this.canvas.on("selection:created", (el) => {
        // console.log("el", el)
        // el.set('color', "yellow")
        this.el = el.target
      });
    },
    canvasDown() {
      this.canvas.on("mouse:down", (options) => {
        var xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
        this.mouseFrom = {
          x: xy.x,
          y: xy.y,
        };
        console.log("down", this.mouseFrom);
        this.doDrawing = true;
      });
    },
    canvasUp() {
      this.canvas.on("mouse:up", (options) => {
        var xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
        this.mouseTo = {
          x: xy.x,
          y: xy.y,
        };
        this.drawingObject = null;
        this.moveCount = 1;
        this.doDrawing = false;
        this.handlerTypeNone();
      });
    },
    canvasMove() {
      this.canvas.on("mouse:move", (options) => {
        if (this.moveCount % 2 && !this.doDrawing) {
          //减少绘制频率
          return;
        }
        this.moveCount++;
        var xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
        this.mouseTo = {
          x: xy.x,
          y: xy.y,
        };
        this.drawing();
      });
    },
    drawing() {
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject);
      }
      let { mouseFrom, mouseTo } = this;
      let left = mouseFrom.x;
      let top = mouseFrom.y;

      let canvasObject = null;
      switch (this.type) {
        case "line":
          canvasObject = new fabric.Line(
            [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
            {
              stroke: "red",
              strokeWidth: 2,
            }
          );
          break;
        case "circle":
          var radius =
            Math.sqrt(
              (mouseTo.x - left) * (mouseTo.x - left) +
                (mouseTo.y - top) * (mouseTo.y - top)
            ) / 2;

          canvasObject = new fabric.Circle({
            left: left,
            top: top,
            stroke: "red",
            fill: "rgba(255, 255, 255, 0)",
            radius: radius,
            strokeWidth: 2,
          });
          break;
        default:
          break;
      }

      if (canvasObject) {
        this.canvas.add(canvasObject);
        this.drawingObject = canvasObject;
      }
    },
    initCanvas(width, height) {
      // let str = {"version":"4.2.0","objects":[{"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":100,"top":100,"width":20,"height":20,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"line","version":"4.2.0","originX":"left","originY":"top","left":501,"top":99,"width":69,"height":99,"fill":"rgb(0,0,0)","stroke":"red","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"x1":-34.5,"x2":34.5,"y1":-49.5,"y2":49.5},{"type":"circle","version":"4.2.0","originX":"left","originY":"top","left":681,"top":133,"width":105.55,"height":105.55,"fill":"rgba(255, 255, 255, 0)","stroke":"red","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":52.77546778570513,"startAngle":0,"endAngle":6.283185307179586}]}
      // var canvas = new fabric.Canvas('c');
      // console.log(canvas)
      // canvas.loadFromJSON(str)
      this.canvas = new fabric.Canvas("c", {
        width: width,
        height: height,
        isDrawingMode: false,
        // skipTargetFind: true,
        // selectable: false,
        selection: false, // 显示拖拽背景
      });

      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 20,
        height: 20,
      });
      this.canvas.add(rect);
      this.canvasDown();
      this.canvasUp();
      this.canvasMove();
      this.canvasGetObj();
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