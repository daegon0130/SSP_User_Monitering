<template>
  <v-app>
    <div>
    <v-container>
      <date-select-week v-if="this.timelength==='week'" @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'pv'" :timelength="this.timelength"/>
      <date-select v-else @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'pv'"/>
      <PVChart delay=100000 :date="this.date" :date2="this.date2" :timeLength="this.timelength" :time1="this.time1" :time2="this.time2" :show=true />
    </v-container>
    </div>
  </v-app>
</template>

<script>
import PVChart from './PVChart.vue'
import DateSelect from './DateSelect.vue'
import DateSelectWeek from './DateSelectWeek.vue'

export default {
  data: () => ({
    date: (new Date((Date.now() - 2036800000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    time1: null,
    time2: null,
    timelength: 'day'
  }),
  components: {
    PVChart,
    DateSelect,
    DateSelectWeek
  },
  methods: {
    receiveDate (date, date2) {
      this.date = date
      this.date2 = date2
    },
    receiveTimeLength (timelength) {
      this.timelength = timelength
    },
    receiveTime (time1, time2) {
      this.time1 = time1
      this.time2 = time2
    }
  }
}
</script>
