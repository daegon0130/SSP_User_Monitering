<template>
  <v-app>
    <v-container>
      <div>미접속 계정 조회</div>
    <v-data-table
    @click:row="rowClick"
    :headers="headers"
    :items="datacollection"
    :items-per-page="15"
    :item-class="itemBackground"
    class="elevation-1"
  >
  </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [
        { text: '그룹', value: 'group' },
        { text: '제휴사', value: 'company' },
        { text: '아이디', value: 'id' },
        { text: '미접속 기간', value: 'inactive_term' },
        { text: '최 접속 일시', value: 'recent_history', formatter: this.formatDate }
      ],
      datacollection: []
    }
  },
  methods: {
    async getData () {
      const res = await axios.get('http://localhost:3000/api/user/unused')
      this.datacollection = res.data.elements
      this.fillData()
      this.search()
    },
    itemBackground: function (item) {
      if (item.inactive_term >= 90) {
        return 'no'
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
.no {
  background-color: rgb(255, 114, 118)
}

</style>
