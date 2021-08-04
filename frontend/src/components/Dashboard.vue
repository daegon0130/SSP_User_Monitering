
<template>
<v-app>
  <div id="app">
    <v-container>
      <v-layout>
        <v-flex xs6>
          <div>실시간 활성 사용자</div>
      <v-container>
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
      </v-container>
        </v-flex>
      <v-flex xs6>
        <div>희원 모니터</div>
        <account-chart-1/>
      </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs6>
          <div>활성 사용자(UV)</div>
          <v-container>
        <LinChart v-if =" radios ==='1'"/>
        <LinChart1 v-if =" radios === '2'"/>
        <LinChart2 v-if =" radios === '3'"/>
        <v-radio-group v-model="radios" mandatory>
          <v-radio
          label='전체보기'
          value='1'
          ></v-radio>
          <v-radio
          label='제휴사별보기'
          value='2'
          ></v-radio>
          <v-radio
          label='그룹별보기'
          value='3'
          ></v-radio>
        </v-radio-group>
      </v-container>
        </v-flex>
        <v-flex xs6>
          <div>활성 페이지(PV)</div>
      <Stackedchart/>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <piechart-3/>
    </v-container>
  </div>
  </v-app>
</template>

<script>
import LinChart from './LinChart.vue'
import LinChart1 from './LinChart1.vue'
import LinChart2 from './LinChart2.vue'
import Stackedchart from './Stackedchart.vue'
import Piechart from './Piechart.vue'
import Piechart1 from './Piechart1.vue'
import AccountChart1 from './AccountChart1.vue'
import Piechart3 from './Piechart3.vue'
// import Menus from './Menus.vue'

export default {
  name: 'App',
  components: {
    LinChart,
    LinChart1,
    LinChart2,
    Stackedchart,
    Piechart,
    Piechart1,
    AccountChart1,
    Piechart3
  },
  data () {
    return {
      radios: null,
      radios2: null,
      radios3: null,
      radios4: null
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
