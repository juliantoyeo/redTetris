import playerReducer from '../playerReducer';
import { PLAYER_ACTIONS } from '../../constants/actionConstant';

const fakePlayer = {
	name: 'player1'
}

describe('test playerReducer', () => {
	it('should handle CREATE_PLAYER', () => {
		const createPlayerAction = {
			type: PLAYER_ACTIONS.CREATE_PLAYER,
			player: fakePlayer
		};
		expect(playerReducer({}, createPlayerAction)).toEqual(fakePlayer);
	});
	it('should handle UPDATE_PLAYER', () => {
		const createPlayerAction = {
			type: PLAYER_ACTIONS.UPDATE_PLAYER,
			name: 'testName',
			connected: 'testConnect'
		};
		expect(playerReducer({}, createPlayerAction)).toEqual({ name: 'testName', connected: 'testConnect'});
	});
	it('should handle default', () => {
		const createPlayerAction = {
			type: 'test'
		};
		expect(playerReducer({}, createPlayerAction)).toEqual({});
	});
});