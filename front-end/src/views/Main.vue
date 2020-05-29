<template>
  <div id="main">
    <p>
      This is browser-based version of the card game
      <a
        href="https://boardgamegeek.com/boardgame/131357/coup"
      >Coup</a> written in VueJS.
    </p>
    <h2>Join a Game</h2>
    <p>Join a game in session or create a new one!</p>
    <input :style="{background: room_error ? 'red' : ''}" type="text" v-model="join_room" />
    <button @click="joinRoom">Join Room</button>
    <button @click="createNewRoom">Start a New Room</button>
    <button @click="logRooms">Log Room List</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Main',
  computed: mapState(['socket']),
  data() {
    return {
      join_room: null,
      room_error: false
    }
  },
  methods: {
    createNewRoom() {
      this.socket.emit('createNewRoom')
    },

    joinRoom() {
      this.socket.on('cantFindRoom', () => {
        this.room_error = true
        this.socket.off('cantFindRoom')
      })

      this.socket.emit('joinRoom', this.join_room)
    },

    logRooms() {
      this.socket.on('giveRoomList', data => {
        console.log(data)
        this.socket.off('giveRoomList')
      })

      this.socket.emit('getRoomList')
    }
  }
}
</script>
