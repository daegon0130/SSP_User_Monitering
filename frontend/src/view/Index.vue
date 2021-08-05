
<template>
<v-app>
  <div id="app">
    <v-container>
      <menus/>
      <v-layout>
        <v-flex xs6>
          <div>실시간 활성 사용자</div>
      <v-container>
        <v-radio-group row v-model="radios3" mandatory>
          <v-radio
          label= "그룹별 UV 구성비율"
          value= "1"
          ></v-radio>
          <v-radio
          label= "제휴사별 UV 구성비율"
          value= "2"
          ></v-radio>
          <Piechart v-if="radios3 === '1'"/>
          <Piechart1 v-if="radios3 === '2'"/>
        </v-radio-group>
      </v-container>
        </v-flex>
      <v-flex xs6>
        <div>희원 모니터</div>
        <account-chart :date="this.date" :date2="this.date2" :time1="this.time1" :time2="this.time2" :timeLength="this.timelength" :show=false />
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
import Piechart from './Piechart.vue'
import Piechart1 from './Piechart1.vue'
// import Piechart3 from './Piechart3.vue'
import PVChart from './PVChart.vue'
import AccountChart from './AccountChart.vue'
import UVChart from './UVChart.vue'
import Menus from './Menus.vue'

export default {
  name: 'App',
  components: {
    Piechart,
    Piechart1,
    // Piechart3,
    PVChart,
    AccountChart,
    UVChart,
    Menus
  },
  data () {
    return {
      radios: null,
      radios2: null,
      radios3: null,
      radios4: null,
      date: (new Date((Date.now() - 2036800000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
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
