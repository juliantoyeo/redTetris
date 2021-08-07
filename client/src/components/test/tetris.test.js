import React from 'react';
import { shallow } from 'enzyme';
import enableHooks from 'jest-react-hooks-shallow';
import _ from 'lodash';

import Tetris from '../Tetris';
import * as AppContext from '../../contexts/combinedContext';

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.emit = jest.fn();

enableHooks(jest);

let state = {
	currentPlayer: {
		name: 'player1'
	},
	rooms: [
		{
			name: 'room1'
		}
	]
}

describe('Test Tetris component', () => {

	const setState = jest.fn();

	beforeEach(() => {

		const contextValues = [state, jest.fn()];
		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => contextValues);

		jest.spyOn(React, 'useEffect').mockImplementation(f => f());
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		// React.useState = jest.fn()
		// 	.mockReturnValueOnce([null, setState])
		// 	.mockReturnValueOnce([{ playerName: '', roomName: '', maxPlayer: 10 }, setState])
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// it('Should render properly', () => {

	// 	const wrapper = shallow(<Tetris />);
	// 	expect(wrapper).toMatchSnapshot();
	// });
});