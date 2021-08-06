import * as server from '../src/index.js';
import params from '../../client/src/params.js';

import Client from 'socket.io-client';

import { SOCKET_EVENTS, SOCKET_RES } from '../src/constants/socketConstants';
import { BOARD_SIZE } from '../src/constants/gameConstant.js';

import Player from '../src/class/Player.js';

import { createPlayerTest, createRoomTest, startGameTest, startServer } from './helpers.js';

describe('Red Tetris server tests', () => {
	let io, socket;

	beforeAll((done) => {
		startServer(params.server, (err, server) => {
			if (err) {
				console.log('error while starting server', err);
				done();
			}
			io = server;
			done();
		})
	});

	afterAll((done) => {
		io.stop(done);
	});

	beforeEach((done) => {
		socket = new Client(params.server.url);
		socket.on('connect', done);
	})

	afterEach((done) => {
		if (socket) socket.disconnect();
		done();
	})

	test('createPlayer', (done) => {
		createPlayerTest(socket, 'createPlayer', done);
	});

	test('createRoom', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest0',
				owner: 'createRoom',
				maxPlayer: 1
			},
			playerName: 'createRoom',
			isJoinRoom: true
		}

		createPlayerTest(socket, roomData.playerName);
		createRoomTest(socket, roomData, done);
	});

	test('playerDontExist', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest0bis',
				owner: 'playerDontExist',
				maxPlayer: 1
			},
			playerName: 'playerDontExist',
			isJoinRoom: true
		}

		socket.emit(SOCKET_EVENTS.CREATE_ROOM, roomData, (res) => {
			expect(res.msg).toBe(SOCKET_RES.PLAYER_NOT_EXIST);
			done();
		});
	});

	test('updateRoom', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest1',
				owner: 'updateRoom',
				maxPlayer: 2
			},
			playerName: 'updateRoom',
			isJoinRoom: true
		};
		const newPlayer = {
			roomName: roomData.newRoom.name,
			playerName: `${roomData.playerName}1`,
			isJoinRoom: true
		}
		const newPlayerSocket = new Client(params.server.url);

		createPlayerTest(socket, roomData.playerName);
		createRoomTest(socket, roomData);
		createPlayerTest(newPlayerSocket, newPlayer.playerName);
		const addPlayerInRoom = new Promise((resolve) => {
			newPlayerSocket.emit(SOCKET_EVENTS.UPDATE_ROOM, newPlayer, (res) => {
				if (res.msg === SOCKET_RES.ROOM_UPDATED) {
					const roomFound = server.rooms.find((room) => room.name === roomData.newRoom.name);
					const playerFoundInsideRoom = roomFound.players.find((player) => player.name === newPlayer.playerName);

					expect(playerFoundInsideRoom).toBeInstanceOf(Player);
					expect(playerFoundInsideRoom).toHaveProperty('name', newPlayer.playerName);
					expect(playerFoundInsideRoom).toHaveProperty('connected', newPlayer.isJoinRoom);
					resolve();
				} else {
					console.log('error while updating room (add)');
					return;
				}
			});
		});
		addPlayerInRoom.then(() => {
			newPlayerSocket.emit(SOCKET_EVENTS.UPDATE_ROOM, { ...newPlayer, isJoinRoom: false }, (res) => {
				if (res.msg === SOCKET_RES.ROOM_UPDATED) {
					const roomFound = server.rooms.find((room) => room.name === roomData.newRoom.name);
					const playerFoundInsideRoom = roomFound.players.findIndex((player) => player.name === newPlayer.playerName);

					expect(playerFoundInsideRoom).toBe(-1);
					expect(roomFound.players).toHaveLength(1);
					newPlayerSocket.disconnect();
					done();
				} else {
					console.log('error while updating room (remove)');
					return;
				}
			});
		});
	});

	test('deleteRoom', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest2',
				owner: 'deleteRoom',
				maxPlayer: 1
			},
			playerName: 'deleteRoom',
			isJoinRoom: true
		};

		createPlayerTest(socket, roomData.playerName);
		const roomCreated = new Promise((resolve) => createRoomTest(socket, roomData, resolve));
		roomCreated.then(() => {
			socket.emit(
				SOCKET_EVENTS.DELETE_ROOM,
				{ roomName: roomData.newRoom.name, playerName: roomData.playerName },
				(res) => {
					if (res.msg === SOCKET_RES.ROOM_DELETED) {
						const roomIndex = server.rooms.findIndex((room) => room.name === roomData.newRoom.name);
						const playerFound = server.clients.find((client) => client.name === roomData.playerName);

						expect(roomIndex).toBe(-1);
						expect(server.rooms).toStrictEqual([]);
						expect(playerFound).toHaveProperty('connected', false);
						done();
					} else {
						console.log('error while deleting room');
						return;
					}
				}
			);
		});
	});

	test('startGame', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest3',
				owner: 'startGame',
				maxPlayer: 1
			},
			playerName: 'startGame',
			isJoinRoom: true
		};

		createPlayerTest(socket, roomData.playerName);
		createRoomTest(socket, roomData);
		startGameTest(socket, roomData.newRoom.name, done);
	});

	test('updateBoard', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest4',
				owner: 'updateBoard',
				maxPlayer: 1
			},
			playerName: 'updateBoard',
			isJoinRoom: true
		};
		const updateBoardData = {
			newBoard: Array.from(
				new Array(BOARD_SIZE.HEIGHT),
				() => new Array(BOARD_SIZE.WIDTH).fill('X')
			),
			roomName: roomData.newRoom.name,
			lineCleared: null
		}

		createPlayerTest(socket, roomData.playerName);
		createRoomTest(socket, roomData);
		startGameTest(socket, roomData.newRoom.name);
		socket.emit(SOCKET_EVENTS.UPDATE_BOARD, updateBoardData, (res) => {
			if (res.status === 200) {
				const roomFound = server.rooms.find((room) => room.name === roomData.newRoom.name);
				const playerFoundInsideRoom = roomFound.players.find((player) => player.name === roomData.playerName);

				expect(playerFoundInsideRoom.board).toStrictEqual(updateBoardData.newBoard);
				done();
			} else {
				console.log('error while updating board');
				return;
			}
		});
	});

	test('setGameOver', (done) => {
		const roomData = {
			newRoom: {
				name: 'roomTest5',
				owner: 'setGameOver',
				maxPlayer: 1
			},
			playerName: 'setGameOver',
			isJoinRoom: true
		};

		createPlayerTest(socket, roomData.playerName);
		createRoomTest(socket, roomData);
		startGameTest(socket, roomData.newRoom.name);
		socket.emit(SOCKET_EVENTS.SET_PLAYER_GAME_OVER, roomData.newRoom.name, (res) => {
			if (res.status === 200) {
				const roomFound = server.rooms.find((room) => room.name === roomData.newRoom.name);
				const playerFoundInsideRoom = roomFound.players.find((player) => player.name === roomData.playerName);

				expect(playerFoundInsideRoom.gameOver).toBe(true);
				done();
			}
		});
	});
});