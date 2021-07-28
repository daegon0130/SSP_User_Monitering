<template>
  <div>
    <v-radio-group v-model = "radio" mandatory>
      <v-radio
        label="전체보기"
        value="1"/>
      <v-radio
        label="그룹별 보기"
        value="2"/>
      <v-radio
        label="제휴사별 보기"
        value="3"/>
    </v-radio-group>
    <v-btn v-on:click="getData(); fillData() ">
      조회
    </v-btn>
    <line-chart :chart-data="datacollection" :timeLength="this.timeLength" />
  </div>
</template>

<script>
import LineChart from './LineChart.vue'
import axios from 'axios'

export default {
  props: {
    date: String,
    date2: String,
    time1: String,
    time2: String,
    timeLength: String
  },
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      radio: null,
      realdata: {}
    }
  },
  mounted () {
    this.getData()
    this.fillData()
  },
  methods: {
    fillData () {
      if (this.radio === '1') {
        var labels = this.realdata.map(function (e) { return e.time })
        var data1 = this.realdata.map(function (e) { return Number(e.all) })
        this.datacollection = {
          labels: labels,
          datasets: [
            {
              label: '전체',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: data1,
              tension: 0.1
            }
          ]
        }
      } else if (this.radio === '2') {
        var labels1 = this.realdata.map(function (e) { return e.time })
        var datagroup11 = this.realdata.map(function (e) { return Number(e['1']) })
        var datagroup12 = this.realdata.map(function (e) { return Number(e['2']) })
        var datagroup13 = this.realdata.map(function (e) { return Number(e['3']) })
        var datagroup14 = this.realdata.map(function (e) { return Number(e['4']) })
        this.datacollection = {
          labels: labels1,
          datasets: [
            {
              label: '관리자',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup11,
              tension: 0.1
            },
            {
              label: '제휴',
              borderColor: 'rgb(255, 205, 86)',
              pointBackgroundColor: 'rgb(255, 205, 86)',
              fill: false,
              data: datagroup12,
              tension: 0.1
            },
            {
              label: '제휴현업',
              borderColor: 'rgb(102, 205, 86)',
              pointBackgroundColor: 'rgb(102, 205, 86)',
              fill: false,
              data: datagroup13,
              tension: 0.1
            },
            {
              label: '기타',
              borderColor: 'rgb(32, 105, 236)',
              pointBackgroundColor: 'rgb(32, 105, 236)',
              fill: false,
              data: datagroup14,
              tension: 0.1
            }
          ]
        }
      } else if (this.radio === '3') {
        var labels2 = this.realdata.map(function (e) { return e.time })
        var datagroup21 = this.realdata.map(function (e) { return Number(e['1']) })
        var datagroup22 = this.realdata.map(function (e) { return Number(e['2']) })
        var datagroup23 = this.realdata.map(function (e) { return Number(e['3']) })
        var datagroup24 = this.realdata.map(function (e) { return Number(e['4']) })
        this.datacollection = {
          labels: labels2,
          datasets: [
            {
              label: this.$store.getters.getById('0000001'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup21,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000002'),
              borderColor: 'rgb(255, 205, 86)',
              pointBackgroundColor: 'rgb(255, 205, 86)',
              fill: false,
              data: datagroup22,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000003'),
              borderColor: 'rgb(102, 205, 86)',
              pointBackgroundColor: 'rgb(102, 205, 86)',
              fill: false,
              data: datagroup23,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000004'),
              borderColor: 'rgb(32, 105, 236)',
              pointBackgroundColor: 'rgb(32, 105, 236)',
              fill: false,
              data: datagroup24,
              tension: 0.1
            }
          ]
        }
      }
    },
    async getData (startdate, enddate, timeunit, group) {
      if (this.timeLength === 'hour') {
        const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: this.date, endDate: this.date2, timeUnit: this.timeLength, group: Number(this.radio) })
        this.realdata = res.data
      } else {
        const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: this.date, endDate: this.date2, timeUnit: this.timeLength, group: Number(this.radio) })
        this.realdata = res.data
      }
    }
  },
  computed: {

  }
}
</script>
