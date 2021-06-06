import { SOCKET_RES } from '../constants/socketConstants';
import { errorAlert } from '../utils/errorUtils';

export const doRoomSocketEvent = (socket, setSelectedRoom, event, data) => {
	if (socket) socket.emit(event, data, (res) => {
		if (res.status === 200) {
			if (res.msg === SOCKET_RES.ROOM_DELETED || !data.isJoinRoom) {
				setSelectedRoom(null);
			} else {
				setSelectedRoom(res.room);
			}
		} else {
			errorAlert(res.msg);
		}
	});
}