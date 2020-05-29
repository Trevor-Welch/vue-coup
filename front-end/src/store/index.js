import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player_id: 0,
    socket: null,
    current_room: null
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket
    },
    SET_PLAYER_ID(state, id) {
      state.player_id = id
    },
    SET_CURRENT_ROOM(state, room) {
      state.current_room = room
    }
  },
  actions: {
    async connectToServer({ commit }) {
      const socket = await io('http://localhost:3000')

      socket.on('setPlayerId', data => {
        commit('SET_PLAYER_ID', data)
      })

      socket.on('goToRoom', room => {
        console.log('Being sent into the game room!')
        commit('SET_CURRENT_ROOM', room)
        router.push({ path: `/room/${room}` })
      })

      commit('SET_SOCKET', socket)
    },
    leaveRoom(store, room) {
      if (room !== null) {
        console.log('Leaving room...')
        store.commit('SET_CURRENT_ROOM', null)
        store.state.socket.emit('leaveRoom', room)
      }
    }
  },
  modules: {
  }
})
