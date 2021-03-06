import { ROOM_ACTIONS } from '../constants/actionConstant';
import _ from 'lodash';

export const roomsInitialState = [];

const reducer = (state, action) => {
	switch (action.type) {
		case ROOM_ACTIONS.ADD_ROOM:
			return [...state, action.newRoom];
		case ROOM_ACTIONS.DELETE_ROOM:
			return _.filter(state, (room) => room.name !== action.roomName);
		case ROOM_ACTIONS.UPDATE_ROOM: {
			const newRooms = _.filter(state, (room) => room.name !== action.updatedRoom.name);
			return [...newRooms, action.updatedRoom];
		}
		default:
			return state;
	}
}

export default reducer;