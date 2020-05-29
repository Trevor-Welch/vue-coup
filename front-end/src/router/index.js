import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import GameRoom from '../views/GameRoom.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/room/:room_id',
    name: 'Room',
    component: GameRoom
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async(to, from, next) => {
  if (store.state.socket) {
    next()
  } else {
    console.log('Connecting to server...')
    await store.dispatch('connectToServer')
    console.log(store.state.socket)
    next()
  }
})

export default router
