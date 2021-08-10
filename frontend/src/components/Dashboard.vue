
<template>
<v-app>
  <div id="app">
    <v-container>
      <v-layout>
        <v-flex xs6>
          <div>희원 모니터</div>
          <account-chart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=false />
        </v-flex>
      <v-flex xs6>
        <div>미접속 계정</div>
        <v-container>
        <unused-dash />
      </v-container>
      </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs6>
          <div>활성 사용자(UV)</div>
          <v-container>
            <UVChart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=false />
      </v-container>
        </v-flex>
        <v-flex xs6>
          <div>활성 페이지(PV)</div>
      <PVChart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=false />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  </v-app>
</template>

<script>
import PVChart from './PVChart.vue'
import AccountChart from './AccountChart.vue'
import UVChart from './UVChart.vue'
import UnusedDash from './UnusedDash.vue'

export default {
  name: 'App',
  components: {
    PVChart,
    AccountChart,
    UVChart,
    UnusedDash
  },
  data () {
    return {
      radios: null,
      radios2: null,
      radios3: null,
      radios4: null,
      date: (new Date((Date.now() - 570304000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      time1: null,
      time2: null,
      timelength: 'day'
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
