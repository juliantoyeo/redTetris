import Player from '../class/Player';
import { SOCKET_RES, SOCKET_EVENTS } from '../constants/socketConstants'

export const playersSocket = (clients, rooms, io, socket) => {

	socket.on(SOCKET_EVENTS.CREATE_PLAYER, (playerName, callback) => {
		if (clients.findIndex((client) => client.name == playerName) == -1) {
			const player = new Player({ id: socket.id, name: playerName })

			clients.push(player);
			callback({
				status: 200,
				msg: SOCKET_RES.PLAYER_CREATED,
				player
			});
		}
		else {
			callback({
				status: 404,
				msg: SOCKET_RES.PLAYER_NAME_EXIST
			});
		}
	});

	socket.on(SOCKET_EVENTS.SET_PLAYER_GAME_OVER, (roomName, callback) => {
		const index = rooms.findIndex((room) => room.name == roomName);
		if (index == -1) {
			callback({
				status: 404,
				msg: SOCKET_RES.ROOM_DOESNT_EXIST
			});
		}
		else if (rooms[index].players.findIndex((player) => player.id === socket.id) == -1 ) {
			callback({
				status: 405,
				msg: 'ERROR'
			});
		}
		else {
			const selectedRoom = rooms[index];
			const selectedPlayer = selectedRoom.players.find((player) => player.id === socket.id);
			
			selectedPlayer.update({ gameOver: true });
			const playersLeft = selectedRoom.players.filter(player => player.gameOver === false);
			
			io.to(roomName).emit(SOCKET_EVENTS.UPDATE_ROOM, selectedRoom);

			if (playersLeft.length ===  1 || (selectedRoom.players.length === 1)) {
				io.to(roomName).emit(SOCKET_EVENTS.GAME_IS_OVER, playersLeft[0]);
			}

			callback({
				status: 200,
				msg: 'SUCCESS'
			});
		}
	});

};