<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    date: String,
    date2: String,
    timeLength: String
  },
  data: () => ({
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
            type: 'time',
            time: {
              unit: 'week',
              displayFormats: {
                hour: 'HH:mm',
                day: 'MM DD',
                week: 'MM DD',
                month: 'MM'
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
              labelString: 'Page Views'
            }
          }
        ]
      }
    }
  }),
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
