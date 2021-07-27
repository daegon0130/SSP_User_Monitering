<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

// var realData = {}
/* var jsonfile = {
  users: [
    {
      DATE: '2021-07-08',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-09',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-10',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-11',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-12',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-13',
      ADM: '12',
      APR: '32',
      AFF: '40'
    },
    {
      DATE: '2021-07-14',
      ADM: '12',
      APR: '21',
      AFF: '40'
    },
    {
      DATE: '2021-07-15',
      ADM: '12',
      APR: '32',
      AFF: '40'
    }
  ]
}
var jsonfile1 = {
  users: [
    {
      DATE: '2021-07-08',
      '0000001': 43,
      '0000002': 41,
      '0000003': 43,
      '0000004': 44,
      '0000005': 47
    },
    {
      DATE: '2021-07-09',
      '0000001': 41,
      '0000002': 43,
      '0000003': 44,
      '0000004': 47,
      '0000005': 45
    },
    {
      DATE: '2021-07-10',
      '0000001': 30,
      '0000002': 41,
      '0000003': 32,
      '0000004': 26,
      '0000005': 39
    },
    {
      DATE: '2021-07-11',
      '0000001': 12,
      '0000002': 35,
      '0000003': 47,
      '0000004': 22,
      '0000005': 33
    },
    {
      DATE: '2021-07-12',
      '0000001': 43,
      '0000002': 43,
      '0000003': 43,
      '0000004': 43,
      '0000005': 43
    },
    {
      DATE: '2021-07-13',
      '0000001': 43,
      '0000002': 43,
      '0000003': 43,
      '0000004': 43,
      '0000005': 43
    },
    {
      DATE: '2021-07-14',
      '0000001': 43,
      '0000002': 43,
      '0000003': 43,
      '0000004': 43,
      '0000005': 43
    },
    {
      DATE: '2021-07-15',
      '0000001': 43,
      '0000002': 43,
      '0000003': 43,
      '0000004': 43,
      '0000005': 43
    }
  ]
}
var labels = jsonfile.users.map(function (e) {
  return e.DATE
})
var clilabels = jsonfile1.users.map(function (e) {
  return e.DATE
})
var dataall = jsonfile.users.map(function (e) {
  return Number(e.ADM) + Number(e.APR) + Number(e.AFF)
})
var datagroupadm = jsonfile.users.map(function (e) {
  return Number(e.ADM)
})
var datagroupapr = jsonfile.users.map(function (e) {
  return Number(e.APR)
})
var datagroupAFF = jsonfile.users.map(function (e) {
  return Number(e.AFF)
})
var datagroup1 = jsonfile1.users.map(function (e) {
  return Number(e['0000001'])
})
var datagroup2 = jsonfile1.users.map(function (e) {
  return Number(e['0000002'])
})
var datagroup3 = jsonfile1.users.map(function (e) {
  return Number(e['0000003'])
})
var datagroup4 = jsonfile1.users.map(function (e) {
  return Number(e['0000004'])
})
var datagroup5 = jsonfile1.users.map(function (e) {
  return Number(e['0000005'])
})
*/

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    date: String,
    date2: String
  },
  data: () => ({
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
            type: 'time',
            time: {
              unit: 'day',
              unitStepSize: 1
            },
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
