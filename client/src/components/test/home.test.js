import React from 'react';
import { shallow } from 'enzyme';
import enableHooks from 'jest-react-hooks-shallow';
import _ from 'lodash';

import Home from '../Home';
import * as AppContext from '../../contexts/combinedContext';

// import Client from 'socket.io-client';
// import params from '../../params';
// let socket = new Client(params.server.url);

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.emit = jest.fn();

enableHooks(jest);
// import RoomDisplay from '../RoomDisplay'
// jest.mock('../RoomDisplay')
// eslint-disable-next-line react/display-name
// RoomDisplay.mockImplementation = () => <div />

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

let fakeRoom = {
	name: 'fakeRoom',
	players: ['fakePlayer1', 'fakePlayer2']
}


describe('Test Home component', () => {

	const setState = jest.fn();

	beforeEach(() => {

		const contextValues = [state, jest.fn()];
		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => contextValues);
		
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState])
			.mockReturnValueOnce([{ playerName: '', roomName: '', maxPlayer: 10 }, setState])
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should render properly', () => {

		const wrapper = shallow(<Home />);
		const roomDisplay = wrapper.find('RoomDisplay');

		roomDisplay.props().onClick(fakeRoom, true);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render selected room and test onStartGame', () => {

		React.useState = jest.fn()
			.mockReturnValueOnce([{ name: 'room1' }, setState])
			.mockReturnValueOnce([{ playerName: '', roomName: '', maxPlayer: 10 }, setState])
		const wrapper = shallow(<Home socket={socket} />);
		const roomDisplay = wrapper.find('RoomDisplay');
		// socket.emit.mockResolvedValue({ status: '400' });
		roomDisplay.simulate('click', { name: 'test' });
		
		roomDisplay.props().onLeave(fakeRoom, true);
		roomDisplay.props().onLeave({ ...fakeRoom, players: [] }, false);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should test onStartGame with null socket', () => {

		React.useState = jest.fn()
			.mockReturnValueOnce([{ name: 'room1' }, setState])
			.mockReturnValueOnce([{ playerName: '', roomName: '', maxPlayer: 10 }, setState])

		const wrapper = shallow(<Home />);
		const roomDisplay = wrapper.find('RoomDisplay');
		roomDisplay.simulate('click', { name: 'test' });
	});
	it('Should render no room found', () => {

		React.useState = jest.fn()
			.mockReturnValueOnce([{ name: 'non existing room' }, setState])
			.mockReturnValueOnce([{ playerName: '', roomName: '', maxPlayer: 10 }, setState])

		const wrapper = shallow(<Home />);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render no room', () => {
		let newState = _.cloneDeep(state);
		newState.rooms = [];
		const contextValues = [newState, jest.fn()];
		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => contextValues);

		const wrapper = shallow(<Home />);
		expect(wrapper).toMatchSnapshot();
	});
	test('Should test onFormChange, onCreateRoom', () => {

		const wrapper = shallow(<Home />);
		const roomCreationForm = wrapper.find('RoomCreationForm');
		roomCreationForm.simulate('change', { target: { value: 'test' } });
		roomCreationForm.simulate('submit', { preventDefault: jest.fn() });
	});
	test('Should test onSubmitName', () => {
		let newState = _.cloneDeep(state);
		newState.currentPlayer = null;
		const contextValues = [newState, jest.fn()];
		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => contextValues);

		const wrapper = shallow(<Home />);
		const nameForm = wrapper.find('NameForm');
		nameForm.simulate('submit', { preventDefault: jest.fn() });
	});
});