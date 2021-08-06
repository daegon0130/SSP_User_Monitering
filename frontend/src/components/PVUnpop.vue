<template>
  <v-app>
    <v-container>
      <div>비인기 페이지 조회</div>
      <v-select
        v-model="time"
        :items="items"
        item-text="dis"
        item-value="key"
        label="기간"
        outlined
        v-on:change="sendTimeLength(); changedate(); sendDate()"
    ></v-select>
    <v-btn v-on:click="getData(); load()">
      조회
    </v-btn>
    <v-data-table
    :headers="headers"
    :items="datacollection"
    :items-per-page="10"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    class="elevation-1"
    :loading="loading"
    loading-text="Loading... Please wait"
  ></v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      time: '2021-08',
      loading: true,
      sortBy: 'num',
      sortDesc: false,
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
      ],
      headers: [
        {
          text: '대메뉴',
          align: 'start',
          sortable: false,
          value: 'page'
        },
        { text: '소메뉴', value: 'subpage' },
        { text: 'PV', value: 'num' }
      ],
      datacollection: []
    }
  },
  methods: {
    async getData () {
      const res = await axios.post('http://localhost:3000/api/v/page', { time: this.time })
      this.datacollection = res.data.elements
      this.loading = false
    },
    load () {
      this.loading = true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
