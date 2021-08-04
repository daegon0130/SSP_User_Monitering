<template>
  <v-app>
    <v-container>
      <v-layout>
        <v-flex xs6>
          <v-radio-group row v-model="radio" mandatory>
            <v-radio
              label="그룹별 보기"
              value="3"
            ></v-radio>
            <v-radio
              label="제휴사별 보기"
              value="1"
            ></v-radio>
            <v-radio
              label="미접속 계정 보기"
              value="2"
            ></v-radio>
          </v-radio-group>
          <piechart-1 v-if="radio === '1'"/>
          <piechart-3 v-if="radio === '2'"/>
          <piechart v-if="radio === '3'"/>
        </v-flex>
        <v-flex xs6>
          <v-container>
          <v-card
            class="top"
            max-width="344"
            outlined
          >
          전체 사용자 수
          <span style="float:right;">
            140
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          관리자 수
          <span style="float:right;">
            15
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          제휴 계정 수
          <span style="float:right;">
            62
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          제휴 현업 계정 수
          <span style="float:right;">
            62
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          기타 계정 수
          <span style="float:right;">
            20
          </span>
          </v-card>
          <v-card
            class="left"
            max-width="344"
            outlined
          >
          90일 미접속 계정 수
          <span style="float:right;">
            5
          </span>
          </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Piechart1 from './Piechart1.vue'
import Piechart3 from './Piechart3.vue'
import Piechart from './Piechart.vue'

export default {
  data () {
    return {
      radio: null
    }
  },
  components: {
    Piechart1,
    Piechart3,
    Piechart
  }
}
</script>

<style>
.top {
  text-align: left;
  padding: 15px;
  margin-bottom: 20px;
}
.left {
  text-align: left;
  padding: 15px;
  margin-bottom: 10px;
}

</style>
