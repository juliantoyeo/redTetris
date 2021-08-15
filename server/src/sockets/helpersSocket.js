import { SOCKET_EVENTS } from '../constants/socketConstants'

export const helpersSocket = (clients, rooms, io, socket) => {

	socket.on('emit_room', ({ roomName, emitEvent, dataToSent = {}}) => {
		io.to(roomName).emit(emitEvent, dataToSent);
	});

	socket.on("disconnect", () => {
		const index = clients.findIndex((client) => client.id === socket.id);
		if (index != -1) {
			const client = clients[index];
			if (client.connected) {
				const roomIndex = rooms.findIndex((room) => room.players.find((player) => player.name === client.name));
				if (roomIndex !== -1) {
					const roomOwner = rooms[roomIndex];
					
					if (roomOwner.players.length === 1) {
						rooms.splice(roomIndex, 1)
						io.sockets.emit(SOCKET_EVENTS.DELETE_ROOM, roomOwner.name);
					}
					else {
						roomOwner.removePlayer(client.name);
						io.sockets.emit(SOCKET_EVENTS.UPDATE_ROOM, roomOwner);
					}
				}
			}
			clients.splice(index, 1);
		}
	});

};