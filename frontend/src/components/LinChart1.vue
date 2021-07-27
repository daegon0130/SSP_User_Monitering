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
          data: [53, 39, 62, 45, 49, 38, 12, 40],
          fill: false,
          tension: 0.1
        },
        {
          label: '제휴',
          borderColor: 'rgb(255, 205, 86)',
          pointBackgroundColor: 'rgb(255, 205, 86)',
          data: [540, 510, 460, 600, 520, 349, 441, 691],
          fill: false,
          tension: 0.1
        },
        {
          label: '제휴현업',
          borderColor: 'rgb(102, 205, 86)',
          pointBackgroundColor: 'rgb(102, 205, 86)',
          data: [350, 282, 375, 400, 412, 170, 300, 500],
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
