import Vue from 'vue';
import OpeningTimes from './opening_times.vue'
import OpeningTime from './opening_time.vue'

new Vue({
  el: '#app',
  template: '<OpeningTimes/>',
  components: { OpeningTimes, OpeningTime }
})
