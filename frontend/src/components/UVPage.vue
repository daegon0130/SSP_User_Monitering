<template>
  <v-app>
    <div>
    <v-container>
      <date-select @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'uv'"/>
      <UVChart :date="this.date" :date2="this.date2" :timeLength="this.timelength" :time1="this.time1" :time2="this.time2" :show=true />
    </v-container>
    </div>
    <router-view></router-view>
  </v-app>
</template>

<script>
import UVChart from './UVChart.vue'
import DateSelect from './DateSelect.vue'

export default {
  data: () => ({
    date: (new Date((Date.now() - 2036800000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    time1: null,
    time2: null,
    timelength: 'day'
  }),
  components: {
    UVChart,
    DateSelect
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
