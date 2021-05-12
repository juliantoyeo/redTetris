import Player from '../class/Player';
import { SOCKET_RES, SOCKET_EVENTS } from '../../client/src/constants/socketConstants'

export const playersSocket = (clients, socket) => {

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
		// console.log('create player', clients);
		// socket.emit('createPlayer', playerData);
	});

	socket.on('updatePlayer', (currentPlayer, callback) => {
		const { connected, name } = currentPlayer;
		const index = clients.findIndex((client) => client.name == currentPlayer.name);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else {
			clients.splice(index, 1, {
				id: socket.id,
				connected,
				name,
			});
			callback({
				status: 200,
				msg: 'UPDATED'
			});
		}
		// console.log('update player', index, clients);
		socket.emit('updatePlayer', currentPlayer);
	});
};