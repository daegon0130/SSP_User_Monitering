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
