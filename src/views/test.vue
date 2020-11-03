<template>
  <div>
    <canvas id="c" width="1500" height="700"></canvas>
  </div>
</template>

<script>
import Fabric from "fabric";
import io from "socket.io-client";
export default {
  name: "test",
  data() {
    return {
      canvas: null,
      str: "",
    };
  },
  watch: {
    str(newVal) {
      console.log("newVal", newVal)
      if(newVal == "连接成功") {
        return
      }
      this.initCanvas(JSON.parse(newVal))
    } 
  },
  methods: {
    initWs() {
      this.socket = io("http://localhost:1337");
      this.socket.on("connect", () => {});
      this.socket.on("event", (data) => {
        console.log("data", data);
      });
      this.socket.on("login", (name) => {
        console.log("name", name);
        this.str = name;
        // this.canvas.loadFromJSON(name);
      });
      this.socket.on("disconnect", () => {});
    },
    initCanvas(str = "") {
      let canvas = new fabric.Canvas("c");
      canvas.loadFromJSON(str);
    },
  },
  mounted() {
    this.initWs();
  },
};
</script>