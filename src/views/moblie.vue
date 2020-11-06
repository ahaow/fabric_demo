<template>
  <div class="moblie-container" id="moblie-container">
    <!-- draw-list -->
    <ul class="draw-list">
      <li
        v-for="item in typeList"
        :key="item.index"
        :class="{ current: item.index == typeIndex }"
        @click="setType(item.type, item.index)"
      >
        <i :class="`iconfont ${item.icon}`"></i>
      </li>
    </ul>

    <div class="style-control" v-show="styleControlShow">
      <div class="control-item">
        <h3 class="title">描边</h3>
        <div class="color-picker">
          <colorPicker v-model="strokeColor" @change="setStrokeColor" />
        </div>
      </div>
      <div class="control-item" v-show="fillControlShow">
        <h3 class="title">背景</h3>
        <div class="color-picker">
          <colorPicker v-model="fillColor" @change="setFillColor" />
        </div>
      </div>
      <div class="control-item">
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
      <div class="control-item">
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
      <div class="control-item" v-show="textControlShow">
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
      <div class="control-item" v-show="textControlShow">
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

    <canvas id="moblie"></canvas>
  </div>
</template>

<script>
/**
 * md
 *
 * control
 * 1. 背景：自由绘画, 直线, 箭头
 * 2. 字体相关：除去字体
 *
 *
 */
