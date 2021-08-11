<template>
  <v-app>
    <v-container>
      <div>비인기 페이지 조회</div>
      <date-select-month @receiveDate="receiveDate" @sendTimeLength="receiveTimeLength" @receiveTime="receiveTime" :datetype="'pop'" :timelength="'month'"/>
    <v-btn v-on:click="getData(); load()">
      조회
    </v-btn>
    </v-container>
    <v-container>
    <v-data-table
    :headers="headers"
    :items="datacollection"
    :items-per-page="10"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    class="elevation-1"
    :loading="loading"
    loading-text="Loading... Please wait"
  ></v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import DateSelectMonth from './DateSelectMonth.vue'

export default {
  components: { DateSelectMonth },
  data () {
    return {
      time: '2021-01',
      time1: '2021-08',
      loading: true,
      sortBy: 'num',
      sortDesc: false,
      items: [
        { dis: '2021년 1월', key: '2021-01' },
        { dis: '2021년 2월', key: '2021-02' },
        { dis: '2021년 3월', key: '2021-03' },
        { dis: '2021년 4월', key: '2021-04' },
        { dis: '2021년 5월', key: '2021-05' },
        { dis: '2021년 6월', key: '2021-06' },
        { dis: '2021년 7월', key: '2021-07' },
        { dis: '2021년 8월', key: '2021-08' },
        { dis: '2021년 9월', key: '2021-09' },
        { dis: '2021년 10월', key: '2021-10' },
        { dis: '2021년 11월', key: '2021-11' },
        { dis: '2021년 12월', key: '2021-12' }
      ],
      headers: [
        {
          text: '대메뉴',
          align: 'start',
          sortable: false,
          value: 'page'
        },
        { text: '소메뉴', value: 'subpage' },
        { text: 'PV', value: 'num' }
      ],
      datacollection: []
    }
  },
  methods: {
    async getData () {
      // const res = await axios.post('http://localhost:3000/api/v/page', { time: this.time })
      const res = await axios.post('http://localhost:3000/api/v/page', { startMonth: this.time, endMonth: this.time1 })
      this.datacollection = res.data.elements
      this.loading = false
    },
    load () {
      this.loading = true
    },
    receiveDate (date, date2) {
      this.time = date
      this.time1 = date2
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
  .right {
    float: right
  }
</style>
