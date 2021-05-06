import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useParams } from 'react-router-dom';

import GameArea from './GameArea';
import combinedContext from '../contexts/combinedContext';
import { createBoard, checkCollision } from '../utils/boardUtils';
import { useInterval } from '../hooks/useInterval';
import { usePiece } from '../hooks/usePiece';
import { useBoard } from '../hooks/useBoard';
import { useGameStatus } from '../hooks/useGameStatus';
import { KEY_CODE } from '../constants/gameConstant';

const styles = {
	mainContainer: {
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		width: '100vw',
		height: '100vh',
		backgroundColor: '#555',
		backgroundSize: 'cover',
		fontFamily: 'Avenir Next',
		fontSize: '1vw'
	}
}

const Tetris = (props) => {
	const { socket } = props;
	const { roomName, playerName } = useParams();
	const [state, dispatch] = useContext(combinedContext);
	const defaulDropTime = 1000;
	const [currentRoom, setCurrentRoom] = useState(null);
	const [dropTime, setDropTime] = useState(null);
	const [currentDropTime, setCurrentDropTime] = useState(defaulDropTime);
	const [gameOver, setGameOver] = useState(true);
	const [piece, ghostPiece, updatePiece, getPiece, pieceRotate] = usePiece();
	const [board, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared] = useBoard(piece, ghostPiece, getPiece, gameOver);
	const [gameStatus, setGameStatus] = useGameStatus(rowsCleared);

	// let numberOfPlayer = 1;

	// console.log('location', location)
	console.log('state', state)
	console.log('roomName', roomName)
	console.log('playerName', playerName)
	console.log('currentRoom', currentRoom)

	useEffect(() => {
		console.log(socket)
		const room = _.find(state.rooms, (room) => room.name === roomName);
		// numberOfPlayer = room.players.length;
		setCurrentRoom(room);
	}, [state.rooms]);

	useEffect(() => {
		if (checkCollision(piece, boardWithLandedPiece, { x: 0, y: 0 })) {
			if (piece.pos.y < 1) {
				stopGame();
			}
		}
	}, [boardWithLandedPiece]);

	const startGame = () => {
		if (dropTime) {
			stopGame();
		} else {
			// Reset Everything
			const newBoard = createBoard();
			setBoard(newBoard);
			setBoardWithLandedPiece(newBoard);
			setDropTime(currentDropTime);
			getPiece(newBoard);
			setGameOver(false);
			setGameStatus({
				score: 0,
				rows: 0,
				level: 0
			});
		}
	}

	const stopGame = () => {
		setGameOver(true);
		setDropTime(null);
		setCurrentDropTime(defaulDropTime);
	}

	const movePiece = (x) => {
		if (!checkCollision(piece, boardWithLandedPiece, { x: x, y: 0 }))
			updatePiece(boardWithLandedPiece, { x: x, y: 0 }, false);
	}

	// const moveUp = () => {
	// 	if (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: -1 }))
	// 		updatePiece(boardWithLandedPiece, { x: 0, y: -1 }, false)
	// }

	const hardDrop = () => {
		updatePiece(boardWithLandedPiece, { x: 0, y: ghostPiece.pos.y - piece.pos.y }, true);
	}

	const drop = () => {
		if (gameStatus.rows > (gameStatus.level + 1) * 10) {
			setGameStatus(prev => ({
				...prev,
				level: prev.level + 1
			}));
			const newDropTime = defaulDropTime / (gameStatus.level + 1) + 200;
			setCurrentDropTime(newDropTime);
			setDropTime(newDropTime);
		}
		if (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: 1 }))
			updatePiece(boardWithLandedPiece, { x: 0, y: 1 }, false);
		else {
			updatePiece(boardWithLandedPiece, { x: 0, y: 0 }, true);
		}
	}

	const keyUp = ({ keyCode }) => {
		if (!gameOver) {
			if (keyCode === 40) {
				setDropTime(currentDropTime);
			}
		}
	}

	const dropPiece = () => {
		setDropTime(null);
		drop();
	}

	const move = (event) => {
		const { keyCode } = event
		if (!gameOver) {
			if (keyCode === KEY_CODE.LEFT || keyCode === KEY_CODE.A)
				movePiece(-1);
			else if (keyCode === KEY_CODE.RIGHT || keyCode === KEY_CODE.D)
				movePiece(1);
			else if (keyCode === KEY_CODE.DOWN || keyCode === KEY_CODE.S)
				dropPiece();
			else if (keyCode === KEY_CODE.UP || keyCode === KEY_CODE.W)
				// moveUp();
				pieceRotate(boardWithLandedPiece, 1);
			else if (keyCode === KEY_CODE.Z)
				pieceRotate(boardWithLandedPiece, -1);
			else if (keyCode === KEY_CODE.X)
				pieceRotate(boardWithLandedPiece, 1);
			else if (keyCode === KEY_CODE.SPACE)
				hardDrop(boardWithLandedPiece);
		}
	}

	useInterval(() => {
		drop();
	}, dropTime);

	const drawGameArea = () => {
		const numberOfPlayer = currentRoom.players.length;
		return _.map(currentRoom.players, (player) => {
			return <GameArea key={player} board={board} piece={piece} gameOver={gameOver} gameStatus={gameStatus} startGame={startGame} numberOfPlayer={numberOfPlayer}/>
		})
	}

	return (
		<div style={styles.mainContainer} role={'button'} tabIndex={'0'} onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
			{currentRoom && drawGameArea()}
		</div>
	)
}

Tetris.propTypes = {
	socket: PropTypes.object
};


export default Tetris;