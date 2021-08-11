<template>
<v-app>
<v-container>
    <v-row justify="center">
        <v-col
        cols="4"
        sm="4"
    >
    <v-select
        v-model="time"
        :items="items"
        item-text="dis"
        item-value="key"
        label="주 선택"
        outlined
        v-on:change="calcDate(); sendDate()"
    ></v-select>
        </v-col>
    </v-row>
    <heatmap ref="foo" :width="1200" :height="500" :date="this.time" :date2="this.time1"/>
</v-container>
</v-app>
</template>

<script>
import Heatmap from './Heatmap.vue'
export default {
  components: { Heatmap },
  props: {
    timelength: String,
    datetype: String
  },
  data: () => ({
    itemsuv: [
      { dis: '시간', key: 'hour' },
      { dis: '일', key: 'day' },
      { dis: '주', key: 'week' },
      { dis: '월', key: 'month' }
    ],
    itemspv: [
      { dis: '일', key: 'day' },
      { dis: '주', key: 'week' }
    ],
    itemsacc: [
      { dis: '일', key: 'day' },
      { dis: '주', key: 'week' },
      { dis: '월', key: 'month' }
    ],
    props: {
      datetype: String
    },
    time: '2020-07-26',
    time1: '2020-08-02',
    items: [
      { dis: '2020년 7월 26일 일요일 ~ 월요일', key: '2020-07-26' },
      { dis: '2020년 8월 2일 일요일 ~ 월요일', key: '2020-08-02' },
      { dis: '2020년 8월 9일 일요일 ~ 월요일', key: '2020-08-09' },
      { dis: '2020년 8월 16일 일요일 ~ 월요일', key: '2020-08-16' },
      { dis: '2020년 8월 23일 일요일 ~ 월요일', key: '2020-08-23' },
      { dis: '2020년 8월 30일 일요일 ~ 월요일', key: '2020-08-30' },
      { dis: '2020년 9월 6일 일요일 ~ 월요일', key: '2020-09-06' },
      { dis: '2020년 9월 13일 일요일 ~ 월요일', key: '2020-09-13' },
      { dis: '2020년 9월 20일 일요일 ~ 월요일', key: '2020-09-20' },
      { dis: '2020년 9월 27일 일요일 ~ 월요일', key: '2020-09-27' },
      { dis: '2020년 10월 4일 일요일 ~ 월요일', key: '2020-10-04' },
      { dis: '2020년 10월 11일 일요일 ~ 월요일', key: '2020-10-11' },
      { dis: '2020년 10월 18일 일요일 ~ 월요일', key: '2020-10-18' },
      { dis: '2020년 10월 25일 일요일 ~ 월요일', key: '2020-10-25' },
      { dis: '2020년 11월 1일 일요일 ~ 월요일', key: '2020-11-01' },
      { dis: '2020년 11월 8일 일요일 ~ 월요일', key: '2020-11-08' },
      { dis: '2020년 11월 15일 일요일 ~ 월요일', key: '2020-11-15' },
      { dis: '2020년 11월 22일 일요일 ~ 월요일', key: '2020-11-22' },
      { dis: '2020년 11월 29일 일요일 ~ 월요일', key: '2020-11-29' },
      { dis: '2020년 12월 6일 일요일 ~ 월요일', key: '2020-12-06' },
      { dis: '2020년 12월 13일 일요일 ~ 월요일', key: '2020-12-13' },
      { dis: '2020년 12월 20일 일요일 ~ 월요일', key: '2020-12-20' },
      { dis: '2020년 12월 27일 일요일 ~ 월요일', key: '2020-12-27' }
    ]
  }),
  methods: {
    calcDate () {
      var date = new Date(this.time)
      this.time1 = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10)
      this.$refs.foo.getData(this.time, this.time1, 'hour', 1, 0)
    }
  }
}
</script>

<style>

.center {
    line-height: 80px;
}
</style>
