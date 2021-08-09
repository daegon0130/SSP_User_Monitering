<template>
  <v-app>
    <div>
    <v-container>
      <date-select-month v-if="this.timelength === 'month'" @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'uv'" :timelength="this.timelength"/>
      <date-select-week v-else-if="this.timelength === 'week'" @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'uv'" :timelength="this.timelength"/>
      <date-select v-else @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'uv'"/>
      <UVChart :date="this.date" :date2="this.date2" :timeLength="this.timelength" :time1="this.time1" :time2="this.time2" :show=true />
    </v-container>
    </div>
    <router-view></router-view>
  </v-app>
</template>

<script>
import UVChart from './UVChart.vue'
import DateSelect from './DateSelect.vue'
import DateSelectMonth from './DateSelectMonth.vue'
import DateSelectWeek from './DateSelectWeek.vue'

export default {
  data: () => ({
    date: (new Date((Date.now() - 2036800000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    time1: '00:00',
    time2: '23:00',
    timelength: 'day'
  }),
  components: {
    UVChart,
    DateSelect,
    DateSelectMonth,
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
