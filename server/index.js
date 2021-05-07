import fs from 'fs';
import debug from 'debug';

import { playersSocket } from './playersSocket';
import { roomSocket } from './roomsSocket';

import { SOCKET_ACTIONS } from '../client/src/constants/socketConstants'

const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

const clients = new Array();
const rooms = new Array();


const initApp = (app, params, cb) => {
	const { host, port } = params;
	const handler = (req, res) => {
		// console.log('req', req.url)
		// console.log('res', res)
		// const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';
		let file = '../client/build';
		if (req.url === '/')
			file = `${file}/index.html`;
		else
			file = `${file}${req.url}`;
		fs.readFile(file, (err, data) => {
			if (err) {
				console.log('err', err)
				logerror(err);
				res.writeHead(500);
				return (res.end('Error loading index.html'));
			}
			res.writeHead(200);
			res.end(data);
		});
	};

	app.on('request', handler);

	app.listen({ host, port }, () => {
		loginfo(`tetris listen on ${params.url}`);
		cb();
	});
};

const initEngine = (io) => {
	io.on('connection', (socket) => {
		socket.on('emit_room', (data) => {
			io.to(data.roomName).emit(data.emitEvent);
		}); // not safe need verification ?
		// socket.on('create', (room) => console.log(`CREATED ${room} \n\n`))

		// socket.on('join', (room) => {
		// 	console.log(`Socket ${socket.id} joining ${room}`);
		// 	socket.join(room);
		// });
		console.log('connected', socket.id);
		playersSocket(clients, socket);
		roomSocket(rooms, io, socket);

		socket.on("disconnect", () => {
			const index = clients.findIndex((client) => client.id === socket.id);
			if (index != -1) {
				const client = clients[index];
				if (client.connected) {
					const roomOwnerIndex = rooms.findIndex((room) => room.owner === client.name);
					const roomPlayerIndex = rooms.findIndex((room) => room.players.includes(client.name) && room.owner !== client.name);

					if (roomOwnerIndex !== -1) {
						const roomOwner = rooms[roomOwnerIndex];
						const players = roomOwner.players.filter((player) => player !== client.name);

						roomOwner.players.length === 1 ?
							rooms.splice(roomOwnerIndex, 1)
							: rooms.splice(roomOwnerIndex, 1, { ...roomOwner, owner: players[0], players });
					}
					else if (roomPlayerIndex !== -1) {
						const roomPlayer = rooms[roomPlayerIndex];
						const players = roomPlayer.players.filter((player) => player !== client.name);

						rooms.splice(roomPlayerIndex, 1, { ...roomPlayer, players });
					}
				}
				clients.splice(index, 1);
			}
		});
	});
};

export const create = (params) => {
	const promise = new Promise((resolve, reject) => {
		const app = require('http').createServer()
		initApp(app, params, () => {
			const io = require('socket.io')(app, {
				cors: {
					origin: "*",
					methods: ["GET", "POST"]
				}
			});
			const stop = (cb) => {
				io.close();
				app.close(() => {
					app.unref();
				})
				loginfo(`Engine stopped.`);
				cb();
			};

			initEngine(io);
			resolve({ stop });
		});
	});
	return (promise);
};
