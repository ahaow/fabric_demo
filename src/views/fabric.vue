<template>
  <div id="app">
    <ul class="draw-list">
      <li
        @click="setType(item.type, item.index)"
        v-for="item in typeList"
        :key="item.index"
        :class="{ current: item.index == typeIndex }"
      >
        <i class="iconfont" :class="item.icon"></i>
      </li>
      <li @click="handleEmpty">
        <i class="iconfont icon-qingkong"></i>
      </li>
      <button @click="handleToJSON">保存</button>
      <button @click="handleSend">发送</button>
    </ul>

    <div class="style-control" v-show="controlShow">
      <div class="control-item" v-show="lsType !== 'text'">
        <h3 class="title">描边</h3>
        <div class="color-picker">
          <colorPicker v-model="strokeColor" @change="setStrokeColor" />
        </div>
      </div>
      <div class="control-item" v-show="controlBgShow">
        <h3 class="title">背景</h3>
        <div class="color-picker">
          <colorPicker v-model="fillColor" @change="setFillColor" />
        </div>
      </div>
      <div class="control-item" v-show="lsType !== 'text'">
        <h3 class="title">描边宽度</h3>
        <ul class="stroke-list">
          <li
            @click="setStrokeWidth(2)"
            :class="{ active: strokeColorActive == 2 }"
          >
            <div class="line one"></div>
          </li>
          <li
            @click="setStrokeWidth(4)"
            :class="{ active: strokeColorActive == 4 }"
          >
            <div class="line two"></div>
          </li>
          <li
            @click="setStrokeWidth(6)"
            :class="{ active: strokeColorActive == 6 }"
          >
            <div class="line three"></div>
          </li>
        </ul>
      </div>
      <div class="control-item" v-show="lsType !== 'text'">
        <h3 class="title">描边(样式)</h3>
        <ul class="stroke-style">
          <li
            @click="setStrokeDash([], 1)"
            :class="{ active: strokeDashActive == 1 }"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 40 20"
            >
              <path
                d="M0 10h40M0 10h40"
                stroke="#000000"
                stroke-width="2"
                fill="none"
              />
            </svg>
          </li>
          <li
            @click="setStrokeDash([20, 20], 2)"
            :class="{ active: strokeDashActive == 2 }"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 40 20"
            >
              <path
                d="M3.286 9.998h32.759"
                stroke="#000000"
                stroke-width="2.5"
                fill="none"
                stroke-dasharray="12 8"
              />
            </svg>
          </li>
          <li
            @click="setStrokeDash([10, 10], 3)"
            :class="{ active: strokeDashActive == 3 }"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 40 20"
            >
              <path
                d="M0 10h40M0 10h40"
                stroke="#000000"
                stroke-width="2"
                fill="none"
                stroke-dasharray="3 6"
              />
            </svg>
          </li>
        </ul>
      </div>
      <div class="control-item" v-show="lsType === 'text'">
        <h3 class="title">字体大小</h3>
        <ul class="fontSize-control">
          <li
            @click="setFontSize(14)"
            :class="{ active: fontSizeActive == 14 }"
          >
            小号
          </li>
          <li
            @click="setFontSize(18)"
            :class="{ active: fontSizeActive == 18 }"
          >
            中等
          </li>
          <li
            @click="setFontSize(22)"
            :class="{ active: fontSizeActive == 22 }"
          >
            大号
          </li>
          <li
            @click="setFontSize(26)"
            :class="{ active: fontSizeActive == 26 }"
          >
            极大
          </li>
        </ul>
      </div>
      <div class="control-item" v-show="lsType === 'text'">
        <h3 class="title">文本对齐</h3>
        <ul class="fontSize-control">
          <li
            @click="setTextAlign('left')"
            :class="{ active: alignActive == 'left' }"
          >
            左对齐
          </li>
          <li
            @click="setTextAlign('center')"
            :class="{ active: alignActive == 'center' }"
          >
            居中
          </li>
          <li
            @click="setTextAlign('right')"
            :class="{ active: alignActive == 'right' }"
          >
            右对齐
          </li>
        </ul>
      </div>
      <div class="control-item">
        <h3 class="title">操作</h3>
        <div class="operation">
          <div class="item" @click="handleRemoveCurrentObj">
            <i class="iconfont icon-shanchu"></i>
          </div>
        </div>
      </div>
    </div>

    <canvas id="c" width="1500" height="700"></canvas>
  </div>
</template>

