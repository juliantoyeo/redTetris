import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Typography, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import GameArea from './GameArea';
import { doRoomSocketEvent } from '../utils/socketUtils';
import Button from './subComponents/Button';
import combinedContext from '../contexts/combinedContext';
import { checkCollision } from '../utils/boardUtils';
import { useInterval } from '../hooks/useInterval';
import { usePiece } from '../hooks/usePiece';
import { useBoard } from '../hooks/useBoard';
import { useGameStatus } from '../hooks/useGameStatus';
import { KEY_CODE, PIECES } from '../constants/gameConstant';
import { SOCKET_EVENTS } from '../constants/socketConstants';

const styles = {
	mainContainerStyle: {
		boxSizing: 'border-box',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100vw',
		minHeight: '100vh',
		backgroundColor: '#555',
		backgroundSize: 'cover',
		fontFamily: 'Avenir Next',
		fontSize: '1vw'
	},
	countDownModal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		position: 'fixed',
		overflow: 'auto',
		zIndex: 2,
		top: 0,
		left: 0,
		fontSize: '10vw',
		color: 'white',
		backgroundColor: 'rgba(0,0,0,0.6)'
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalPopUp: {
		textAlign: 'center',
		backgroundColor: 'rgba(200,200,200,0.8)',
		width: '80%',
		height: '30%',
		padding: '30px'
	},
	gridItem: {
		display: 'flex',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'space-around',
		color: 'rgb(80,80,80)'
	},
	button: {
		color: 'rgb(80,80,80)',
		width: '40%',
		height: '35%'
	}
}

