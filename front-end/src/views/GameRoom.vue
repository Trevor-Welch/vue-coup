<template>
  <div>
    <h2>Game Room #{{room_id}}</h2>
    <RoomPlayerList :room_id="room_id" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoomPlayerList from '../components/RoomPlayerList.vue'

export default {
  name: 'GameRoom',
  components: {
    RoomPlayerList
  },
  computed: mapState(['socket', 'current_room']),
  data() {
    return {
      room_id: this.$route.params.room_id
    }
  },
  mounted() {
    console.log('Welcome to room:', this.room_id)
  },
  destroyed() {
    this.$store.dispatch('leaveRoom', this.current_room)
  }
}
</script>

<style lang="scss" scoped>
</style>
