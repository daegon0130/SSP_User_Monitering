<template>
<v-container>
    <v-row>
        <v-col
        cols="2"
    >
    <v-select
        v-if="this.datetype === 'uv'"
        v-model="timelength"
        :items="itemsuv"
        item-text="dis"
        item-value="key"
        label="기간"
        outlined
        v-on:change="sendTimeLength(); changedate(); sendDate()"
    ></v-select>
    <v-select
        v-if="this.datetype === 'pv'"
        v-model="timelength"
        :items="itemspv"
        item-text="dis"
        item-value="key"
        label="기간"
        outlined
        v-on:change="sendTimeLength(); changedate(); sendDate()"
    ></v-select>
    <v-select
        v-if="this.datetype === 'acc'"
        v-model="timelength"
        :items="itemsacc"
        item-text="dis"
        item-value="key"
        label="기간"
        outlined
        v-on:change="sendTimeLength(); changedate(); sendDate()"
    ></v-select>
        </v-col>
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
        v-on:change="sendTimeLength(); calcDate(); sendDate()"
    ></v-select>
        </v-col>
    <span class="center">~</span>
    <v-col
        cols="4"
        sm="3"
    >
    <v-select
        v-model="time1"
        :items="items"
        item-text="dis"
        item-value="key"
        label="주 선택"
        outlined
        v-on:change="sendTimeLength(); calcDate(); sendDate()"
    ></v-select>
    </v-col>
    </v-row>
</v-container>
</template>

<script>
export default {
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
    time: '2021-05-24',
    time1: '2021-08-09',
    items: [
      { dis: '2021년 1월 4일', key: '2021-01-04' },
      { dis: '2021년 1월 11일', key: '2021-01-11' },
      { dis: '2021년 1월 18일', key: '2021-01-18' },
      { dis: '2021년 1월 25일', key: '2021-01-25' },
      { dis: '2021년 2월 1일', key: '2021-02-01' },
      { dis: '2021년 2월 8일', key: '2021-02-08' },
      { dis: '2021년 2월 15일', key: '2021-02-15' },
      { dis: '2021년 2월 22일', key: '2021-02-22' },
      { dis: '2021년 3월 1일', key: '2021-03-01' },
      { dis: '2021년 3월 8일', key: '2021-03-08' },
      { dis: '2021년 3월 15일', key: '2021-03-15' },
      { dis: '2021년 3월 22일', key: '2021-03-22' },
      { dis: '2021년 3월 29일', key: '2021-03-29' },
      { dis: '2021년 4월 5일', key: '2021-04-05' },
      { dis: '2021년 4월 12일', key: '2021-04-12' },
      { dis: '2021년 4월 19일', key: '2021-04-19' },
      { dis: '2021년 4월 26일', key: '2021-04-26' },
      { dis: '2021년 5월 3일', key: '2021-05-03' },
      { dis: '2021년 5월 10일', key: '2021-05-10' },
      { dis: '2021년 5월 17일', key: '2021-05-17' },
      { dis: '2021년 5월 24일', key: '2021-05-24' },
      { dis: '2021년 5월 31일', key: '2021-05-31' },
      { dis: '2021년 6월 7일', key: '2021-06-07' },
      { dis: '2021년 6월 14일', key: '2021-06-14' },
      { dis: '2021년 6월 21일', key: '2021-06-21' },
      { dis: '2021년 6월 28일', key: '2021-06-28' },
      { dis: '2021년 7월 5일', key: '2021-07-05' },
      { dis: '2021년 7월 12일', key: '2021-07-12' },
      { dis: '2021년 7월 19일', key: '2021-07-19' },
      { dis: '2021년 7월 26일', key: '2021-07-27' },
      { dis: '2021년 8월 2일', key: '2021-08-02' },
      { dis: '2021년 8월 9일', key: '2021-08-09' },
      { dis: '2021년 8월 16일', key: '2021-08-16' },
      { dis: '2021년 8월 23일', key: '2021-08-23' },
      { dis: '2021년 8월 30일', key: '2021-08-30' },
      { dis: '2021년 9월 6일', key: '2021-09-06' }
    ]
  }),
  methods: {
    sendDate () {
      this.$emit('receiveDate', this.time, this.time1)
    },
    calcDate () {
      var d1 = Date.parse(this.time)
      var d2 = Date.parse(this.time1)
      if (d1 > d2) {
        this.time = this.time1
      }
    },
    sendTimeLength () {
      this.$emit('sendTimeLength', this.timelength)
    }
  },
  mounted () {
    this.sendDate()
    this.sendTimeLength()
  }
}
</script>

<style>

.center {
    line-height: 80px;
}
</style>
