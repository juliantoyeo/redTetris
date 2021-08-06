import React from 'react';
import { shallow } from 'enzyme';

import GameArea from '../GameArea';
import { createBoard } from '../../utils/boardUtils';
import { PIECES } from '../../constants/gameConstant';

const fakePlayer = {
	name: 'fakePlayer',
	gameStatus: {
		score: 0,
		rows: 0,
		level: 1
	},
	gameOver: false,
	board: createBoard()
}

const startGame = jest.fn();

describe('Test GameArea component', () => {
	it('Should render properly', () => {
		const wrapper = shallow(
			<GameArea
				player={fakePlayer}
				nextPiece={PIECES['I'].shape}
				startGame={startGame}
				numberOfPlayer={1}
			/>);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render game over', () => {
		fakePlayer.gameOver = true;
		const wrapper = shallow(
			<GameArea
				player={fakePlayer}
				nextPiece={PIECES['I'].shape}
				startGame={startGame}
				numberOfPlayer={1}
			/>);
		expect(wrapper).toMatchSnapshot();
	});
	it('Should render properly for 4 player', () => {
		const wrapper = shallow(
			<GameArea
				player={fakePlayer}
				nextPiece={PIECES['I'].shape}
				startGame={startGame}
				numberOfPlayer={4}
			/>);
		expect(wrapper).toMatchSnapshot();
	});
});