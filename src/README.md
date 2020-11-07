# fabricjs

## fabric属性

```js
this.canvas = new fabric.Canvas("c", {
    width: width,
    height: height,
    isDrawingMode: false, // 是否自由绘画 false否 true是
    skipTargetFind: true, // 是否禁止拖动  true 为禁止
    selectable: false, // 绘制对象不能被选择, 不能操作
    selection: true, // 显示拖拽背景 
})

this.canvas.freeDrawingBrush.color = "red" // 自由绘制笔的颜色
this.canvas.freeDrawingBrush.width = 5 // 自由绘制笔的宽度
```

## fabric事件

* mouse:down 鼠标按下触发
* mouse:move 鼠标经过触发
* mouse:up 鼠标放开触发
* mouse:move:before
* mouse:over
* mouse:up:before
* path:created 路径绘制创建后(路径绘制之后)触发
* selection:created 选择某个对象时触发
* selection:updated 选择某个对象更新对象状态时触发
* selection:cleared 离开某个对象时触发

## 设置光标样式

* defaultCursor: 默认光标, 即鼠标在画布上的样式 (默认样式: default)
* hoverCursor:  鼠标移动到对象上的样式(默认样式: move)
* moveCursor: 对象拖动时的鼠标样式(默认值：move)
* freeDrawingCursor: 自由绘制时的鼠标样式(默认：crosshair)
* rotationCursor: 旋转时的鼠标样式(默认: crosshair)

**也可以为对象单独设置光标样式**

```js
var rect = new fabric.Rect({top: 10,left: 10,width:50,height:50,fill: 'red'})
rect.hoverCursor = "pointer"
```

