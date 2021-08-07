import React from 'react';
import { shallow } from 'enzyme';

import RoomCreationForm from '../form/RoomCreationForm';

describe('Test RoomCreationForm component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<RoomCreationForm onChange={jest.fn}/>);
		const input1 = wrapper.find('input').at(0);
		input1.simulate('change', { target: { value: 'test' } });
		const input2 = wrapper.find('input').at(1);
		input2.simulate('change', { target: { value: 'test' } });
		expect(wrapper).toMatchSnapshot();
	});
});