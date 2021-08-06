import React from 'react';
import { shallow } from 'enzyme';

import RoomDisplay from '../RoomDisplay';
import { createBoard } from '../../utils/boardUtils';
import { CELL_SIZE, PIECES } from '../../constants/gameConstant';

const fakeClick = jest.fn();

const fakeRoom = {
	players: ['fakePlayer1'],
	maxPlayer: 1,
	name: 'fakeRoom',
	owner: 'fakePlayer1',
	isStarted: false
}

describe('Test Board component', () => {
	it('Should render properly when isLobby', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={true}
				isOwner={false}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly when is not lobby', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={false}
				isOwner={false}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly when isOwner is true', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={true}
				isOwner={true}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly when game is Started', () => {
		fakeRoom.isStarted = true;
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={false}
				isOwner={true}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly when room is not full', () => {
		fakeRoom.isStarted = false;
		fakeRoom.maxPlayer = 2;
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={false}
				isOwner={true}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly when there is no room', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={null}
				isLobby={true}
				isOwner={true}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});

describe('Test Board component', () => {
	it('Should test onleave', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={true}
				isOwner={false}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		wrapper.find('.leaveRoom').simulate('click');
		expect(wrapper).toMatchSnapshot();
	});
	it('Should test onStartGame', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={true}
				isOwner={true}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		wrapper.find('.startGame').simulate('click');
		expect(wrapper).toMatchSnapshot();
	});
	it('Should test onJoinGame', () => {
		const wrapper = shallow(
			<RoomDisplay
				room={fakeRoom}
				isLobby={false}
				isOwner={false}
				onClick={fakeClick}
				onLeave={fakeClick}
			/>
		);
		wrapper.find('.joinRoom').simulate('click');
		expect(wrapper).toMatchSnapshot();
	});
});