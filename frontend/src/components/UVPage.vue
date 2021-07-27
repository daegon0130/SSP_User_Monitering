<template>
  <v-app>
    <div>
    <v-container>
      <date-select @receiveDate="receiveDate" />
      <UVChart :date="this.date" :date2="this.date2" />
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
    date2: null
  }),
  components: {
    UVChart,
    DateSelect
  },
  methods: {
    receiveDate (date, date2) {
      this.date = date
      this.date2 = date2
    }
  }
}
</script>
