<template>
  <v-app>
    <div>
    <v-container>
      <date-select @receiveDate="receiveDate" />
      <account-chart :date="this.date" :date2="this.date2" />
    </v-container>
    </div>
  </v-app>
</template>

<script>
import AccountChart from './AccountChart.vue'
import DateSelect from './DateSelect.vue'

export default {
  data: () => ({
    date: null,
    date2: null
  }),
  components: {
    AccountChart,
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
