import { PLAYER_ACTIONS } from '../constants/actionConstant';
import socketIOClient from 'socket.io-client';
import params from '../../../params';

let socket;

export const initiateSocket = () => {
	socket = socketIOClient(params.server.url);
	// if (socket && room) socket.emit('join', room)

};

export const subscribeToRoom = () => {
	if (!socket) return (true);
}

export const connectPlayer = (playerData) => dispatch => {
	let resValue;
	socket.on('createPlayer', (msg) => {
		console.log('WebSocket event received :', msg)
		return msg
	})
	if (socket) socket.emit('createPlayer', playerData, (res) => {
		resValue = res.status == 200 ? {
			type: PLAYER_ACTIONS.CREATE_PLAYER,
			name: playerData.name,
			roomName: playerData.roomName
		} : {} // TODO : DO ALERT
		dispatch(resValue);
	});
	// return (resValue)
  }

export const disconnectSocket = () => {
	console.log("disconnecting socket")
	if (socket) socket.disconnect();
}



export const createPlayer = async (currentPlayer) => {
	//connect server'
	// new Promise((resolve, reject) => {
	// 	return socket.emit('newClient', currentPlayer.name, (res) => {
	// 		console.log(res)
	// 		if (res.status == 200)
	// 			return ({
	// 				type: PLAYER_ACTIONS.CREATE_PLAYER,
	// 				name: currentPlayer.name,
	// 				roomName: currentPlayer.roomName
	// 			});
	// 		else
	// 			return reject();
	// 	});
	// }).then((res) => console.log('res :', res));
	// if (!socket) return (true);
	// socket.on('newClient', ())
};

export const updatePlayer = (currentPlayer) => {
	return {
		type: PLAYER_ACTIONS.UPDATE_PLAYER,
		name: currentPlayer.name,
		roomName: currentPlayer.roomName,
		connected: currentPlayer.connected
	}
}