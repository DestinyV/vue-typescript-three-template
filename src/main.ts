import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// http://necolas.github.io/normalize.css/ a popular css reset lib
import "normalize.css/normalize.css"

import "./styles/index.less"


import "ant-design-vue/dist/antd.css";

import VueAntDesign from "ant-design-vue";
Vue.use(VueAntDesign);

// svg icon
import "./icons"

// permission control 
import "./permission.ts"

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
