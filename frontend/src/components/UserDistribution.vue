<template>
<v-app>
  <v-container>
    <v-layout>
      <v-flex xs6>
  <div>
    <v-radio-group row v-model = "radio" mandatory>
      <v-radio
        v-on:click="getData(); fillData()"
        label="그룹별 보기"
        value="2"/>
      <v-radio
        v-on:click="getData(); fillData()"
        label="제휴사별 보기"
        value="3"/>
    </v-radio-group>
    <pie-chart-2 :chartData="this.datacollection"/>
  </div>
      </v-flex>
      <v-flex xs6>
          <v-container>
          <v-card
            class="top"
            max-width="344"
            outlined
          >
          전체 사용자 수
          <span style="float:right;">
            {{ this.realdata.group['1'] + this.realdata.group['2'] + this.realdata.group['3'] + this.realdata.group['4'] }}
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          관리자 수
          <span style="float:right;">
            {{ this.realdata.group['1'] }}
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          제휴 계정 수
          <span style="float:right;">
            {{ this.realdata.group['2'] }}
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          제휴 현업 계정 수
          <span style="float:right;">
            {{ this.realdata.group['3'] }}
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          기타 계정 수
          <span style="float:right;">
            {{ this.realdata.group['4'] }}
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          90일 미접속 계정 수
          <span style="float:right;">
            {{ this.realdata.inactive_user }}
          </span>
          </v-card>
          </v-container>
        </v-flex>
    </v-layout>
  </v-container>
</v-app>
</template>

<script>
import PieChart2 from './PieChart2.vue'
import axios from 'axios'

export default {
  components: {
    PieChart2
  },
  data () {
    return {
      datacollection: null,
      radio: '2',
      realdata: {},
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
                  week: 'MM DD',
                  month: 'MMM'
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
    }
  },
  mounted () {
    this.getData()
    this.fillData()
    console.log(this.datacollection)
  },
  methods: {
    fillData () {
      if (this.radio === '2') {
        this.datacollection = {
          labels: [
            '관리자',
            '제휴 현업',
            '제휴사',
            '기타'
          ],
          datasets: [{
            label: '사용자 분포',
            data: [this.realdata.group['1'], this.realdata.group['2'], this.realdata.group['3'], this.realdata.group['4']],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(102, 205, 86)'
            ]
          }]
        }
      } else if (this.radio === '3') {
        this.datacollection = {
          labels: [
            this.$store.getters.getById('0000001'),
            this.$store.getters.getById('0000002'),
            this.$store.getters.getById('0000003'),
            this.$store.getters.getById('0000004')
          ],
          datasets: [{
            label: '사용자 분포',
            data: [this.realdata.company['0000001'], this.realdata.company['0000002'], this.realdata.company['0000003'], this.realdata.company['0000004']],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(102, 205, 86)'
            ]
          }]
        }
      }
    },
    async getData (startdate, enddate, timeunit, group) {
      const res = await axios.get('http://localhost:3000/api/user')
      this.realdata = res.data
      this.fillData()
      console.log(this.realdata)
    },
    changetimelength () {
      this.options.scales.xAxes[0].time.unit = this.timeLength
    }
  }
}
</script>

<style>
.top {
  text-align: left;
  padding: 15px;
  margin-bottom: 20px;
}
.left {
  text-align: left;
  padding: 15px;
  margin-bottom: 10px;
}

</style>
