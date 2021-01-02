<template>
  <ol>
    <li>
      <ul>
        <li>Lift name</li>
        <li v-for="lift in liftNames">{{ lift }}</li>
      </ul>
    </li>
    <li v-for="date in dates">
      <ul>
        <li>{{ date.display }}</li>
        <li v-for="lift in liftStatuses[date.index]">
          <OpeningTime v-bind:time="lift"></OpeningTime>
        </li>
      </ul>
    </li>
  </ol>
</template>

<script>
import Moment from 'moment';
import axios from 'axios';
import OpeningTime from './opening_time.vue'

export default {
  data() {
    return {
      liftStatuses: [],
      liftNames: [
        "7th Heaven Express",
        "Big Red Express",
        "Blackcomb Gondola Lower",
        "Blackcomb Gondola Upper",
        "bubly Tube Park",
        "Catskinner Express",
        "Creekside Gondola",
        "Crystal Ridge Express",
        "Emerald 6 Express",
        "Excalibur Gondola Lower",
        "Excalibur Gondola Upper",
        "Excelerator Express",
        "Fitzsimmons Express",
        "Franz's Chair",
        "Garbanzo Express",
        "Glacier Express",
        "Harmony 6 Express",
        "Jersey Cream Express",
        "Magic Chair",
        "Olympic Chair",
        "PEAK 2 PEAK Gondola",
        "Peak Express",
        "Showcase T-Bar",
        "Symphony Express",
        "T-Bar",
        "Whistler Village Gondola Lower",
        "Whistler Village Gondola Upper"
      ],
      dates: this.getDates()
    }
  },
  created() {
    this.fetchLiftStatuses()
  },
  methods: {
    fetchLiftStatuses() {
      const url = 'https://alpinelifts.ca/opening_times.json';
      axios.get(url)
      .then(response => {
        const liftData = response.data;
        console.log(liftData);
        this.liftStatuses = liftData;
      })
      .catch(error => {
        console.log(error);
      })
    },
    lastWeek() {
      return [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d;
      });
    },
    getDates() {
      return this.lastWeek().map((d, _) => {
        return {
          "display": Moment(d).format('dddd'),
          "index": Moment(d).format('YYYY-MM-DD')
        }
      });
    }
  },
  components: {
    OpeningTime
  }
}
</script>
