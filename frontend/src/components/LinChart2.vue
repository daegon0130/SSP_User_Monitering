<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    chartdata: {
      labels: [8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: 'SK텔레콤',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
          fill: false,
          tension: 0.1
        },
        {
          label: '콘텐츠 웨이브',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
          fill: false,
          tension: 0.1
        },
        {
          label: '11번가',
          borderColor: 'rgb(255, 205, 86)',
          pointBackgroundColor: 'rgb(255, 205, 86)',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
          fill: false,
          tension: 0.1
        },
        {
          label: '기타',
          borderColor: 'rgb(102, 205, 86)',
          pointBackgroundColor: 'rgb(102, 205, 86)',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
          fill: false,
          tension: 0.1
        }
      ]
    },
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
            scaleLabel: {
              display: true,
              labelString: '기간 (일)'
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Number of  Unique Visitors'
            }
          }
        ]
      }
    }
  }),
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
