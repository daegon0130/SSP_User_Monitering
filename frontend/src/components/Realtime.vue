<template>
<v-app>
  <v-container>
    <v-layout>
      <v-flex xs6>
    <v-btn
      color="success"
    >
      <v-icon>
        mdi-refresh
      </v-icon>
      새로고침
    </v-btn>
    </v-flex>
    <v-flex xs6>
    <v-select
        class="right"
        v-model="timelength"
        :items="items"
        item-text="dis"
        item-value="key"
        label="시간"
        outlined
        v-on:change="getData(); fillData()"
    ></v-select>
    </v-flex>
    </v-layout>
    <line-chart :chart-data="datacollection" :timeLength="this.timeLength" :options="this.options" />
  </v-container>
</v-app>
</template>

<script>
import LineChart from './LineChart.vue'
import axios from 'axios'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      realdata: {},
      date: null,
      date2: null,
      timelength: '10',
      timeLength: 'hour',
      items: [
        { dis: '4 시간', key: '4' },
        { dis: '6 시간', key: '6' },
        { dis: '8 시간', key: '8' },
        { dis: '10 시간', key: '10' },
        { dis: '12 시간', key: '12' },
        { dis: '13 시간', key: '13' },
        { dis: '14 시간', key: '14' },
        { dis: '18 시간', key: '18' },
        { dis: '24 시간', key: '24' }
      ],
      options: {
        title: {
          display: true,
          text: '실시간 활성 사용자'
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
                  day: 'MMM DD',
                  week: 'MM DD',
                  month: 'MMM'
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
      var labels = this.realdata.elements.map(function (e) { return e.time })
      var data1 = this.realdata.elements.map(function (e) { return Number(e.num) })
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
    },
    async getData () {
      const res = await axios.post('http://localhost:3000/api/v/realtime', { time: this.timelength })
      this.realdata = res.data
      this.fillData()
    }
  },
  computed: {

  }
}
</script>
<style>
  .right {
    float: right
  }
</style>
