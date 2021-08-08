import configureStore from 'redux-mock-store';

import * as roomActions from '../roomActions';
import { ROOM_ACTIONS } from '../../constants/actionConstant';

const mockStore = configureStore();
const store = mockStore([]);

const fakeRoom = {
	name: 'fakeRoom1'
}

describe('test room actions', () => {
	beforeEach(() => {
		store.clearActions();
	});

	test('Dispatches addRoom', () => {
		const expectedActions = [
			{
				type: ROOM_ACTIONS.ADD_ROOM,
				newRoom: fakeRoom
			}
		];

		store.dispatch(roomActions.addRoom(fakeRoom));
		expect(store.getActions()).toEqual(expectedActions);
	});
	test('Dispatches updateRoom', () => {
		const expectedActions = [
			{
				type: ROOM_ACTIONS.UPDATE_ROOM,
				updatedRoom: fakeRoom
			}
		];

		store.dispatch(roomActions.updateRoom(fakeRoom));
		expect(store.getActions()).toEqual(expectedActions);
	});
	test('Dispatches deleteRoom', () => {
		const expectedActions = [
			{
				type: ROOM_ACTIONS.DELETE_ROOM,
				roomName: fakeRoom.name
			}
		];

		store.dispatch(roomActions.deleteRoom(fakeRoom.name));
		expect(store.getActions()).toEqual(expectedActions);
	});

});