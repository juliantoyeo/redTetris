import React from 'react';
import { shallow } from 'enzyme';

import Board from '../Board';
import { createBoard } from '../../utils/boardUtils';
import { CELL_SIZE, PIECES } from '../../constants/gameConstant';

describe('Test Board component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(
			<Board 
				board={createBoard()} 
				cellSize={CELL_SIZE} 
				numberOfPlayer={1}
				mini={false}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render mini board', () => {
		const wrapper = shallow(
			<Board 
				board={PIECES['I'].shape} 
				cellSize={CELL_SIZE} 
				numberOfPlayer={1}
				mini={true}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});