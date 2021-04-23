import { ROOM_ACTIONS } from '../constants/actionConstant'

export const addRoom = (socket, newRoom) => (dispatch) => {
	let resValue;
	socket.on('createRoom', (msg) => {
		console.log('WebSocket event received :', msg)
		return (msg);
	});
	if (socket) socket.emit('createRoom', newRoom, (res) => {
		resValue = res.status == 200 ? {
			type: ROOM_ACTIONS.ADD_ROOM,
			newRoom
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};

export const updateRoom = (socket, updatedRoom) => (dispatch) => {
	let resValue;
	socket.on('updateRoom', (msg) => {
		console.log('WebSocket event received :', msg)
		return (msg);
	});
	if (socket) socket.emit('updateRoom', updatedRoom, (res) => {
		resValue = res.status == 200 ? {
			type: ROOM_ACTIONS.UPDATE_ROOM,
			updatedRoom
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};

export const deleteRoom = (socket, roomName) => (dispatch) => {
	let resValue;
	socket.on('deleteRoom', (msg) => {
		console.log('WebSocket event received :', msg)
		return (msg);
	});
	if (socket) socket.emit('deleteRoom', roomName, (res) => {
		resValue = res.status == 200 ? {
			type: ROOM_ACTIONS.DELETE_ROOM,
			roomName
		} : {}; // TODO : DO ALERT
		dispatch(resValue);
	});
};