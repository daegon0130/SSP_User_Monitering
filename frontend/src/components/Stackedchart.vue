<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data: () => ({
    chartdata: {
      labels: ['8', '9', '10', '11', '12', '13', '14', '15'],
      datasets: [
        {
          label: '대시보드',
          backgroundColor: '#f87979',
          data: [40, 35, 37, 90, 52, 34, 56, 60]
        },
        {
          label: '상품관리',
          backgroundColor: '#3D5B96',
          data: [21, 18, 29, 52, 20, 13, 32, 39]
        },
        {
          label: '판매관리',
          backgroundColor: '#1EFFFF',
          data: [32, 15, 37, 62, 31, 14, 35, 42]
        },
        {
          label: '정산관리',
          backgroundColor: '#e1ff1e',
          data: [32, 15, 37, 62, 31, 14, 35, 42]
        },
        {
          label: '고객관리',
          backgroundColor: '#1effbf',
          data: [32, 15, 37, 62, 31, 14, 35, 42]
        },
        {
          label: '통계관리',
          backgroundColor: '#ff1ef0',
          data: [32, 15, 37, 62, 31, 14, 35, 42]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'PV'
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: '기간 (일)'
            },
            stacked: true
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Number of Page Views'
            },
            stacked: true
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
