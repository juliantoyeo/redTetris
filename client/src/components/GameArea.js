import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import combinedContext from '../contexts/combinedContext';
import Board from './Board';
import Button from './subComponents/Button';
import { CELL_SIZE, BOARD_SIZE } from '../constants/gameConstant';

const mainContainerStyle = (props) => {
	return ({
		boxSizing: 'border-box',
		width: props.numberOfPlayer > 3 ?'20%' : '30%',
		maxWidth: '50vw',
		display: 'flex',
		justifyContent: 'space-evenly',
		margin: '1vw',
		fontSize: props.numberOfPlayer > 3 ?'0.8vw' : '1vw',
		border: '1px solid #333'
	});
}

const previewContainerStyle = (props) => {
	return ({
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: '1vw',
		backgroundColor: 'black',
		width: '80%',
		// padding: '1vw',
		overflow: 'hidden',
		height: `${props.cellSize * 3}vw`
	});
}

const styles = {
	boardContainer: {
		width: '65%'
		// background: 'black'
		// border: '1px solid white'
	},
	sideContainer: {
		color: 'white',
		width: '35%',
		// maxWidth: '200px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		textAlign: 'center',
		// borderRadius: '1.5vw',
		// border: '2px solid #333',
		padding: '0.5vw'
		// marginLeft: '0.5vw'
		// margin: '0 auto'
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		// border: '1px solid white',
		// borderRadius: '1.5vw',
		// border: '1.5px solid #333',
		// padding: '0.5vw',
		// margin: '1vw 0',
		height: '40%'
	}
}

const GameArea = (props) => {
	const {board, piece, gameOver, gameStatus, startGame, numberOfPlayer} = props;
	const [state] = useContext(combinedContext);
	const { currentPlayer } = state;
	let cellSize = CELL_SIZE;
	if (numberOfPlayer > 3)
		cellSize = cellSize - 0.5;

	return (
		<div style={mainContainerStyle({ numberOfPlayer: numberOfPlayer })}>
			<div style={{ width: `${cellSize * BOARD_SIZE.WIDTH}vw` }}>
				<Board board={board} cellSize={cellSize} numberOfPlayer={numberOfPlayer} />
			</div>
			<div style={styles.sideContainer}>
				<span className={''}>Next Piece</span>
				<div style={previewContainerStyle({ cellSize: cellSize })}>
					<Board board={piece.shape} cellSize={cellSize} numberOfPlayer={numberOfPlayer}  mini={true}/>
				</div>
				<div style={styles.infoContainer}>
					<span>Player Name : {currentPlayer.name}</span>
					<span>Score : {gameStatus.score}</span>
					<span>Rows : {gameStatus.rows}</span>
					<span>Level : {gameStatus.level}</span>
				</div>
				<Button onClick={startGame} type={'button'} text={gameOver ? 'Start Game' : 'Quit Game'}/>
			</div>
		</div>
	)
}

GameArea.propTypes = {
	board: PropTypes.array,
	piece: PropTypes.object,
	gameOver: PropTypes.bool,
	gameStatus: PropTypes.object,
	startGame: PropTypes.func,
	numberOfPlayer: PropTypes.number
};

export default GameArea;