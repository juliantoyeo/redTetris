export const playersSocket = (clients, socket) => {

	socket.on('createPlayer', (playerData, callback) => {
		const { name, roomName } = playerData;
		if (clients.findIndex((client) => client.name == playerData.name) == -1) {
			clients.push({
				name,
				roomName,
			});
			callback({
				status: 200,
				msg: 'CONNECTED'
			});
		}
		else {
			callback({
				status: 404,
				msg: 'NAME_EXIST'
			});
		}
		console.log('create player', clients);
		socket.emit('createPlayer', playerData);
	});

	socket.on('updatePlayer', (currentPlayer, callback) => {
		const { connected, name, roomName } = currentPlayer;
		const index = clients.findIndex((client) => client.name == currentPlayer.name);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else if (clients.findIndex((client) => client.roomName == currentPlayer.roomName) != -1) {
			callback({
				status: 405,
				msg: 'ROOM_EXIST'
			});
		}
		else {
			clients.splice(index, 1, {
				connected,
				name,
				roomName,
			});
			callback({
				status: 200,
				msg: 'UPDATED'
			});
		}
		console.log('update player', index, clients);
		socket.emit('updatePlayer', currentPlayer);
	});
};