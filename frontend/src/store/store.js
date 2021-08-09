import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    client: [
      {
        id: '0000001',
        title: 'SK텔레콤(주)'
      },
      {
        id: '0000002',
        title: '11번가'
      },
      {
        id: '0000003',
        title: '콘텐츠웨이브'
      },
      {
        id: '0000004',
        title: '드림어스'
      },
      {
        id: '0000005',
        title: '원스토어'
      },
      {
        id: '0000006',
        title: 'SKT_구독미디어담당'
      },
      {
        id: '0000007',
        title: 'SKT_MR서비스 Co'
      },
      {
        id: '0000008',
        title: 'SK매직'
      },
      {
        id: '0000009',
        title: 'Google'
      },
      {
        id: '0000010',
        title: '엠앤서비스'
      },
      {
        id: '0000011',
        title: '티맵모빌리티(주)'
      },
      {
        id: '0000012',
        title: '(주)바디프랜드'
      },
      {
        id: '0000013',
        title: '스푼라디오'
      },
      {
        id: '0000014',
        title: 'AIA생명보험'
      },
      {
        id: '0000015',
        title: '(주)스포티비'
      },
      {
        id: '0000016',
        title: '모두의 셔틀'
      },
      {
        id: '0000017',
        title: '(주)어바웃펠'
      }
    ]
  },
  getters: {
    getById: (state) => (id) => {
      return state.client.find(cli => cli.id === id).title
    }
  },
  mutations: {
    addclient (state, cli) {
      state.client.push(cli)
    }
  }
})

export default store
