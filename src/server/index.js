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
			console.log(`msg: ${playerData.name}`);
			if (clients.findIndex((client) => client.name == playerData.name) == -1) {
				clients.push({
					name: playerData.name,
					board: null
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
