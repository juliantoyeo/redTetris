import * as server from '../server';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore([]);

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.on = jest.fn();
socket.emit = jest.fn();
socket.disconnect = jest.fn();

// mock socketIOClient
const mockSocketIOClient = jest.fn();

jest.mock('socket.io-client', () => ({
	__esModule: true,
	default: (...props) => mockSocketIOClient(...props)
}));

mockSocketIOClient.mockReturnValue(socket);

describe('test initiateSocket', () => {
	beforeEach(() => {
		store.clearActions();
		server.initiateSocket(store.dispatch);
	});

	test('test disconnect socket', () => {
		server.disconnectSocket(socket);
	});
	test('test disconnect socket null', () => {
		server.disconnectSocket(null);
	});

});