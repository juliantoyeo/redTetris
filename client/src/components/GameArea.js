import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Board from './Board';
import Button from './subComponents/Button';
import { CELL_SIZE, BOARD_SIZE } from '../constants/gameConstant';

const mainContainerStyle = (props) => {
	return ({
		boxSizing: 'border-box',
		width: props.numberOfPlayer > 3 ? '20%' : '30%',
		maxWidth: '50vw',
		display: 'flex',
		justifyContent: 'space-evenly',
		margin: '1vw',
		fontSize: props.numberOfPlayer > 3 ? '0.8vw' : '1vw',
		border: '1px solid #333'
	});
}

const gameOverStyle = (props) => {
	return ({
		position: 'absolute',
		backgroundColor: 'rgba(50, 50, 50, 0.8)',
		width: 'inherit',
		height: `${props.height}px`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'red',
		fontSize: '5em'
	})
}

const previewContainerStyle = (props) => {
	return ({
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: '1vw',
		width: '80%',
		overflow: 'hidden',
		height: `${props.cellSize * 3}vw`
	});
}

const styles = {
	boardContainer: {
		width: '65%'
	},
	sideContainer: {
		color: 'white',
		width: '35%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		textAlign: 'center',
		padding: '0.5vw'
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		height: '40%'
	}
}

const GameArea = (props) => {
	const { player, nextPiece, startGame, numberOfPlayer } = props;
	const [parentHeight, setParentHeight] = useState(null);
	let cellSize = CELL_SIZE;

	if (numberOfPlayer > 3)
		cellSize = cellSize - 0.5;

	useEffect(() => {
		if (document.getElementById('gameArea')) {
			setParentHeight(document.getElementById('gameArea').clientHeight);
		}
	}, [document.getElementById('gameArea')]);

	return (
		<div style={mainContainerStyle({ numberOfPlayer: numberOfPlayer })} id={'gameArea'}>
			{player.gameOver && 
				<div style={gameOverStyle({ height: parentHeight })}>
					<span>GAME OVER</span>
				</div>
			}
			<div style={{ width: `${cellSize * BOARD_SIZE.WIDTH}vw` }}>
				{player.board && <Board board={player.board} cellSize={cellSize} numberOfPlayer={numberOfPlayer} />}
			</div>
			<div style={styles.sideContainer}>
				<span className={''}>Next Piece</span>
				<div style={previewContainerStyle({ cellSize: cellSize })}>
					<Board board={nextPiece} cellSize={cellSize} numberOfPlayer={numberOfPlayer} mini={true} />
				</div>
				<div style={styles.infoContainer}>
					<span>Player Name : {player.name}</span>
					<span>Score : {player.gameStatus.score}</span>
					<span>Rows : {player.gameStatus.rows}</span>
					<span>Level : {player.gameStatus.level}</span>
					{player.gameOver && <span>GAME OVER!!</span>}
				</div>
				<Button onClick={startGame} type={'button'} text={player.gameOver ? 'Start Game' : 'Quit Game'} />
			</div>
		</div>
	)
}

GameArea.propTypes = {
	player: PropTypes.object,
	board: PropTypes.array,
	nextPiece: PropTypes.array,
	gameOver: PropTypes.bool,
	gameStatus: PropTypes.object,
	startGame: PropTypes.func,
	numberOfPlayer: PropTypes.number
};

export default GameArea;