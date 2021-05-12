import Game from '../class/Game';
import { SOCKET_RES, SOCKET_EVENTS } from '../../client/src/constants/socketConstants'

export const roomsSocket = (clients, rooms, io, socket) => {

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

	socket.on(SOCKET_EVENTS.CREATE_ROOM, (data, callback) => {
		const { name, owner, maxPlayer } = data.newRoom;
		if (rooms.findIndex((room) => room.name == data.newRoom.name) == -1) {
			const playerIndex = clients.findIndex((client) => client.name == data.playerName);
			if (playerIndex == -1) {
				callback({
					status: 404,
					msg: SOCKET_RES.PLAYER_NOT_EXIST
				});
			}
			else {
				const newRoom = new Game({ name, owner, players: [clients[playerIndex]], maxPlayer });
				rooms.push(newRoom);
				callback({
					status: 200,
					msg: SOCKET_RES.ROOM_CREATED,
					room: newRoom
				});
				clients[playerIndex].update({ connected: true });
				// console.log('created room', rooms);
				socket.join(newRoom.name);
				io.sockets.emit(SOCKET_EVENTS.CREATE_ROOM, newRoom); // emits to every client
			}
		}
		else {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_NAME_EXIST
			});
		}
	});

	socket.on(SOCKET_EVENTS.UPDATE_ROOM, (data, callback) => {
		const index = rooms.findIndex((room) => room.name == data.roomName);

		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else {
			const room = rooms[index];
			const player = clients.find((client) => client.name == data.playerName);
			if (data.isJoinRoom && room.players.length > 0) {
				// const playerIndex = clients.findIndex((client) => client.name == data.playerName);
				player.update({ connected: true });
				room.addPlayer(player);
				socket.join(data.roomName);
			}
			else {
				player.update({ connected: false });
				room.removePlayer(data.playerName)
				socket.leave(data.roomName);
			}

			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_UPDATED,
				room
			});
			// io.to(data.roomName).emit('roomInfo', data.playerName);
			// console.log('updatedRoom room', room);
			io.sockets.emit(SOCKET_EVENTS.UPDATE_ROOM, room);
		}
	});

	socket.on(SOCKET_EVENTS.DELETE_ROOM, (data, callback) => {
		const index = rooms.findIndex((room) => room.name == data.roomName);
		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else {
			const player = clients.find((client) => client.name == data.playerName);
			player.update({ connected: false });
			rooms.splice(index, 1);
			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_DELETED
			});
			// console.log('deleted room', index, rooms);
			socket.leave(data.roomName);
			io.to(data.roomName).emit('delete-room');
			io.sockets.emit(SOCKET_EVENTS.DELETE_ROOM, data.roomName);
		}
	});

	socket.on(SOCKET_EVENTS.FECTH_ALL_ROOM, (callback) => {
		callback({
			status: 200,
			msg: 'SUCCESS',
			rooms
		});
	});
};