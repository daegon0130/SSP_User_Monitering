<template>
  <div>
    <v-radio-group v-model = "radio">
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
    <v-btn v-on:click="fillData">
      조회
    </v-btn>
    <line-chart :chart-data="datacollection" />
  </div>
</template>

<script>
import LineChart from './LineChart.vue'
// import test from '../data/test.json'

var jsonfile = {
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

export default {
  // private testdata = test,
  props: {
    date: String,
    date2: String
  },
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      radio: null
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      if (this.radio === '1') {
        this.datacollection = {
          labels: labels,
          datasets: [
            {
              label: '전체',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: dataall
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            }
          ]
        }
      } else if (this.radio === '2') {
        this.datacollection = {
          labels: labels,
          datasets: [
            {
              label: '관리자',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroupadm
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            },
            {
              label: '제휴',
              borderColor: 'rgb(255, 205, 86)',
              pointBackgroundColor: 'rgb(255, 205, 86)',
              fill: false,
              data: datagroupapr
              // data: [{ x: '07/08/2021', y: 70 }, { x: '07/09/2021', y: 75 }, { x: '07/10/2021', y: 78 }, { x: '07/011/2021', y: 78 }]
            },
            {
              label: '제휴현업',
              borderColor: 'rgb(102, 205, 86)',
              pointBackgroundColor: 'rgb(102, 205, 86)',
              fill: false,
              data: datagroupAFF
              // data: [{ x: '07/08/2021', y: 70 }, { x: '07/09/2021', y: 75 }, { x: '07/10/2021', y: 78 }, { x: '07/011/2021', y: 78 }]
            }
          ]
        }
      } else if (this.radio === '3') {
        this.datacollection = {
          labels: clilabels,
          datasets: [
            {
              label: this.$store.getters.getById('0000001'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup1
              // data: jsonfile1.users.map('0000001')
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            },
            {
              label: this.$store.getters.getById('0000002'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup2
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            },
            {
              label: this.$store.getters.getById('0000003'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup3
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            },
            {
              label: this.$store.getters.getById('0000004'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup4
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            },
            {
              label: this.$store.getters.getById('0000005'),
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              fill: false,
              data: datagroup5
              // data: [{ x: '07/08/2021', y: 175 }, { x: '07/09/2021', y: 175 }, { x: '07/10/2021', y: 178 }, { x: '07/11/2021', y: 178 }, { x: '07/12/2021', y: 178 }, { x: '07/13/2021', y: 178 }, { x: '07/14/2021', y: 178 }]
            }
          ]
        }
      }
    }
  },
  computed: {

  }
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
