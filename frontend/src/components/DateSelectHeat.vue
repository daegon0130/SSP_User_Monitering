<template>
<v-app>
<v-container>
    <v-row justify="center">
        <v-col
        cols="4"
        sm="3"
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
    time: '2021-08-08',
    time1: '2021-08-15',
    items: [
      { dis: '2021년 1월 3일', key: '2021-01-03' },
      { dis: '2021년 1월 10일', key: '2021-01-10' },
      { dis: '2021년 1월 17일', key: '2021-01-17' },
      { dis: '2021년 1월 24일', key: '2021-01-24' },
      { dis: '2021년 1월 31일', key: '2021-01-31' },
      { dis: '2021년 2월 7일', key: '2021-02-07' },
      { dis: '2021년 2월 14일', key: '2021-02-14' },
      { dis: '2021년 2월 21일', key: '2021-02-21' },
      { dis: '2021년 2월 28일', key: '2021-02-28' },
      { dis: '2021년 3월 7일', key: '2021-03-07' },
      { dis: '2021년 3월 14일', key: '2021-03-14' },
      { dis: '2021년 3월 21일', key: '2021-03-21' },
      { dis: '2021년 3월 28일', key: '2021-03-28' },
      { dis: '2021년 4월 4일', key: '2021-04-04' },
      { dis: '2021년 4월 11일', key: '2021-04-11' },
      { dis: '2021년 4월 18일', key: '2021-04-18' },
      { dis: '2021년 4월 25일', key: '2021-04-25' },
      { dis: '2021년 5월 2일', key: '2021-05-02' },
      { dis: '2021년 5월 9일', key: '2021-05-09' },
      { dis: '2021년 5월 16일', key: '2021-05-16' },
      { dis: '2021년 5월 23일', key: '2021-05-23' },
      { dis: '2021년 5월 30일', key: '2021-05-30' },
      { dis: '2021년 6월 6일', key: '2021-06-06' },
      { dis: '2021년 6월 13일', key: '2021-06-13' },
      { dis: '2021년 6월 20일', key: '2021-06-20' },
      { dis: '2021년 6월 27일', key: '2021-06-27' },
      { dis: '2021년 7월 4일', key: '2021-07-04' },
      { dis: '2021년 7월 11일', key: '2021-07-11' },
      { dis: '2021년 7월 18일', key: '2021-07-18' },
      { dis: '2021년 7월 25일', key: '2021-07-25' },
      { dis: '2021년 8월 1일', key: '2021-08-01' },
      { dis: '2021년 8월 8일', key: '2021-08-08' },
      { dis: '2021년 8월 15일', key: '2021-08-15' },
      { dis: '2021년 8월 22일', key: '2021-08-22' },
      { dis: '2021년 8월 29일', key: '2021-08-29' },
      { dis: '2021년 9월 5일', key: '2021-09-05' }
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
