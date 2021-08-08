import React from 'react';
import {shallow } from 'enzyme';
import App from '../app';
import * as server from '../../actions/server';
import MockedSocket from 'socket.io-mock';


let socket = new MockedSocket();
socket.emit = jest.fn();

// eslint-disable-next-line no-import-assign
server.initiateSocket = jest.fn();

describe('Test App component', () => {
	beforeEach(() => {

		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([socket, () => {}])

	});
	it('Should render run setSocket', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, () => {}])

		shallow(<App />);
	});

});