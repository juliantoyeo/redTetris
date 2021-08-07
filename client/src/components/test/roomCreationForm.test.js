import React from 'react';
import { shallow } from 'enzyme';

import RoomCreationForm from '../form/RoomCreationForm';

describe('Test RoomCreationForm component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(<RoomCreationForm />);
		expect(wrapper).toMatchSnapshot();
	});
});