<script>
import Fabric from "fabric";
import io from "socket.io-client";
import { drawArrow } from "@/utils/fabric.js";
export default {
  name: "fabric",
  data() {
    return {
      strokeColor: "#c0c0c0", // 描边color
      strokeColorActive: 2,
      strokeDashActive: 1,
      fillColor: "#c0c0c0", // 背景color
      type: null, // 绘画类型
      lsType: "path",
      fontSizeActive: 14,
      alignActive: "left",
      typeIndex: 1,
      typeList: [
        {
          index: 1,
          type: "null",
          icon: "icon-shubiao",
        },
        {
          index: 2,
          type: "freedom",
          icon: "icon-huabi",
        },
        {
          index: 3,
          type: "arrow",
          icon: "icon-45",
        },
        {
          index: 4,
          type: "line",
          icon: "icon-zhixian_huaban1",
        },
        {
          index: 5,
          type: "circle",
          icon: "icon-circle",
        },
        {
          index: 6,
          type: "rect",
          icon: "icon-rect",
        },
        {
          index: 7,
          type: "rightangle",
          icon: "icon-sanjiaoxing",
        },
        {
          index: 8,
          type: "text",
          icon: "icon-wenben",
        },
      ],
      controlShow: false,
      appWidth: null, // 画板宽度
      appHeight: null, // 画板高度
      refCircle: null, // 圆
      moveCount: 0, // move次数
      mouseFrom: {
        // from开始坐标
        x: 0,
        y: 0,
      },
      mouseTo: {
        // from结束坐标
        x: 0,
        y: 0,
      },
      doDrawing: false,
      drawingObject: null,
      el: null, //
      textbox: null, // 文本盒子
      throttle: true, // 节流flag
      str: "",
    };
  },
  computed: {
    controlBgShow() {
      return this.lsType !== "path" && this.lsType !== "line";
    },
  },
  watch: {
    type(newVal) {
      newVal === "null"
        ? (this.canvas.selection = true)
        : (this.canvas.selection = false);
      newVal === "freedom"
        ? (this.canvas.isDrawingMode = true)
        : (this.canvas.isDrawingMode = false);
    },
  },
  methods: {
    handleSend() {
      this.socket.emit("login", this.str);
    },
    initWs() {
      this.socket = io("http://localhost:1337");
      this.socket.on("connect", () => {});
      this.socket.on("event", (data) => {
        console.log("data", data);
      });
      this.socket.on("login", (name) => {
        console.log("name", name);
      });
      this.socket.on("disconnect", () => {});
    },
    handleToJSON() {
    //   console.log(JSON.stringify(this.canvas));
      console.log(this.canvas.toJSON());
    //   this.str = JSON.stringify(this.canvas);
      this.str = JSON.stringify(this.canvas.toJSON())
    },
    // 清空画板
    handleEmpty() {
      this.canvas.clear();
    },
    // 删除某个选择对象
    handleRemoveCurrentObj() {
      let currentEl = this.canvas.getActiveObject();
      this.canvas.remove(currentEl);
      this.canvas.renderAll();
    },
    // 设置描边颜色
    setStrokeColor() {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("stroke", this.strokeColor);
      this.canvas.renderAll();
    },
    // 设置描边宽度
    setStrokeWidth(num) {
      this.strokeColorActive = num;
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("strokeWidth", num);
      this.canvas.renderAll();
    },
    // 设置描边虚线
    setStrokeDash(arr, index) {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("strokeDashArray", arr);
      this.strokeDashActive = index;
      this.canvas.renderAll();
    },
    // 设置填充宽度
    setFillColor() {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("fill", this.fillColor);
      this.canvas.renderAll();
    },
    // 设置type
    setType(type, index) {
      this.type = type;
      this.typeIndex = index;
      if (this.textbox) {
        this.textbox.exitEditing();
        this.textbox = null;
      }
    },
    // 设置字体大小
    setFontSize(fontSize) {
      let currentEl = this.canvas.getActiveObject();
      this.fontSizeActive = fontSize;
      currentEl.set("fontSize", fontSize);
      this.canvas.renderAll();
    },
    // 设置字体方向
    setTextAlign(align) {
      let currentEl = this.canvas.getActiveObject();
      this.alignActive = align;
      currentEl.set("textAlign", align);
      this.canvas.renderAll();
    },
    // 重定type类型值
    handlerTypeNone() {
      this.type = "null";
      this.typeIndex = 1;
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX, y: mouseY };
    },
    // created update 公共方法
    createdAndUpdate(el) {
      this.controlShow = true;
      let target = el.target;
      console.log("target", target);
      let dash = JSON.stringify(target.strokeDashArray);
      if (dash == "[]") {
        this.strokeDashActive = 1;
      } else if (dash === "[20,20]") {
        this.strokeDashActive = 2;
      } else if (dash === "[10,10]") {
        this.strokeDashActive = 3;
      }
      this.lsType = target.type ? target.type : "path";
      this.alignActive = target.textAlign ? target.textAlign : "left";
      this.fontSizeActive = target.fontSize ? target.fontSize : 14;
      this.strokeColor = target.stroke ? target.stroke : "#fff";
      this.fillColor = target.fill ? target.fill : "#fff";
      this.strokeColorActive = target.strokeWidth ? target.strokeWidth : 2;
      this.el = target;
    },
    // 选择某个对象
    canvasSelectionCreated() {
      this.canvas.on("selection:created", (el) => {
        this.createdAndUpdate(el);
      });
    },
    // 选择某个对象
    canvasSelectionUpdated() {
      this.canvas.on("selection:updated", (el) => {
        this.createdAndUpdate(el);
      });
    },
    // 离开某个对象
    canvasSelectionLeave() {
      this.canvas.on("selection:cleared", (el) => {
        this.controlShow = false;
      });
    },
    canvasDown() {
      this.canvas.on("mouse:down", (options) => {
        var xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
        this.mouseFrom = {
          x: xy.x,
          y: xy.y,
        };
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
        // 禁止出现全选中出现 样式控制器
        if (this.canvas.getActiveObjects().length > 1) {
          this.controlShow = false;
        }
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
        case "freedom":
          break;
        case "arrow":
          canvasObject = new fabric.Path(
            drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30),
            {
              stroke: "red",
              fill: "#fff",
              strokeDashArray: [],
              strokeWidth: 2,
              type: "arrow",
            }
          );
          break;
        case "line":
          canvasObject = new fabric.Line(
            [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
            {
              strokeDashArray: [],
              stroke: "red",
              strokeWidth: 2,
              fill: "#fff",
              type: "line",
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
            fill: "#fff",
            radius: radius,
            strokeDashArray: [],
            strokeWidth: 2,
            type: "circle",
          });
          break;
        case "rect":
          canvasObject = new fabric.Rect({
            left: left,
            top: top,
            fill: "red",
            stroke: "#fff",
            strokeDashArray: [],
            width: mouseTo.x - left,
            height: mouseTo.y - top,
            type: "rect",
          });
        case "rightangle":
          let path =
            "M " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseTo.y +
            " L " +
            mouseTo.x +
            " " +
            mouseTo.y +
            " z";
          canvasObject = new fabric.Path(path, {
            left: left,
            top: top,
            stroke: "red",
            strokeDashArray: [],
            strokeWidth: 2,
            fill: "#fff",
            type: "rightangle",
          });
          break;
        case "text":
          if (this.throttle) {
            this.textbox = new fabric.Textbox("", {
              left: mouseFrom.x,
              top: mouseFrom.y,
              width: 100,
              height: 50,
              borderColor: "rgb(178,204,255)",
              backgroundColor: "#f3f3f3",
              fill: "red",
              fontSize: 14,
              textAlign: "left",
              type: "text",
            });
            this.canvas.add(this.textbox);
            this.textbox.mouseMoveHandler();
            this.throttle = false;
            setTimeout(() => {
              this.throttle = true;
            }, 2000);
          }
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
      this.canvas.freeDrawingBrush.color = "red"; // 自由绘画笔的颜色
      // this.canvas.freeDrawingBrush.width 自由绘笔触宽度
      this.canvasDown();
      this.canvasUp();
      this.canvasMove();
      this.canvasSelectionCreated();
      this.canvasSelectionUpdated();
      this.canvasSelectionLeave();
    },
  },
  mounted() {
    this.appWidth = window.innerWidth;
    this.appHeight = window.innerHeight;
    this.initCanvas(this.appWidth, this.appHeight);
    this.initWs();
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
  align-items: center;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 10001;
  li {
    margin: 0 10px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: #e9ecef;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    &.current {
      background: rgb(206, 212, 216);
    }
    i {
      font-size: 22px;
    }
  }
}
.style-control {
  position: fixed;
  left: 10px;
  top: 50%;
  margin-top: -207px;
  width: 275px;
  padding: 10px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  .control-item {
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
  }
  .title {
    font-size: 12px;
    color: #343a40;
  }
  .color-picker {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    width: 25px;
    height: 25px;
    background: #e9ecef;
  }
  .stroke-list {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    li {
      margin-right: 10px;
      width: 45px;
      height: 26px;
      background-color: #e9ecef;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        background: #ced4d8;
      }
      .line {
        width: 80%;
        background-color: #000;
        &.one {
          height: 2px;
        }
        &.two {
          height: 4px;
        }
        &.three {
          height: 6px;
        }
      }
    }
  }
  .stroke-style {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    li {
      margin-right: 10px;
      width: 45px;
      height: 26px;
      background-color: #e9ecef;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        background: #ced4d8;
      }
      svg {
        width: 36px;
        height: 18px;
      }
    }
  }
  .fontSize-control {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    li {
      margin-right: 5px;
      padding: 4px;
      box-sizing: border-box;
      font-size: 12px;
      background-color: #e9ecef;
      border-radius: 4px;
      cursor: pointer;
      &.active {
        background: #ced4d8;
      }
    }
  }
  .operation {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background-color: #e9ecef;
      border-radius: 6px;
      cursor: pointer;
      i {
      }
    }
  }
}
</style>

<style>
.color-picker .m-colorPicker .colorBtn {
  width: 20px !important;
  height: 20px !important;
  border-radius: 4px;
}
</style>