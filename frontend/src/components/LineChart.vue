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
              unit: 'day',
              displayFormats: {
                millisecond: 'MMM DD',
                second: 'MMM DD',
                minute: 'MMM DD',
                hour: 'MMM DD',
                day: 'MMM DD',
                wee: 'MMM DD',
                month: 'MMM DD',
                quarter: 'MMM DD',
                year: 'MMM DD'
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
