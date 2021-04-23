import { PLAYER_ACTIONS } from '../constants/actionConstant';

export const createPlayer = (socket, playerData) => (dispatch) => {
	let resValue;
	socket.on('createPlayer', (msg) => {
		console.log('WebSocket event received :', msg)
		return (msg);
	});
	if (socket) socket.emit('createPlayer', playerData, (res) => {
		resValue = res.status == 200 ? {
			type: PLAYER_ACTIONS.CREATE_PLAYER,
			name: playerData.name,
			roomName: playerData.roomName
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};

export const updatePlayer = (socket, currentPlayer) => (dispatch) => {
	let resValue;
	socket.on('updatePlayer', (msg) => {
		console.log('WebSocket event received :', msg)
		return (msg);
	});
	if (socket) socket.emit('updatePlayer', currentPlayer, (res) => {
		resValue = res.status == 200 ? {
			type: PLAYER_ACTIONS.UPDATE_PLAYER,
			name: currentPlayer.name,
			roomName: currentPlayer.roomName,
			connected: currentPlayer.connected
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};