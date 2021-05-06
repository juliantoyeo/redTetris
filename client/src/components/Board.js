import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Cell from './Cell';

const mainContainerStyle = (props) => {
	return ({
		margin: '0 auto',
		display: 'grid',
		gridTemplateRows: `repeat(${props.height}, calc(${props.cellSize}vw))`,
		gridTemplateColumns: `repeat(${props.width}, 1fr)`,
		gridGap: '1px',
		// border: '2px solid #333',
		width: '100%',
		maxWidth: `${props.cellSize * props.width}vw`,
		background: 'black'
	});
}

const Board = (props) => {
	const { board, cellSize, numberOfPlayer, mini } = props;

	const getHeight = () => {
		if (!mini)
			return (board.length);
		else {
			let rowCount = 0
			for(let i = 0; i < board.length; i++) {
				if (checkShouldPrintRow(board[i]))
					rowCount++;
			}
			return rowCount;
		}
	}

	const checkShouldPrintRow = (row) => {
		if (!mini)
			return true;
		for(let i = 0; i < row.length; i++) {
			if (row[i] !== '0')
				return true;
		}
	}

	return (
		<div style={mainContainerStyle({ width: board[0].length, height: getHeight(), cellSize: cellSize })}>
			{_.map(board, (row) => {
				if (checkShouldPrintRow(row)) {
					return (
						_.map(row, (cell, x) => {
							return (
								<Cell key={x} type={cell} numberOfPlayer={numberOfPlayer} />
							);
						})
					);
				}
			})}
		</div>
	)
}

Board.propTypes = {
	board: PropTypes.array,
	cellSize: PropTypes.number,
	numberOfPlayer: PropTypes.number,
	mini: PropTypes.bool
};

export default Board;