import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    window.event = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    window.addEventListener('mousedown', window.event)
  },
  unbind: function () {
    window.removeEventListener('mousedown', window.event)
  },
});


new Vue({
  render: h => h(App),
}).$mount('#app')
