import fs from 'fs';
import debug from 'debug';
import { createBoard } from '../client/utils/boardUtils';

const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');
const clients = new Array();

const initApp = (app, params, cb) => {
	const { host, port } = params;
	const handler = (req, res) => {
		const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';
		fs.readFile(__dirname + file, (err, data) => {
			if (err) {
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
		// socket.on('join', (room) => {
		// 	console.log(`Socket ${socket.id} joining ${room}`);
		// 	socket.join(room);
		// });

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
			socket.emit('updatePlayer', currentPlayer);
		});
	});
};

export const create = (params) => {
	const promise = new Promise((resolve, reject) => {
		const app = require('http').createServer();
		initApp(app, params, () => {
			const io = require('socket.io')(app);
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
