<template>
  <div>
    <v-radio-group row v-model = "radio" mandatory>
      <v-radio
        v-on:click="getData(); fillData()"
        label="전체보기"
        value="1"/>
      <v-radio
        v-on:click="getData(); fillData()"
        label="그룹별 보기"
        value="2"/>
      <v-radio
        v-on:click="getData(); fillData()"
        label="제휴사별 보기"
        value="3"/>
    </v-radio-group>
    <v-btn v-if="this.show" v-on:click="calcDate() ">
      조회
    </v-btn>
    <line-chart :chart-data="datacollection" :timeLength="this.timeLength" :options="this.options" />
    <div class="right">
    <v-radio-group v-if="this.show" row v-model = "radio1" mandatory>
      <v-radio
        v-on:click="getData(); fillData()"
        label="숫자보기"
        value="0"/>
      <v-radio
        v-on:click="getData(); fillData()"
        label="비율보기"
        value="1"/>
    </v-radio-group>
    </div>
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
    timeLength: String,
    show: Boolean
  },
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      radio: null,
      radio1: null,
      realdata: {},
      options: {
        title: {
          display: true,
          text: 'UV'
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: this.timeLength,
                displayFormats: {
                  hour: 'HH:mm',
                  day: 'MM/DD',
                  week: 'MM/DD',
                  month: 'M 월'
                }
              },
              scaleLabel: {
                display: true,
                labelString: '기간'
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Unique Visitors'
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.getData()
    this.fillData()
  },
  methods: {
    fillData () {
      if (this.radio === '1') {
        var labels = this.realdata.elements.map(function (e) { return e.time })
        var data1 = this.realdata.elements.map(function (e) { return Number(e.all) })
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
        var labels1 = this.realdata.elements.map(function (e) { return e.time })
        var datagroup11 = this.realdata.elements.map(function (e) { return Number(e['1']) })
        var datagroup12 = this.realdata.elements.map(function (e) { return Number(e['2']) })
        var datagroup13 = this.realdata.elements.map(function (e) { return Number(e['3']) })
        var datagroup14 = this.realdata.elements.map(function (e) { return Number(e['4']) })
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
        console.log('data:' + this.realdata.elements)
        var labels2 = this.realdata.elements.map(function (e) { return e.time })
        var datagroup21 = this.realdata.elements.map(function (e) { return Number(e['1']) })
        var datagroup22 = this.realdata.elements.map(function (e) { return Number(e['2']) })
        var datagroup23 = this.realdata.elements.map(function (e) { return Number(e['3']) })
        var datagroup24 = this.realdata.elements.map(function (e) { return Number(e['4']) })
        var datagroup25 = this.realdata.elements.map(function (e) { return Number(e['5']) })
        var datagroup26 = this.realdata.elements.map(function (e) { return Number(e['6']) })
        var datagroup27 = this.realdata.elements.map(function (e) { return Number(e['7']) })
        var datagroup28 = this.realdata.elements.map(function (e) { return Number(e['8']) })
        var datagroup29 = this.realdata.elements.map(function (e) { return Number(e['9']) })
        var datagroup30 = this.realdata.elements.map(function (e) { return Number(e['10']) })
        var datagroup31 = this.realdata.elements.map(function (e) { return Number(e['11']) })
        var datagroup32 = this.realdata.elements.map(function (e) { return Number(e['12']) })
        var datagroup33 = this.realdata.elements.map(function (e) { return Number(e['13']) })
        var datagroup34 = this.realdata.elements.map(function (e) { return Number(e['14']) })
        var datagroup35 = this.realdata.elements.map(function (e) { return Number(e['15']) })
        var datagroup36 = this.realdata.elements.map(function (e) { return Number(e['16']) })
        var datagroup37 = this.realdata.elements.map(function (e) { return Number(e['17']) })
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
            },
            {
              label: this.$store.getters.getById('0000005'),
              borderColor: 'rgb(0, 105, 236)',
              pointBackgroundColor: 'rgb(0, 105, 236)',
              fill: false,
              data: datagroup25,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000006'),
              borderColor: 'rgb(32, 0, 236)',
              pointBackgroundColor: 'rgb(32, 0, 236)',
              fill: false,
              data: datagroup26,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000007'),
              borderColor: 'rgb(32, 105, 0)',
              pointBackgroundColor: 'rgb(32, 105, 0)',
              fill: false,
              data: datagroup27,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000008'),
              borderColor: 'rgb(211, 105, 23)',
              pointBackgroundColor: 'rgb(211, 105, 23)',
              fill: false,
              data: datagroup28,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000009'),
              borderColor: 'rgb(14, 111, 236)',
              pointBackgroundColor: 'rgb(14, 111, 236)',
              fill: false,
              data: datagroup29,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000010'),
              borderColor: 'rgb(32, 14, 111)',
              pointBackgroundColor: 'rgb(32, 14, 111)',
              fill: false,
              data: datagroup30,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000011'),
              borderColor: 'rgb(236, 14, 11)',
              pointBackgroundColor: 'rgb(236, 14, 11)',
              fill: false,
              data: datagroup31,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000012'),
              borderColor: 'rgb(121, 64, 36)',
              pointBackgroundColor: 'rgb(121, 64, 36)',
              fill: false,
              data: datagroup32,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000013'),
              borderColor: 'rgb(21, 155, 91)',
              pointBackgroundColor: 'rgb(21, 155, 91)',
              fill: false,
              data: datagroup33,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000014'),
              borderColor: 'rgb(43, 105,36)',
              pointBackgroundColor: 'rgb(43, 105,36)',
              fill: false,
              data: datagroup34,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000015'),
              borderColor: 'rgb(123, 5, 36)',
              pointBackgroundColor: 'rgb(123, 5, 36)',
              fill: false,
              data: datagroup35,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000016'),
              borderColor: 'rgb(132, 205, 36)',
              pointBackgroundColor: 'rgb(132, 205, 36)',
              fill: false,
              data: datagroup36,
              tension: 0.1
            },
            {
              label: this.$store.getters.getById('0000017'),
              borderColor: 'rgb(231, 55, 36)',
              pointBackgroundColor: 'rgb(231, 55, 36)',
              fill: false,
              data: datagroup37,
              tension: 0.1
            }
          ]
        }
      }
    },
    async getData (startdate, enddate, timeunit, group) {
      if (this.timeLength === 'hour') {
        const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: this.date + ' ' + this.time1 + ':00', endDate: this.date2 + ' ' + this.time2 + ':00', timeUnit: this.timeLength, group: Number(this.radio), ratio: Number(this.radio1) })
        console.log(this.date + ' ' + this.time1 + ':00')
        this.realdata = res.data
        this.fillData()
      } else {
        const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: this.date, endDate: this.date2, timeUnit: this.timeLength, group: Number(this.radio), ratio: Number(this.radio1) })
        console.log(this.date, this.date2, this.timeLength, this.radio, this.radio1)
        this.realdata = res.data
        console.log(this.realdata)
        this.fillData()
      }
    },
    changetimelength () {
      this.options.scales.xAxes[0].time.unit = this.timeLength
    },
    calcDate () {
      var d1 = Date.parse(this.date)
      var d2 = Date.parse(this.date2)
      if (this.timeLength === 'day') {
        if (d2 - d1 > 2592000000) {
          alert('30일 이내의 기간만 검색 가능합니다.')
        } else {
          console.log(d2 - d1)
          this.getData()
          this.fillData()
          this.changetimelength()
        }
      } else if (this.timeLength === 'week') {
        if (d2 - d1 > 7257600000) {
          alert('12주 이내의 기간만 검색 가능합니다.')
        } else {
          this.getData()
          this.fillData()
          this.changetimelength()
        }
      } else if (this.timeLength === 'hour') {
        if (d2 - d1 > 172800000) {
          alert('2일 이내의 기간만 검색 가능합니다.')
        } else {
          this.getData()
          this.fillData()
          this.changetimelength()
        }
      } else {
        this.getData()
        this.fillData()
        this.changetimelength()
      }
    }
  },
  computed: {

  }
}
</script>

<style>
  .right {
    float: right;
  }
</style>
