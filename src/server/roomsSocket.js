export const roomSocket = (rooms, socket) => {

	socket.on('createRoom', (newRoom, callback) => {
		const { creator, name, players, maxPlayer } = newRoom;
		if (rooms.findIndex((room) => room.name == newRoom.name) == -1) {
			rooms.push({
				creator,
				name,
				players,
				maxPlayer
			});
			callback({
				status: 200,
				msg: 'CREATED'
			});
		}
		else {
			callback({
				status: 404,
				msg: 'NAME_EXIST'
			});
		}
		console.log('created room', rooms);
		socket.emit('createPlayer', newRoom);
	});

	socket.on('updateRoom', (updatedRoom, callback) => {
		const { creator, name, players, maxPlayer } = updatedRoom;
		const index = rooms.findIndex((room) => room.name == updatedRoom.name);
		if (index == -1) {
			callback({
				status: 404,
				msg: 'NAME_DOESNT_EXIST'
			});
		}
		else {
			rooms.splice(index, 1, {
				creator,
				name,
				players,
				maxPlayer
			});
			callback({
				status: 200,
				msg: 'UPDATED'
			});
		}
		console.log('updated room', index, rooms);
		socket.emit('updateRoom', updatedRoom);
	});

	socket.on('deleteRoom', (roomName, callback) => {
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
				msg: 'DELETED'
			});
		}
		console.log('deleted room', index, rooms);
		socket.emit('deleteRoom', roomName);
	});
};