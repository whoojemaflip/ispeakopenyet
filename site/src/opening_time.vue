<template>
  <span v-bind:class="[{ justOpened: isRecentlyOpened }, offsetClass]">{{ this.timeFormatted() }}</span>
</template>

<script>
import Moment from 'moment';

export default {
  name: 'OpeningTime',
  data() {
    return {
      isRecentlyOpened: false,
      offsetClass: '',
      now: Moment().valueOf()
    }
  },
  created() {
    this.isRecentlyOpened = this.calcRecentlyOpened();
    this.offsetClass = this.calcOffsetClass();
  },
  props: {
    time: Number
  },
  methods: {
    calcRecentlyOpened() {
      return Math.abs(this.time - this.now) < 15 * 60 * 1000;
    },
    calcOffsetClass() {
      return 'on-time'
    },
    timeFormatted() {
      if (this.time) {
        return Moment(this.time).format("H:mm")
      } else {
        return ''
      }
    }
  }
}
</script>
