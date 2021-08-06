import fs from 'fs';
import debug from 'debug';

import { helpersSocket } from './sockets/helpersSocket';
import { playersSocket } from './sockets/playersSocket';
import { roomsSocket } from './sockets/roomsSocket';

const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

export const clients = new Array();
export const rooms = new Array();


const initApp = (app, params, cb) => {
	const { host, port } = params;
	const handler = (req, res) => {
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
		console.log('connected', socket.id);
		helpersSocket(clients, rooms, io, socket);
		playersSocket(clients, rooms, io, socket);
		roomsSocket(clients, rooms, io, socket);
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
