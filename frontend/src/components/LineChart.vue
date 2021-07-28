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
                week: 'MMM DD',
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
              labelString: 'Unique Visitors'
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
