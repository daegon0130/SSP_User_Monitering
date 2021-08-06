<template>
  <v-app>
    <v-container>
      <div>미접속 계정 조회</div>
    <v-data-table
    :headers="headers"
    :items="datacollection"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [
        {
          text: '번호',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: '그룹', value: 'group' },
        { text: '제휴사', value: 'company' },
        { text: '아이디', value: 'id' },
        { text: '미접속 기간', value: 'inactive_term' },
        { text: '최근 접속 일시', value: 'recent_history' }
      ],
      datacollection: null
    }
  },
  methods: {
    async getData () {
      const res = await axios.post('http://localhost:3000/api/v/user')
      this.datacollection = res.data.elements
      this.fillData()
    }
  }
}
</script>
