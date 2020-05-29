const Express = require("express")()
const Http = require('http').Server(Express)
const Socketio = require("socket.io")(Http)

let new_id = 0


let database = {
  players: [/*
    {
      player_id: PLAYER'S ID NUMBER
      socket_id: PLAYER'S SOCKET
      current_channel: ROOM_1234
    }
  */],
  rooms: [/*
    {
      room_id: ROOM ID
      channel_id: CHANNEL ID
      player_list: [
        PLAYER'S ID NUMBER
      ]
    }
  */]
}

const getPlayer = ( socket_id ) => {
  return database.players.find(player =>{
    return player.socket_id == socket_id
  })
}

const getRoom = ( room_id ) => {
  return database.rooms.find(room =>{
    return room.room_id == room_id
  })
}

const getRoomByChanneld = ( channel_id ) => {
  const room_id = channel_id.slice(5)
  console.log(room_id)
  return database.rooms.find(room =>{
    return room.room_id == room_id
  })
}

const makeNewPlayer = ( socket_id ) => {
  new_id++
  database.players.push({
    socket_id,
    player_id: new_id
  })
  console.log("SOCKET_ID:", socket_id)
  console.log("PLAYER_ID:", new_id)
  return new_id
}

const removePlayer = ( socket_id ) => {
  database.players = database.players.filter(player => player.socket_id !== socket_id)
  console.log("Player disconnecting...")
}

let room_id = 0

const updateGameRoomPlayerList = async ( socket, channel_id ) => {
  if (channel_id == undefined) { return }
  const room = getRoomByChanneld(channel_id)
  console.log('Generating a new player list...')
  let player_list = []

  await Socketio.in(channel_id).clients((err, clients) => {
    player_list = clients
  })

  player_list = player_list.map((player) => {
    return String(getPlayer(player).player_id)
  })
  console.log('CHANNEL_ID:', channel_id)
  console.log('PLAYER_LIST:', player_list)
  room.player_list = player_list
  socket.to(channel_id).emit('givePlayerList', room.player_list)
}


const joinGameRoom = async ( socket, room_id ) => {
  const player = getPlayer( socket.id )
  const room = getRoom( room_id )
  if( room ){
    console.log('Player ' + player.player_id + ' joined Room ' + room_id )
    const channel_id = room.channel_id
    player.current_channel = channel_id
    socket.join(channel_id)
    socket.emit('goToRoom', room_id)
    await updateGameRoomPlayerList( socket, channel_id )
  } else {
    socket.emit('cantFindRoom', room_id)
  }
}

// Add a new room to the database
const createNewGameRoom = () => {
  room_id++
  database.rooms.push({
    room_id,
    channel_id: 'room_'+String(room_id),
    player_list: 'Holy shit you did it!'
  }) 

  console.log('New room created...')
  console.log('ROOM_ID:', room_id)
  return room_id
}

// Returns a list of all players in the desired room
const getPlayerList = ( room_id ) => {
  const room = getRoom( room_id)
  if (room) {
    return room.player_list
  }
  return undefined
}




// SOCKET STUFF
Socketio.on("connection", socket => {
  console.log("A player is connnecting...")

  //Get player list
  socket.on('getPlayerList', (room_id) => {
    console.log('Returning player list for room:', room_id)
    const player_list = getPlayerList(room_id)
    socket.emit('givePlayerList', player_list)
  })

  //For when someone needs the room list
  socket.on('getRoomList', () => {
    socket.emit('giveRoomList', database.rooms)
  })

  //New Room
  socket.on('createNewRoom', () => {
    const room_id = createNewGameRoom()
    joinGameRoom(socket, room_id)
  })

  //Join Room
  socket.on('joinRoom', room_id => {
    joinGameRoom(socket, room_id)
  })

  //Leave Room
  socket.on('leaveRoom', () => {
    const player = getPlayer(socket.id)
    const channel_id = player.current_channel
    console.log('Player ' + player.player_id + ' left ' + channel_id )
    socket.leave(channel_id )
    updateGameRoomPlayerList( socket, channel_id )
  })

  //Disconnect
  socket.on('disconnect', () => {
    const player = getPlayer(socket.id)
    const channel_id = player.current_channel
    console.log('Player ' + player.player_id + ' left ' + channel_id )
    socket.leave(channel_id )
    updateGameRoomPlayerList( socket, channel_id )
    removePlayer(socket.id)
  })

  //Give the user a player id
  socket.emit('setPlayerId', makeNewPlayer(socket.id) )
})

Http.listen(3000, () => {
    console.log("Server started on port 3000...")
})

