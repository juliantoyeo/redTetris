import React from 'react';
import { shallow } from 'enzyme';

import Button from '../subComponents/Button';

describe('Test Button component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<Button />);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render disabled', () => {
		const wrapper = shallow(<Button isDisable={true }/>);
		expect(wrapper).toMatchSnapshot();
	});
});