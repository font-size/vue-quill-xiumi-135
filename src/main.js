import Vue from 'vue'
import App from './App.vue'
import modal from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import quillEditor from 'vue-quill-xiumi';
Vue.use(modal)
// Vue.use(quillEditor);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
