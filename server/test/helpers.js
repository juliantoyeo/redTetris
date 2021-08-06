import * as server from '../src/index'

import { SOCKET_EVENTS, SOCKET_RES } from '../src/constants/socketConstants'

import Game from '../src/class/Game'

export const startServer = (params, cb) => {
	server.create(params)
		.then(server => cb(null, server))
		.catch(err => cb(err))
}

export const createPlayerTest = (socket, playerName, nextAction = () => { }) => {
	if (socket) socket.emit(SOCKET_EVENTS.CREATE_PLAYER, playerName, (res) => {
		if (res.msg === SOCKET_RES.PLAYER_CREATED) {
			const playerFound = server.clients.find((client) => client.id === socket.id);

			expect(res.player.name).toBe(playerName);
			expect(playerFound.name).toBe(playerName);
			nextAction();
		} else {
			console.log('error while creating player');
			return;
		}
	});
}

export const createRoomTest = (socket, dataNewRoom, nextAction = () => { }) => {
	if (socket) socket.emit(SOCKET_EVENTS.CREATE_ROOM, dataNewRoom, (res) => {
		if (res.msg === SOCKET_RES.ROOM_CREATED) {
			const roomFound = server.rooms.find((room) => room.name === dataNewRoom.newRoom.name);

			expect(roomFound).toBeInstanceOf(Game);
			expect(roomFound).toMatchObject(dataNewRoom.newRoom);
			nextAction();
		} else {
			console.log('error while creating room');
			return;
		}
	});
}

export const startGameTest = (socket, roomName, nextAction = () => { }) => {
	if (socket) socket.emit(SOCKET_EVENTS.START_GAME, roomName, (res) => {
		if (res.status === 200) {
			const roomFound = server.rooms.find((room) => room.name === roomName);

			expect(roomFound).toHaveProperty('isStarted', true);
			expect(roomFound.pieces).toHaveProperty('version', 1);
			expect(roomFound.pieces.stack).toHaveLength(2);
			nextAction();
		} else {
			console.log('error while starting game');
			return;
		}
	});
}
