<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    chartdata: {
      labels: [8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: '전체',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          data: [90, 93, 95, 98, 104, 104, 104, 113],
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Account Number'
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
              labelString: 'Number of Accounts'
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
