import * as errorUtils from '../errorUtils';
import { SOCKET_RES } from '../../constants/socketConstants';

describe('test errorUtils', () => {
	beforeEach(() => {
		jest.spyOn(window, 'alert').mockImplementation(() => {});
	});
	
	test('test errorUtils errorAlert PLAYER_NAME_EXIST', () => {
		errorUtils.errorAlert(SOCKET_RES.PLAYER_NAME_EXIST);
	});
	test('test errorUtils errorAlert ROOM_NAME_EXIST', () => {
		errorUtils.errorAlert(SOCKET_RES.ROOM_NAME_EXIST);
	});
	test('test errorUtils errorAlert ROOM_DOESNT_EXIST', () => {
		errorUtils.errorAlert(SOCKET_RES.ROOM_DOESNT_EXIST);
	});
	test('test errorUtils errorAlert default', () => {
		errorUtils.errorAlert('test');
	});
});