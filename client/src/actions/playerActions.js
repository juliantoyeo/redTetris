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
