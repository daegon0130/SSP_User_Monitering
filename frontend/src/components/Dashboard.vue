
<template>
<v-app>
  <div id="app">
    <v-container>
      <v-container>
        <v-radio-group v-model="radios4" mandatory>
          <v-radio
          label= "전체보기"
          value= "1"
          ></v-radio>
          <v-radio
          label= "그룹별 보기"
          value= "2"
          ></v-radio>
        </v-radio-group>
        <AccountChart v-if="radios4 === '1'"/>
        <AccountChart1 v-if="radios4 === '2'"/>
      </v-container>
      <Stackedchart/>
      <v-container>
        <v-radio-group v-model="radios3" mandatory>
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
import AccountChart from './AccountChart.vue'
import AccountChart1 from './AccountChart1.vue'

export default {
  name: 'App',
  components: {
    LinChart,
    LinChart1,
    LinChart2,
    Stackedchart,
    Piechart,
    Piechart1,
    AccountChart,
    AccountChart1
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
