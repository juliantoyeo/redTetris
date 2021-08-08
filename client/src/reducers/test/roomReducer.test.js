import roomReducer from '../roomReducer';
import { ROOM_ACTIONS } from '../../constants/actionConstant';

const fakeRoom = {
	name: 'room1'
}

describe('test roomReducer', () => {
	it('should handle ADD_ROOM', () => {
		const createRoomAction = {
			type: ROOM_ACTIONS.ADD_ROOM,
			newRoom: fakeRoom
		};
		expect(roomReducer([], createRoomAction)).toEqual([fakeRoom]);
	});
	it('should handle DELETE_ROOM', () => {
		const createRoomAction = {
			type: ROOM_ACTIONS.DELETE_ROOM,
			roomName: fakeRoom.name
		};
		expect(roomReducer({}, createRoomAction)).toEqual([]);
	});
	it('should handle UPDATE_ROOM', () => {
		const createRoomAction = {
			type: ROOM_ACTIONS.UPDATE_ROOM,
			updatedRoom: fakeRoom.name
		};
		expect(roomReducer({}, createRoomAction)).toEqual([fakeRoom.name]);
	});
	it('should handle default', () => {
		const createRoomAction = {
			type: 'test'
		};
		expect(roomReducer({}, createRoomAction)).toEqual({});
	});
});