import React from 'react';
import { shallow } from 'enzyme';

import Cell from '../Cell';

describe('Test Cell component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<Cell type={'0'} numberOfPlayer={1} />);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly for 4 player', () => {
		const wrapper = shallow(<Cell type={'I'} numberOfPlayer={4} />);
		expect(wrapper).toMatchSnapshot();
	})
});