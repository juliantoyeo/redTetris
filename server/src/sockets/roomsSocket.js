import Game from '../class/Game';
import Player from '../class/Player';
import { SOCKET_RES, SOCKET_EVENTS } from '../constants/socketConstants';
import { PIECE_STACK_LENGTH, STACK_LIMIT, BOARD_SIZE } from '../constants/gameConstant';

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
		const { name, owner, maxPlayer, gameMode } = data.newRoom;
		if (rooms.findIndex((room) => room.name == name) == -1) {
			const playerIndex = clients.findIndex((client) => client.name == data.playerName);
			if (playerIndex == -1) {
				callback({
					status: 404,
					msg: SOCKET_RES.PLAYER_NOT_EXIST
				});
			}
			else {
				const newRoom = new Game({ name, owner, players: [clients[playerIndex]], maxPlayer, gameMode });
				rooms.push(newRoom);
				callback({
					status: 200,
					msg: SOCKET_RES.ROOM_CREATED,
					room: newRoom
				});
				clients[playerIndex].update({ connected: true });
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
			const clientIndex = clients.findIndex((client) => client.name == data.playerName);
			const player = clients[clientIndex];

			if (data.isJoinRoom && room.players.length > 0) {
				player.update({ connected: true });
				room.addPlayer(player);
				socket.join(data.roomName);
			}
			else {
				player.update({ connected: false });
				room.removePlayer(data.playerName)
				socket.leave(data.roomName);
				clients.splice(clientIndex, 1, new Player({ id: socket.id, name: player.name }));
			}

			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_UPDATED,
				room
			});
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
			const clientIndex = clients.findIndex((client) => client.name == data.playerName);
			const player = clients[clientIndex];
			player.update({ connected: false });
			rooms.splice(index, 1);
			callback({
				status: 200,
				msg: SOCKET_RES.ROOM_DELETED
			});
			socket.leave(data.roomName);
			clients.splice(clientIndex, 1, new Player({ id: socket.id, name: player.name }));

			io.to(data.roomName).emit('delete-room');
			io.sockets.emit(SOCKET_EVENTS.DELETE_ROOM, data.roomName);
		}
	});

	socket.on(SOCKET_EVENTS.START_GAME, (roomName, callback) => {
		const index = rooms.findIndex((room) => room.name == roomName);
		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else {
			const currentRoom = rooms[index];

			currentRoom.update({ isStarted: true })
			currentRoom.pieces.generatePieces(PIECE_STACK_LENGTH);
			currentRoom.players.forEach((player) => player.createBoard());
			io.to(roomName).emit(SOCKET_EVENTS.START_GAME, currentRoom);
			io.sockets.emit(SOCKET_EVENTS.UPDATE_ROOM, currentRoom);
			callback({
				status: 200,
				msg: 'SUCCESS'
			});
		}
	});

	socket.on(SOCKET_EVENTS.UPDATE_BOARD, ( { newBoard, roomName, gameStatus }, callback) => {
		const index = rooms.findIndex((room) => room.name == roomName);
		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else if (!newBoard || rooms[index].players.findIndex((player) => player.id === socket.id) == -1 ) {
			callback({
				status: 405,
				msg: 'ERROR'
			});
		}
		else {
			const selectedRoom = rooms[index];
			const selectedPlayer = selectedRoom.players.find((player) => player.id === socket.id);
			
			selectedPlayer.update({
        board: newBoard,
        gameStatus
      });
			callback({
				status: 200,
				msg: 'SUCCESS'
			});
			io.to(roomName).emit(SOCKET_EVENTS.UPDATE_ROOM, selectedRoom);
		}
	});

	socket.on(SOCKET_EVENTS.UPDATE_STACK_INDEX, (currentPlayer, roomName, callback) => {
		const roomIndex = rooms.findIndex((room) => room.name == roomName);

		if (roomIndex == -1) {
			callback({
				status: 405,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else {
			const player = rooms[roomIndex].players.find((player) => player.name === currentPlayer.name);

			player.update({ stackIndex: currentPlayer.stackIndex });
			io.to(roomName).emit(SOCKET_EVENTS.UPDATE_ROOM, rooms[roomIndex]);
			callback({
				status: 200,
				msg: 'UPDATED'
			});
		}
	});

	socket.on(SOCKET_EVENTS.GET_NEW_STACK, (currPlayer, roomName, stackVersion, callback) => {
		const index = rooms.findIndex((room) => room.name == roomName);

		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else {
			const currentRoom = rooms[index];
			
			// console.log(currPlayer.name, "with stackIndex : ", currPlayer.stackIndex, " requested for new stack" );
			// console.log("current stack version", currentRoom.pieces.version);
			if (currentRoom.pieces.stack.length === currPlayer.stackIndex + 1 && stackVersion === currentRoom.pieces.version) {
				// if (currentRoom.pieces.stack.length === currPlayer.stackIndex + 1) {
				// console.log(currPlayer.name, "successfully get new stack and checking the lowestIndex" );
				currentRoom.pieces.generatePieces(PIECE_STACK_LENGTH);

				let lowestIndex = currentRoom.players[0].stackIndex;
				currentRoom.players.map((player) => {
					console.log(player.name, player.stackIndex);
					if (lowestIndex > player.stackIndex) {
						lowestIndex = player.stackIndex
					}
				})
				// console.log("lowestIndex", lowestIndex);
				if (lowestIndex > STACK_LIMIT) {
					currentRoom.pieces.stack.splice(0, STACK_LIMIT);
					currentRoom.players.map((player) => { player.stackIndex -= STACK_LIMIT })
					// console.log("lowestIndex > STACK_LIMIT, the stack will be deleted")
				}

				io.to(roomName).emit(SOCKET_EVENTS.UPDATE_ROOM, currentRoom);
			}
			// console.log("currentRoom.pieces.stack.length", currPlayer.name, currentRoom.pieces.stack.length, "\n");
			callback({
				status: 200,
				msg: 'SUCCESS'
			});
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