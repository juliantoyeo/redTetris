import socketIOClient from 'socket.io-client';
import params from '../params'

export const ping = () => {
	return ({
		type: 'server/ping'
	});
};

export const initiateSocket = () => {
	return (socketIOClient(params.server.url));
};

export const disconnectSocket = (socket) => {
	console.log("disconnecting socket")
	if (socket) socket.disconnect();
};