import Fabric from "fabric";
import { drawArrow, setZoom } from "@/utils/fabric.js";
export default {
  name: "moblie",
  data() {
    return {
      typeIndex: 1,
      type: null,
      lsType: "path",
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
        {
          index: 9,
          type: "clear",
          icon: "icon-xiangpica",
        },
      ],
      appWidth: null,
      appHeight: null,
      moblie: null,
      canvas: null,
      mouseFrom: {
        x: 0,
        y: 0,
      },
      mouseTo: {
        x: 0,
        y: 0,
      },
      moveCount: 0,
      doDrawing: false,
      drawingObject: null,
      throttle: true,
      textbox: null,
      fillColor: "transparent",
      strokeColor: "#000",
      strokeColorActive: 2,
      strokeDashActive: 1,
      fontSizeActive: 14,
      alignActive: "left",
      styleControlShow: false,
    };
  },
  computed: {
    fillControlShow() {
      let type = this.lsType;
      if (type !== "path" && type !== "line" && type !== "arrow") {
        return true;
      }
    },
    textControlShow() {
      let type = this.lsType;
      return type === "text";
    },
  },
  watch: {
    type(newVal) {
      if (newVal === "freedom" || newVal === "clear") {
        this.canvas.isDrawingMode = true;
      } else {
        this.canvas.isDrawingMode = false;
      }
      this.styleControlShow = false;
    },
  },
  methods: {
    setType(type, index) {
      this.type = type;
      this.typeIndex = index;
    },
    resetType() {
      this.type = null;
      this.typeIndex = 1;
    },
    setStrokeColor(color) {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("stroke", this.strokeColor);
      this.canvas.renderAll();
    },
    setFillColor() {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("fill", this.fillColor);
      this.canvas.renderAll();
    },
    setStrokeWidth(width) {
      this.strokeColorActive = width;
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("strokeWidth", width);
      this.canvas.renderAll();
    },
    setStrokeDash(arr, index) {
      let currentEl = this.canvas.getActiveObject();
      currentEl.set("strokeDashArray", arr);
      this.strokeDashActive = index;
      this.canvas.renderAll();
    },
    setFontSize(fontSize) {
      let currentEl = this.canvas.getActiveObject();
      this.fontSizeActive = fontSize;
      currentEl.set("fontSize", fontSize);
      this.canvas.renderAll();
    },
    setTextAlign(align) {
      let currentEl = this.canvas.getActiveObject();
      this.alignActive = align;
      currentEl.set("textAlign", align);
      this.canvas.renderAll();
    },
    handleRemoveCurrentObj() {
      let currentEl = this.canvas.getActiveObject();
      this.canvas.remove(currentEl);
      this.canvas.renderAll();
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    },
    initCanvas(width, height) {
      this.canvas = new fabric.Canvas("moblie", {
        width: width,
        height: height,
        isDrawingMode: false,
        selection: false,
      });
      this.canvas.freeDrawingBrush.color = "#000";
      this.canvasDown();
      this.canvasMove();
      this.canvasUp();
      this.canvasSelectionCreated();
      this.canvasSelectionUpdated();
      this.canvasSelectionLeave();
      setZoom(this.moblie, this.canvas);
    },
    canvasDown() {
      this.canvas.on("mouse:down", (options) => {
        let xy = this.transformMouse(options.pointer.x, options.pointer.y);
        this.mouseFrom = {
          x: xy.x,
          y: xy.y,
        };
        this.doDrawing = true;
      });
    },
    canvasMove() {
      this.canvas.on("mouse:move", (options) => {
        if (this.moveCount % 2 && !this.doDrawing) {
          return;
        }
        this.moveCount++;
        let xy = this.transformMouse(options.pointer.x, options.pointer.y);
        this.mouseTo = {
          x: xy.x,
          y: xy.y,
        };
        this.drawing();
      });
    },
    canvasUp() {
      this.canvas.on("mouse:up", (options) => {
        let xy = this.transformMouse(options.pointer.x, options.pointer.y);
        this.mouseTo = {
          x: xy.x,
          y: xy.y,
        };
        this.drawingObject = null;
        this.moveCount = 1;
        this.doDrawing = false;
        if (this.type !== "freedom") {
          this.resetType();
        }
      });
    },
    createdAndUpdate(el) {
      console.log("el", el);
      let target = el.target;
      this.styleControlShow = true;
      let dash = JSON.stringify(target.strokeDashArray);
      if (dash == "[]") {
        this.strokeDashActive = 1;
      } else if (dash === "[20,20]") {
        this.strokeDashActive = 2;
      } else if (dash === "[10,10]") {
        this.strokeDashActive = 3;
      }
      this.lsType = target.lstype ? target.lstype : "path";
      this.alignActive = target.textAlign ? target.textAlign : "left";
      this.fontSizeActive = target.fontSize ? target.fontSize : 14;
      this.strokeColor = target.stroke ? target.stroke : "#fff";
      this.fillColor = target.fill ? target.fill : "#fff";
      this.strokeColorActive = target.strokeWidth ? target.strokeWidth : 2;
    },
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
        this.styleControlShow = false;
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
          canvasObject = this.drawLine(mouseFrom, mouseTo);
          break;
        case "arrow":
          canvasObject = this.drawArrowFn(mouseFrom, mouseTo);
          break;
        case "circle":
          canvasObject = this.drawCircle(mouseFrom, mouseTo);
          break;
        case "rect":
          canvasObject = this.drawRect(mouseFrom, mouseTo);
          break;
        case "rightangle":
          canvasObject = this.drawRightAngle(mouseFrom, mouseTo);
          break;
        case "text":
          this.drawText(mouseFrom);
          break;
        default:
          break;
      }
      if (canvasObject) {
        this.canvas.add(canvasObject);
        this.drawingObject = canvasObject;
      }
    },
    drawLine(mouseFrom, mouseTo) {
      let drawObj = new fabric.Line(
        [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
        {
          strokeDashArray: [],
          stroke: "#000",
          strokeWidth: 2,
          fill: "transparent",
          lstype: "line",
        }
      );
      return drawObj;
    },
    drawArrowFn(mouseFrom, mouseTo) {
      let drawObj = new fabric.Path(
        drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30),
        {
          fill: "transparent",
          stroke: "#000",
          strokeDashArray: [],
          strokeWidth: 2,
          lstype: "arrow",
        }
      );
      return drawObj;
    },
    drawCircle(mouseFrom, mouseTo) {
      let radius =
        Math.sqrt(
          (mouseTo.x - mouseFrom.x) * (mouseTo.x - mouseFrom.x) +
            (mouseTo.y - mouseFrom.y) * (mouseTo.y - mouseFrom.y)
        ) / 2;
      let drawObj = new fabric.Circle({
        left: mouseFrom.x,
        top: mouseFrom.y,
        stroke: "#000",
        fill: "transparent",
        radius: radius,
        strokeDashArray: [],
        strokeWidth: 2,
        lstype: "circle",
      });
      return drawObj;
    },
    drawRect(mouseFrom, mouseTo) {
      let drawObj = new fabric.Rect({
        left: mouseFrom.x,
        top: mouseFrom.y,
        fill: "transparent",
        stroke: "#000",
        strokeDashArray: [],
        width: mouseTo.x - mouseFrom.x,
        height: mouseTo.y - mouseFrom.y,
        lstype: "rect",
      });
      return drawObj;
    },
    drawRightAngle(mouseFrom, mouseTo) {
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
      let drawObj = new fabric.Path(path, {
        left: mouseFrom.x,
        top: mouseFrom.y,
        stroke: "#000",
        strokeDashArray: [],
        strokeWidth: 2,
        fill: "transparent",
        lstype: "rightangle",
      });
      return drawObj;
    },
    drawText(mouseFrom) {
      if (this.throttle) {
        this.textbox = new fabric.Textbox("", {
          left: mouseFrom.x,
          top: mouseFrom.y,
          width: 100,
          height: 100,
          borderColor: "rgb(178,204,255)",
          backgroundColor: "#f3f3f3",
          fill: "#000",
          fontSize: 18,
          textAlign: "left",
          lstype: "text",
        });
        this.canvas.add(this.textbox);
        this.textbox.mouseMoveHandler();
        this.throttle = false;
        setTimeout(() => {
          this.throttle = true;
        }, 1500);
      }
    },
  },
  mounted() {
    this.appWidth = window.innerWidth;
    this.appHeight = window.innerHeight;
    this.moblie = document.getElementById("moblie-container");
    this.moblie.style.height = this.appHeight + "px";
    this.moblie.style.width = this.appWidth + "px";
    this.initCanvas(this.appWidth, this.appHeight);
  },
};
</script>

<style lang="scss" scoped>
.moblie-container {
  width: 100%;
  height: 100%;
  #moblie {
    background: red;
  }
  .draw-list {
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 40px;
    height: auto;
    padding: 10px 0;
    background-color: #fff;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    z-index: 999;
    li {
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      background-color: #e9ecef;
      &.current {
        background-color: #ced4d8;
      }
      &:last-child {
        margin-bottom: 0;
      }
      i {
        font-size: 22px;
      }
    }
  }
  .style-control {
    position: fixed;
    left: 10px;
    top: 10px;
    width: 150px;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    .control-item {
      margin-bottom: 10px;
      .title {
        font-size: 12px;
      }
      .color-picker {
        margin-top: 5px;
      }
      .stroke-list {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        li {
          margin-right: 5px;
          flex: 0 0 40px;
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
          margin-right: 5px;
          flex: 0 0 40px;
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
            width: 32px;
            height: 18px;
          }
        }
      }
      .fontSize-control {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        li {
          margin-right: 5px;
          margin-bottom: 5px;
          flex: 0 0 45%;
          padding: 4px;
          box-sizing: border-box;
          font-size: 12px;
          background-color: #e9ecef;
          border-radius: 4px;
          text-align: center;
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
  }
}
</style>