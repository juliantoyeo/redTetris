import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import params from '../params';
import { SOCKET_EVENTS } from '../constants/socketConstants';
import { addRoom, updateRoom, deleteRoom } from '../actions/roomActions';

export const initiateSocket = (dispatch) => {
	const newSocket = socketIOClient(params.server.url);

	newSocket.emit(SOCKET_EVENTS.FECTH_ALL_ROOM, (res) => {
		if (res.status === 200) {
			_.map(res.rooms, (room) => {
				dispatch(addRoom(room));
			})
		}
	});

	newSocket.on(SOCKET_EVENTS.CREATE_ROOM, (newRoom) => {
		dispatch(addRoom(newRoom));
	});

	newSocket.on(SOCKET_EVENTS.UPDATE_ROOM, (updatedRoom) => {
		dispatch(updateRoom(updatedRoom));
	});

	newSocket.on(SOCKET_EVENTS.DELETE_ROOM, (roomName) => {
		dispatch(deleteRoom(roomName));
	});

	newSocket.on('disconnect', () => {
		window.location.reload();
	});

	return (newSocket);
};

export const disconnectSocket = (socket) => {
	if (socket) socket.disconnect();
};