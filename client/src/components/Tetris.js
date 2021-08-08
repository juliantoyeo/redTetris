import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Typography, Grid } from '@material-ui/core';
// import { useParams } from 'react-router-dom';

import GameArea from './GameArea';
import { doRoomSocketEvent } from '../utils/socketUtils';
import Button from './subComponents/Button';
// import combinedContext from '../contexts/combinedContext';
import { useAppContext } from '../contexts/combinedContext';
import { checkCollision } from '../utils/boardUtils';
import { useInterval } from '../hooks/useInterval';
import { usePiece } from '../hooks/usePiece';
import { useBoard } from '../hooks/useBoard';
// import { useGameStatus } from '../hooks/useGameStatus';
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
	const [state] = useAppContext();
	const defaulDropTime = 1000;
	const [currPlayer, setCurrPlayer] = React.useState(null);
	const [currentRoom, setCurrentRoom] = React.useState(null);
	const [countDown, setCountDown] = React.useState(0);
	const [dropTime, setDropTime] = React.useState(null);
	const [currentDropTime, setCurrentDropTime] = React.useState(defaulDropTime);
	const [gameOver, setGameOver] = React.useState(true);
	const [numberOfPlayer, setNumberOfPlayer] = React.useState(1);
	const [openModal, setOpenModal] = React.useState(false);
	const [winner, setWinner] = React.useState({ name: '' });
	const [piece, ghostPiece, updatePiece, getPiece, pieceRotate] = usePiece(socket, currentRoom, currPlayer, setCurrPlayer);
	const [, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, putBlockingRow] = useBoard(socket, roomName, piece, ghostPiece, getPiece, gameOver);

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

	React.useEffect(() => {
		if (socket) {
			socket.on(SOCKET_EVENTS.GAME_IS_OVER, (winnerPlayer) => {
				setDropTime(null);
				setWinner(winnerPlayer)
				setOpenModal(true);
			});
		}
	}, []);

	React.useEffect(() => {
		return history.listen(location => {
			if (history.action === 'POP') {
				onReturnToLobby();
			}
		})
	}, [currPlayer])

	React.useEffect(() => {
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

	React.useEffect(() => {
		if (state.rooms) {
			const room = _.find(state.rooms, (room) => room.name === roomName);
			if (room) {
				setNumberOfPlayer(room.players.length);
				setCurrentRoom(room);
			}
			else {
				history.push('/');
			}
		}
		else {
			history.push('/');
		}
	}, [state.rooms]);

	React.useEffect(() => {
		if (currentRoom) {
			const player = _.find(currentRoom.players, (player) => player.name === state.currentPlayer.name);
			if (player) {
				setCurrPlayer(player);
			}
		}
	}, [currentRoom]);

	React.useEffect(() => {
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

	const onReturnToLobby = () => {
		history.push('/');
		if (currPlayer) {
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
	}



	const movePiece = (x) => {
		if (!checkCollision(piece, boardWithLandedPiece, { x: x, y: 0 }))
			updatePiece(boardWithLandedPiece, { x: x, y: 0 }, false);
	}

	const hardDrop = () => {
		updatePiece(boardWithLandedPiece, { x: 0, y: ghostPiece.pos.y - piece.pos.y }, true);
	}

	const drop = () => {
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

	const drawGameArea = () => {
		return _.map(currentRoom.players, (player) => {
			return <GameArea
				key={player.name}
				player={player}
				nextPiece={currentRoom.pieces.stack[player.stackIndex] ? currentRoom.pieces.stack[player.stackIndex][0] : PIECES[0].shape[0]}
				quitGame={onReturnToLobby}
				numberOfPlayer={numberOfPlayer}
				gameMode={currentRoom.gameMode}
			/>
		})
	}

	return (
		<div
			style={styles.mainContainerStyle}
			role={'button'}
			tabIndex={'0'}
			onKeyDown={(e) => move(e)}
			onKeyUp={keyUp}
		>
			<Modal
				open={openModal}
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
			{currentRoom && countDown !== -1 && <div style={styles.countDownModal}>{countDown === 0 ? 'Start !' : `${countDown}`}</div>}
			{currentRoom && drawGameArea()}
		</div>
	)
}

Tetris.propTypes = {
	socket: PropTypes.object
};


export default Tetris;