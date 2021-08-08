import React from 'react';
import { shallow } from 'enzyme';

import RoomCreationForm from '../form/RoomCreationForm';
import { GAME_MODE } from '../../constants/gameConstant';

const fakeForm = { playerName: '', roomName: '', maxPlayer: 2, gameMode: GAME_MODE.NORMAL }

describe('Test RoomCreationForm component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<RoomCreationForm onChange={jest.fn} form={fakeForm} />);
		const input1 = wrapper.find('input').at(0);
		input1.simulate('change', { target: { value: 'test' } });
		const input2 = wrapper.find('input').at(1);
		input2.simulate('change', { target: { value: 'test' } });
		const input3 = wrapper.find('input').at(2);
		input3.simulate('change', GAME_MODE.NORMAL, 'gameMode');
		const input4 = wrapper.find('input').at(3);
		input4.simulate('change', GAME_MODE.NO_GHOST_PIECE, 'gameMode');
		expect(wrapper).toMatchSnapshot();
	});
});