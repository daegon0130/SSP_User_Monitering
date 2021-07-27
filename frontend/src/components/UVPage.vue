<template>
  <v-app>
    <div>
    <v-container>
      <date-select @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime"/>
      <UVChart :date="this.date" :date2="this.date2" :timeLength="this.timelength" :time1="this.time1" :time2="this.time2" />
    </v-container>
    </div>
  </v-app>
</template>

<script>
import UVChart from './UVChart.vue'
import DateSelect from './DateSelect.vue'

export default {
  data: () => ({
    date: null,
    date2: null,
    time1: null,
    time2: null,
    timelength: null
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
