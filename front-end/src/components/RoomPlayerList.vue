
<template>
  <div>
    <h3>Player List</h3>
    <p>{{ this.player_list || "Oops, no players" }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RoomPlayerList',
  computed: mapState(['socket']),
  data() {
    return {
      player_list: ''
    }
  },
  props: {
    room_id: {
      type: String,
      required: true
    }
  },
  mounted() {
    // Retrieve player list

    this.socket.on('givePlayerList', data => {
      console.log('Recieving new player list...')
      console.log('RECIEVIED LIST:', data)
      this.player_list = data
    })

    console.log('Just mounted, grabbing the player list!:', this.room_id)
    this.socket.emit('getPlayerList', this.room_id)
  },
  destroyed() {
    this.socket.off('givePlayerList')
  }
}
</script>

<style lang="scss" scoped>
</style>
