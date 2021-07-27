<template>
  <div>
    <v-radio-group v-model = "radio" mandatory>
      <v-radio
        label="전체보기"
        value="1"/>
      <v-radio
        label="그룹별 보기"
        value="2"/>
      <v-radio
        label="제휴사별 보기"
        value="3"/>
    </v-radio-group>
    <v-btn v-on:click="fillData; getData">
      조회
    </v-btn>
    <line-chart :chart-data="datacollection" />
  </div>
</template>

<script>
import LineChart from './LineChart.vue'
import axios from 'axios'

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
  props: {
    date: String,
    date2: String,
    time1: String,
    time2: String,
    timeLength: String
  },
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      radio: null,
      realdata: {
        result: 'success',
        elements: [1, 1, 1, 2]
      }

    }
  },
  mounted () {
    this.fillData()
    this.getData()
  },
  methods: {
    fillData () {
      if (this.radio === '1') {
        this.datacollection = {
          labels: [1, 2, 3, 4],
          datasets: [
            {
              label: '전체',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: this.realdata.elements
            }
          ]
        }
      } else if (this.radio === '2') {
        this.datacollection = {
          // labels: labels,
          datasets: [
            {
              label: '관리자',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: this.realdata.elements.map(function (e) { return Number(e['1']) })
            },
            {
              label: '제휴',
              borderColor: 'rgb(255, 205, 86)',
              pointBackgroundColor: 'rgb(255, 205, 86)',
              fill: false,
              data: this.realdata.elements.map(function (e) { return Number(e['2']) })
            },
            {
              label: '제휴현업',
              borderColor: 'rgb(102, 205, 86)',
              pointBackgroundColor: 'rgb(102, 205, 86)',
              fill: false,
              data: this.realdata.elements.map(function (e) { return Number(e['3']) })
            },
            {
              label: '기타',
              borderColor: 'rgb(102, 205, 86)',
              pointBackgroundColor: 'rgb(102, 205, 86)',
              fill: false,
              data: this.realdata.elements.map(function (e) { return Number(e['4']) })
            }
          ]
        }
      } else if (this.radio === '3') {
        this.datacollection = {
          // labels: clilabels,
          datasets: [
            {
              label: this.$store.getters.getById('0000001'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false
              // data: datagroup1
            },
            {
              label: this.$store.getters.getById('0000002'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false
              // data: datagroup2
            },
            {
              label: this.$store.getters.getById('0000003'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false
              // data: datagroup3
            },
            {
              label: this.$store.getters.getById('0000004'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false
              // data: datagroup4
            },
            {
              label: this.$store.getters.getById('0000005'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false
              // data: datagroup5
            }
          ]
        }
      }
    },
    async getData (startdate, enddate, timeunit, group) {
      const res = await axios.post('http://localhost:3000/api/v/uv', { startDate: this.date, endDate: this.date2, timeUnit: this.timeLength, group: Number(this.radio) })
      // this.realdata = res.data
      console.log(res.data)
    }
  },
  computed: {

  }
}
</script>
