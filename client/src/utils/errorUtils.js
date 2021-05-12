import { SOCKET_RES } from '../constants/socketConstants'

export const errorAlert = (error) => {
	switch (error) {
		case SOCKET_RES.PLAYER_NAME_EXIST:
			alert('Name exist, please try a different name');
			break;
		case SOCKET_RES.ROOM_NAME_EXIST:
			alert('Room name exist, please try a different name');
			break;
		case SOCKET_RES.ROOM_DOESNT_EXIST:
			alert('Room does not exist, please try again');
			break;
		default:
			return;
	}
}