const Tetris = (props) => {
	const { socket } = props;
	const { roomName } = useParams();
	const history = useHistory();
	const [state] = useContext(combinedContext);
	const defaulDropTime = 1000;
	const [currPlayer, setCurrPlayer] = useState(null);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [countDown, setCountDown] = useState(0);
	const [dropTime, setDropTime] = useState(null);
	const [currentDropTime, setCurrentDropTime] = useState(defaulDropTime);
	const [gameOver, setGameOver] = useState(true);
	const [piece, ghostPiece, updatePiece, getPiece, pieceRotate] = usePiece(socket, currentRoom, currPlayer, setCurrPlayer);
	const [, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared, putBlockingRow] = useBoard(socket, roomName, piece, ghostPiece, getPiece, gameOver);
	const [gameStatus, setGameStatus] = useGameStatus(rowsCleared);
	const [gameEnded, setGameEnded] = useState(false);
	const [numberOfPlayer, setNumberOfPlayer] = useState(1);
	const [openModal, setOpenModal] = useState(false);
	const [winner, setWinner] = useState({ name: '' });

	// console.log('boardWithLandedPiece', boardWithLandedPiece);

	useEffect(() => {
		if (socket) {
			socket.on(SOCKET_EVENTS.GAME_IS_OVER, (winnerPlayer) => {
				setGameEnded(true);
				setDropTime(null);
				setWinner(winnerPlayer)
				setOpenModal(true);
			});
		}
	}, []);

	useEffect(() => {
		return history.listen(location => {
			if (history.action === 'POP') {
				onReturnToLobby();
			}
		})
	}, [currPlayer])

	useEffect(() => {
		if (socket) {
			socket.off(SOCKET_EVENTS.ADD_BLOCKING_ROW);
			socket.on(SOCKET_EVENTS.ADD_BLOCKING_ROW, (dataReceived) => {
				if (dataReceived.id !== socket.id) {
					console.log(SOCKET_EVENTS.ADD_BLOCKING_ROW, dataReceived);
					const newBoardWithLandedPiece = putBlockingRow(dataReceived.clearedRow);
					if (!checkCollision(piece, newBoardWithLandedPiece, { x: 0, y: 0 })) {
						updatePiece(newBoardWithLandedPiece, { x: 0, y: 0 }, false);
					}
					else if (!checkCollision(piece, newBoardWithLandedPiece, { x: 0, y: -1 })) {
						updatePiece(newBoardWithLandedPiece, { x: 0, y: -1 }, false);
					}
					else {
						stopGame();
					}
				}
			});
		}
	}, [piece, boardWithLandedPiece]);

	useEffect(() => {
		if (state.rooms) {
			const room = _.find(state.rooms, (room) => room.name === roomName);
			if (room) {
				setNumberOfPlayer(room.players.length);
				setCurrentRoom(room);
			}
		}

	}, [state.rooms]);

	useEffect(() => {
		if (currentRoom) {
			const player = _.find(currentRoom.players, (player) => player.name === state.currentPlayer.name);
			if (player) {
				setCurrPlayer(player);
			}
		}
	}, [currentRoom]);

	useEffect(() => {
		if (checkCollision(piece, boardWithLandedPiece, { x: 0, y: 0 })) {
			if (piece.pos.y < 1) {
				stopGame();
			}
		}
	}, [boardWithLandedPiece]);

	useInterval(() => {
		drop();
	}, dropTime);

	useInterval(() => {
		if (countDown !== -1) {
			setCountDown((prev) => prev - 1);
		}
		if (countDown === 0) {
			if (currentRoom && currentRoom.pieces.stack.length && currPlayer && currPlayer.board)
				startGame();
		}
	}, gameOver ? 1000 : null);

	const startGame = () => {
		setBoard(currPlayer.board);
		setBoardWithLandedPiece(currPlayer.board);
		setDropTime(currentDropTime);
		getPiece(currPlayer.board);
		setGameOver(false);
	}

	// const startGame = () => {
	// 	if (dropTime) {
	// 		stopGame();
	// 	} else {
	// 		// Reset Everything
	// 		const newBoard = createBoard();
	// 		setBoard(newBoard);
	// 		setBoardWithLandedPiece(newBoard);
	// 		setDropTime(currentDropTime);
	// 		getPiece(newBoard);
	// 		setGameOver(false);
	// 		setGameStatus({
	// 			score: 0,
	// 			rows: 0,
	// 			level: 0
	// 		});
	// 	}
	// }


	const onReturnToLobby = () => {
		history.push('/');
		const data = {
			roomName,
			playerName: currPlayer.name,
			isJoinRoom: false
		}
		if (currentRoom.players.length > 1) {
			doRoomSocketEvent(socket, () => { }, SOCKET_EVENTS.UPDATE_ROOM, data);
		} else {
			doRoomSocketEvent(socket, () => { }, SOCKET_EVENTS.DELETE_ROOM, data);
		}
	}

	const stopGame = () => {
		setGameOver(true);
		if (socket)
			socket.emit(SOCKET_EVENTS.SET_PLAYER_GAME_OVER, roomName, (res) => {
				if (res.status !== 200) {
					console.log(res.msg);
				}
			});
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
		// if (gameStatus.rows > (gameStatus.level + 1) * 10) {
		// 	setGameStatus(prev => ({
		// 		...prev,
		// 		level: prev.level + 1
		// 	}));
		// 	const newDropTime = defaulDropTime / (gameStatus.level + 1) + 200;
		// 	setCurrentDropTime(newDropTime);
		// 	setDropTime(newDropTime);
		// }
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

	const testBlocking = (clearedRow) => {
		if (socket) socket.emit('emit_room', { roomName, emitEvent: 'SOCKET_EVENTS.ADD_BLOCKING_ROW', dataToSent: { id: socket.id, clearedRow } });
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
			else if (keyCode === 66)
				testBlocking(18);
		}
	}

	const drawGameArea = () => {
		return _.map(currentRoom.players, (player) => {
			return <GameArea
				key={player.name}
				player={player}
				nextPiece={currentRoom.pieces.stack[player.stackIndex] ? currentRoom.pieces.stack[player.stackIndex][0] : PIECES[0].shape[0]}
				quitGame={onReturnToLobby}
				numberOfPlayer={numberOfPlayer}
			/>
		})
	}

	return (
		<div style={styles.mainContainerStyle} role={'button'} tabIndex={'0'} onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
			<Modal
				open={openModal}
				// onClose={() => { }}
				style={styles.modal}
			>
				<Grid container style={styles.modalPopUp}>
					<Grid item xs={12} style={styles.gridItem}>
						<Typography variant={'h4'}>
							{winner ? `The Winner Is : ${winner.name}` : 'YOU LOSE !'}
						</Typography>
					</Grid>
					<Grid item xs={12} style={styles.gridItem}>
						<Button onClick={onReturnToLobby} type={'button'} style={styles.button} text={'Back to Lobby'} />
					</Grid>
				</Grid>
			</Modal>
			{countDown !== -1 && <div style={styles.countDownModal}>{countDown === 0 ? 'Start !' : `${countDown}`}</div>}
			{currentRoom && drawGameArea()}
		</div>
	)
}

Tetris.propTypes = {
	socket: PropTypes.object
};


export default Tetris;