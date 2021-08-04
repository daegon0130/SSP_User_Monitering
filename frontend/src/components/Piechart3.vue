<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  data: () => ({
    chartdata: {
      labels: [
        '장기 미접속 계정', '접속 계정'
      ],
      datasets: [{
        label: '장기 미접속 계정 수',
        data: [21, 80],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)'
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
