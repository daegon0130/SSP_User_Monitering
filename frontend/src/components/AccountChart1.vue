<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    chartdata: {
      labels: [8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: '관리자',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          data: [15, 15, 15, 15, 16, 16, 16, 16],
          fill: false,
          tension: 0.1
        },
        {
          label: '제휴현업',
          borderColor: 'rgb(102, 205, 86)',
          pointBackgroundColor: 'rgb(102, 205, 86)',
          data: [37, 38, 39, 39, 40, 40, 39, 42],
          fill: false,
          tension: 0.1
        },
        {
          label: '제휴',
          borderColor: 'rgb(255, 205, 86)',
          pointBackgroundColor: 'rgb(255, 205, 86)',
          data: [38, 40, 41, 44, 48, 48, 49, 55],
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
