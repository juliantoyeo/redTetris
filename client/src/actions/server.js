import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import params from '../params';
import { SOCKET_EVENTS } from '../constants/socketConstants';
import { addRoom, updateRoom, deleteRoom } from '../actions/roomActions';

export const ping = () => {
	return ({
		type: 'server/ping'
	});
};

export const initiateSocket = (dispatch) => {
	const newSocket = socketIOClient(params.server.url);

	newSocket.emit(SOCKET_EVENTS.FECTH_ALL_ROOM, (res) => {
		console.log('WebSocket fecth all room event received :', res);
		if (res.status === 200) {
			_.map(res.rooms, (room) => {
				dispatch(addRoom(room));
			})
		}
	});

	newSocket.on(SOCKET_EVENTS.CREATE_ROOM, (newRoom) => {
		console.log('WebSocket createRoom event received :', newRoom);
		dispatch(addRoom(newRoom));
	});

	newSocket.on(SOCKET_EVENTS.UPDATE_ROOM, (updatedRoom) => {
		console.log('WebSocket updateRoom event received :', updatedRoom);
		dispatch(updateRoom(updatedRoom));
	});

	newSocket.on(SOCKET_EVENTS.DELETE_ROOM, (roomName) => {
		console.log('WebSocket deleteRoom event received :', roomName);
		dispatch(deleteRoom(roomName));
	});

	newSocket.on('disconnect', () => {
		console.log('server disconected')
		alert('Server disconnected press OK to refresh')
		window.location.reload();
	});

	return (newSocket);
};

export const disconnectSocket = (socket) => {
	console.log('disconnecting socket');
	if (socket) socket.disconnect();
};