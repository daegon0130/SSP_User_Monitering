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
        label="달 선택"
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
        label="달 선택"
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
    time: '2021-01',
    time1: '2021-08',
    items: [
      { dis: '2021년 1월', key: '2021-01' },
      { dis: '2021년 2월', key: '2021-02' },
      { dis: '2021년 3월', key: '2021-03' },
      { dis: '2021년 4월', key: '2021-04' },
      { dis: '2021년 5월', key: '2021-05' },
      { dis: '2021년 6월', key: '2021-06' },
      { dis: '2021년 7월', key: '2021-07' },
      { dis: '2021년 8월', key: '2021-08' },
      { dis: '2021년 9월', key: '2021-09' },
      { dis: '2021년 10월', key: '2021-10' },
      { dis: '2021년 11월', key: '2021-11' },
      { dis: '2021년 12월', key: '2021-12' }
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
      console.log(d1, d2)
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
