import { SOCKET_RES, SOCKET_ACTIONS } from '../client/src/constants/socketConstants'

export const roomSocket = (rooms, io, socket) => {

	// io.of("/").adapter.on("create-room", (room) => {
	// 	console.log(`adapter: room ${room} was created`);
	// });

	// io.of("/").adapter.on("join-room", (room, id) => {
	// 	console.log(`adapter: socket ${id} has joined room ${room}`);
	// });

	// io.of("/").adapter.on("leave-room", (room, id) => {
	// 	console.log(`adapter: socket ${id} has leaved room ${room}`);
	// });

	// io.of("/").adapter.on("delete-room", (room, id) => {
	// 	console.log(`adapter: socket ${id} has deleted room ${room}`);
	// });

	socket.on(SOCKET_ACTIONS.CREATE_ROOM, (newRoom, callback) => {
		const { owner, name, players, maxPlayer } = newRoom;
		if (rooms.findIndex((room) => room.name == newRoom.name) == -1) {
			rooms.push({
				owner,
				name,
				players,
				maxPlayer
			});
			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_CREATED
			});
			// console.log('created room', rooms);
			socket.join(newRoom.name);
			io.sockets.emit(SOCKET_ACTIONS.CREATE_ROOM, newRoom); // emits to every client
		}
		else {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_NAME_EXIST
			});
		}
	});
	
	socket.on(SOCKET_ACTIONS.UPDATE_ROOM, (updatedRoom, isJoinRoom, callback) => {
		const { owner, name, players, maxPlayer } = updatedRoom;
		const index = rooms.findIndex((room) => room.name == updatedRoom.name);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else {
			(isJoinRoom && players.length > 0) ? socket.join(updatedRoom.name) : socket.leave(updatedRoom.name);
			rooms.splice(index, 1, {
				owner,
				name,
				players,
				maxPlayer
			});
			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_UPDATED
			});
			// io.to(updatedRoom.name).emit('create', updatedRoom.name);
			io.sockets.emit(SOCKET_ACTIONS.UPDATE_ROOM, updatedRoom);
		}
	});

	socket.on(SOCKET_ACTIONS.DELETE_ROOM, (roomName, callback) => {
		const index = rooms.findIndex((room) => room.name == roomName);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else {
			rooms.splice(index, 1);
			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_DELETED
			});
			// console.log('deleted room', index, rooms);
			socket.leave(roomName);
			io.to(roomName).emit('delete-room');
			io.sockets.emit(SOCKET_ACTIONS.DELETE_ROOM, roomName);
		}
	});

	socket.on(SOCKET_ACTIONS.FECTH_ALL_ROOM, (callback) => {
		callback({
			status: 200,
			msg: 'SUCCESS',
			rooms
		});
	});
};