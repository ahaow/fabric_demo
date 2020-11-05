<template>
  <div>
    <canvas id="ccc" width="1920" height="1080"></canvas>
  </div>
</template>

<script>
import Fabric from "fabric";
export default {
  name: "touch",
  data() {
    return {
      imgUrl: require("../assets/images/31.png"),
    };
  },
  mounted() {
    var canvas = new fabric.Canvas("ccc");
    fabric.Image.fromURL(this.imgUrl, function (img) {
      img.scale(0.5).set({
        left: 150,
        top: 150,
        angle: -15,
      });
      canvas.add(img).setActiveObject(img);
    });
    canvas.on("touch:gesture", () => {
      console.log(1);
    });
    canvas.on("touch:drag", () => {
      console.log(2);
    });
    canvas.on("touch:orientation", () => {
      console.log(3);
    });
    canvas.on("touch:shake", () => {
      console.log(4);
    });
    canvas.on("touch:longpress", () => {
      console.log(4);
    });
  },
};
</script>