<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: [
    'chartData',
    'options',
    {
      date: String,
      date2: String,
      timeLength: String
    }],
  data: () => ({
  }),
  watch: {
    options: {
      handler (newOption, oldOption) {
        this.$data._chart.destroy()
        console.log('destroyed')
        this.renderChart(this.chartData, this.options)
      },
      deep: true
    }
  },
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
