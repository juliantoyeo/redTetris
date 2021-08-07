import React from 'react';
import { shallow } from 'enzyme';

import NameForm from '../form/NameForm';

describe('Test NameForm component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<NameForm onChange={jest.fn}/>);
		const input = wrapper.find('input');
		input.simulate('change', { target: { value: 'test' } });
		expect(wrapper).toMatchSnapshot();
	});
});