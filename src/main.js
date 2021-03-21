import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jsPlumb from "jsplumb";
import 'jquery-ui-dist/jquery-ui';
import axios from "axios";
import VueAxios from 'vue-axios'
// 引Element.ui 组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// 引codemirror 代码编辑库
import codemirror from 'vue-codemirror'
import "codemirror/lib/codemirror.css";
Vue.config.productionTip = false
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb
Vue.prototype.$jsPlumbUtil = jsPlumb.jsPlumbUtil
Vue.use(ElementUI,{
  size: 'small'
});
Vue.use(codemirror)
Vue.use(VueAxios,axios)

axios.defaults.baseURL = '/api'

router.beforeEach((to,from,next) => {
  // console.log("from ",from," to ",to," next ",next);
  next();
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
