import socketIOClient from 'socket.io-client';
import params from '../../../params'

export const ping = () => {
	return ({
		type: 'server/ping'
	});
};

export const socketConnection = (players) => {
	// var players = new Array();
	const socket = socketIOClient(params.server.url);
	socket.emit('newClient', (res) => {
		console.log(res)
		players = res.clients;
		console.log('bad', players)
	});
	// socket.once('newClient', (clients) => {
	// 	players = clients;
	// });
	console.log('good', players)
	return (players);
};