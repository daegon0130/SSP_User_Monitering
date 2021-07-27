<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  data: () => ({
    chartdata: {
      labels: [
        'SK텔레콤', '콘텐츠 웨이브', '11번가', '드림어스', 'SK매직', '기타'
      ],
      datasets: [{
        label: '그룹별 UV',
        data: [1023, 342, 213, 323, 125, 2833],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(102, 205, 86)',
          'rgb(205, 255, 126)',
          'rgb(32, 45, 86)'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
