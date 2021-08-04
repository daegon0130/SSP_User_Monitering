<template>
  <v-app>
    <div>
    <v-container>
      <date-select @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" />
      <account-chart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=true />
    </v-container>
    </div>
  </v-app>
</template>

<script>
import AccountChart from './AccountChart.vue'
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
    AccountChart,
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
