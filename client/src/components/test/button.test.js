import React from 'react';
import { shallow } from 'enzyme';

import Button from '../subComponents/Button';

describe('Test Button component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<Button onClick={jest.fn}/>);
		const button = wrapper.find('button');
		button.props().onMouseDown();
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly with no onClick', () => {
		const wrapper = shallow(<Button/>);
		const button = wrapper.find('button');
		button.props().onMouseDown();
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render disabled', () => {
		const wrapper = shallow(<Button isDisable={true} />);
		const button = wrapper.find('button');
		button.props().onMouseDown();
		expect(wrapper).toMatchSnapshot();
	});
});