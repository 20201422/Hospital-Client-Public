import { createApp } from 'vue'
import App from './app/App'
import router from './router'

// 引入vuex
import store from './store/store'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import "bootstrap-icons/font/bootstrap-icons.css"

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faUserSecret)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from '@/config/axios'
// import VueAxios from 'vue-axios'
import * as echarts from 'echarts'

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$echarts = echarts

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//element-plus 报错 ResizeObserver loop limit exceeded 解决
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}


app.component('font-awesome-icon', FontAwesomeIcon) // 注册 FontAwesome 图标组件
app.use(router).use(ElementPlus).use(store).mount('#app')

