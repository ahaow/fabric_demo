import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: [{
    path: "/",
    component: (resolve) => {
      require(["./../views/fabric"], resolve);
    },
  },
  {
    path: "/test",
    component: (resolve) => {
      require(["./../views/test"], resolve);
    },
  },
  {
    path: "/canvas",
    component: (resolve) => {
      require(["./../views/canvas"], resolve);
    },
  },
  {
    path: "/moblie",
    component: (resolve) => {
      require(["./../views/moblie"], resolve);
    },
  }]
})

export default router;