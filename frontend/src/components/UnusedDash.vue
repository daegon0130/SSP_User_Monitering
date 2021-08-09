<template>
  <v-container>
    <pie-chart-2 :chartData="this.datacollection"/>
  </v-container>
</template>

<script>
import PieChart2 from './PieChart2.vue'
import axios from 'axios'

export default {
  components: {
    PieChart2
  },
  data () {
    return {
      datacollection: null,
      radio: '2',
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
    console.log(this.datacollection)
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: [
          '장기 미접속 계정',
          '접속 계정'
        ],
        datasets: [{
          label: '미사용 계정',
          data: [this.realdata.inactive_user, this.realdata.group['1'] + this.realdata.group['2'] + this.realdata.group['3'] + this.realdata.group['4'] - this.realdata.inactive_user],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ]
        }]
      }
    },
    async getData (startdate, enddate, timeunit, group) {
      const res = await axios.get('http://localhost:3000/api/user')
      this.realdata = res.data
      this.fillData()
      console.log(this.realdata)
    },
    changetimelength () {
      this.options.scales.xAxes[0].time.unit = this.timeLength
    }
  }
}
</script>

<style>
.top {
  text-align: left;
  padding: 15px;
  margin-bottom: 20px;
}
.left {
  text-align: left;
  padding: 15px;
  margin-bottom: 10px;
}
</style>
