import fs from 'fs';
import debug from 'debug';

import { playersSocket } from './playersSocket';
import { roomSocket } from './roomsSocket';


const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

const clients = new Array();
const rooms = new Array();


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
		socket.on('emit_room', (data) => {
			io.to(data.roomName).emit(data.emitEvent);
		}); // not safe need verification ?
		// socket.on('create', (room) => console.log(`CREATED ${room} \n\n`))

		playersSocket(clients, socket);
		roomSocket(rooms, io, socket);
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
