<script>
import axios from 'axios'
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    date: null,
    date2: null
  },
  data: () => ({
    realdata: {},
    outline: [
      { time: '00:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '01:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '02:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '03:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '04:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '05:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '06:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '07:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '08:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '09:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '10:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '11:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '12:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '13:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '14:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '15:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '16:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '17:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '18:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '19:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '20:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '21:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '22:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 },
      { time: '23:00', Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 }
    ],
    options: {
      responsive: false,
      title: {
        display: true,
        text: '방문시간대별 사용자 수',
        fontSize: 15
      },
      scales: {
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: '시간'
          }
        }],
        yAxes: [{
          barPercentage: 1.0,
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: '일         월         화         수         목         금         토',
            fontSize: 17
          },
          ticks: {
            display: false
          }
        }]
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItems, data) {
            return data.datasets[tooltipItems[0].datasetIndex].label + ', ' + tooltipItems[0].xLabel
          }
        }
      },
      legend: {
        display: false
      }
    },
    labels: null,
    data1: null,
    datacollection: null,
    count: 0,
    rgb: '0, 175, 221'
  }),
  methods: {
    fillData () {
      var labels = this.outline.map(function (e) { return e.time })
      var data1 = this.outline.map(function (e) { return Number(e.Sun) })
      var data2 = this.outline.map(function (e) { return Number(e.Mon) })
      var data3 = this.outline.map(function (e) { return Number(e.Tue) })
      var data4 = this.outline.map(function (e) { return Number(e.Wed) })
      var data5 = this.outline.map(function (e) { return Number(e.Thu) })
      var data6 = this.outline.map(function (e) { return Number(e.Fri) })
      var data7 = this.outline.map(function (e) { return Number(e.Sat) })
      this.datacollection = {
        labels: labels,
        datasets: [
          {
            label: 'Sun',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data2,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Mon',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data3,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Tue',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data1,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Wed',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data4,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Thu',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data5,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Fri',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data6,
            tension: 0.1,
            barPercentage: 1.25
          },
          {
            label: 'Sat',
            backgroundColor: this.generateDatasetColors(this.realdata.elements, 10),
            fill: false,
            data: data7,
            tension: 0.1,
            barPercentage: 1.25
          }
        ]
      }
    },
    generateDatasetColors: function (valuesArray, scale) {
      var colors = []
      for (let i = 0; i < 24; i++) {
        var value = valuesArray[this.count].all
        var opacity = value / scale
        if (opacity > 1) {
          opacity = 1
        }
        colors.push('rgba(' + this.rgb + ', ' + opacity + ')')
        this.count = this.count + 1
      }
      console.log(colors)
      return colors
    },
    async getData (startdate, enddate, timeunit, group, ratio) {
      const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: startdate, endDate: enddate, timeUnit: 'hour', group: 1, ratio: 0 })
      this.realdata = res.data
      this.fillData()
      this.renderChart(this.datacollection, this.options)
      this.count = 0
    },
    receiveDate (date, date1) {
      this.date = date
      this.date1 = date1
    }
  },
  mounted () {
    this.getData(this.date, this.date2, 'hour', 1, 0)
  }
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
