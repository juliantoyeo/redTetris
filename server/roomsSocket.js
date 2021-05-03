import { SOCKET_RES, SOCKET_ACTIONS } from '../client/src/constants/socketConstants'

export const roomSocket = (rooms, io, socket) => {

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
			console.log('created room', rooms);
			io.sockets.emit(SOCKET_ACTIONS.CREATE_ROOM, newRoom); // emits to every client
		}
		else {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_NAME_EXIST
			});
		}
	});

	socket.on(SOCKET_ACTIONS.UPDATE_ROOM, (updatedRoom, callback) => {
		const { owner, name, players, maxPlayer } = updatedRoom;
		const index = rooms.findIndex((room) => room.name == updatedRoom.name);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else {
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
			console.log('updated room', index, rooms);
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
			console.log('deleted room', index, rooms);
			io.sockets.emit(SOCKET_ACTIONS.DELETE_ROOM, roomName);
		}
	});
};