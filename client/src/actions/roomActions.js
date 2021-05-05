import { ROOM_ACTIONS } from '../constants/actionConstant';

export const addRoom = (newRoom) => {
	return {
		type: ROOM_ACTIONS.ADD_ROOM,
		newRoom
	};
}

export const updateRoom = (updatedRoom) => {
	return {
		type: ROOM_ACTIONS.UPDATE_ROOM,
		updatedRoom
	};
}

export const deleteRoom = (roomName) => {
	return {
		type: ROOM_ACTIONS.DELETE_ROOM,
		roomName
	};
}
