<template>
  <v-app>
    <div>
    <v-container>
      <date-select-month v-if="this.timelength === 'month'" @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'acc'" :timelength="this.timelength"/>
      <date-select-week v-if="this.timelength === 'week'" @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'acc'" :timelength="this.timelength"/>
      <date-select v-else @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'acc'" />
      <account-chart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=true />
    </v-container>
    </div>
  </v-app>
</template>

<script>
import AccountChart from './AccountChart.vue'
import DateSelect from './DateSelect.vue'
import DateSelectMonth from './DateSelectMonth.vue'
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
    AccountChart,
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
