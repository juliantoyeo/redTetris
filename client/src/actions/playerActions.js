import { PLAYER_ACTIONS } from '../constants/actionConstant';
import { SOCKET_RES, SOCKET_EVENTS } from '../constants/socketConstants';
import { errorAlert } from '../utils/errorUtils';

export const createPlayer = (socket, playerName) => (dispatch) => {
	if (socket) socket.emit(SOCKET_EVENTS.CREATE_PLAYER, playerName, (res) => {
		if (res.msg === SOCKET_RES.PLAYER_CREATED) {
			dispatch({
				type: PLAYER_ACTIONS.CREATE_PLAYER,
				player: res.player
			});
		} else {
			errorAlert(res.msg);
		}
	});
};

export const updatePlayer = (socket, currentPlayer) => (dispatch) => { // Might not be used, to be removed
	let resValue;
	socket.on('updatePlayer', (msg) => {
		console.log('WebSocket updatePlayer event received :', msg);
		return (msg);
	});
	
	if (socket) socket.emit('updatePlayer', currentPlayer, (res) => {
		resValue = res.status === 200 ? {
			type: PLAYER_ACTIONS.UPDATE_PLAYER,
			name: currentPlayer.name,
			connected: currentPlayer.connected
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};