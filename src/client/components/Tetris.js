import React, { useState, useEffect } from 'react'
import Board from './Board'
import Display from './Display'
import Button from './Button'
import { createBoard, createDisplayBoard, checkCollision } from '../utils/boardUtils'

import { useInterval } from '../hooks/useInterval'
import { usePiece } from '../hooks/usePiece'
import { useBoard } from '../hooks/useBoard'
import { useGameStatus } from '../hooks/useGameStatus'
import { KEY_CODE, CELL_SIZE } from '../constants/gameConstant'

const styles = {
	mainContainer: {
		boxSizing: 'border-box',
		// display: 'flex',
		// alignItems: 'center',
		width: '100vw',
		height: '100vh',
		backgroundColor: '#555',
		backgroundSize: 'cover',
		fontFamily: "Avenir Next",
		fontSize: '1.2vw',
		// border: '1px solid black'
		// overflow: 'hidden'
	},
	gameContainer: {
		width: '50%',
		display: 'flex',
		// flexDireaction: 'row',
		// alignItems: 'flex-start',
		// flexWrap: 'wrap',
		// padding: '40px',
		// margin: '0 auto',
		// maxWidth: '500px',
		// border: '1px solid white'
	},
	boardContainer: {
		width: '60%',
		// background: 'black'
		// border: '1px solid white'
	},
	infoContainer: {
		width: '30%',
		// maxWidth: '200px',
		display: 'block',
		borderRadius: '3vw',
		border: '2px solid #333',
		padding: '2vw',
		margin: '0 auto'
	},
	previewContainer: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '3vw',
		backgroundColor: 'black',
		// border: '1px solid #333',
		padding: '1vw',
		overflow: 'hidden',
		height: `${CELL_SIZE * 4}vw`
		// color: 'white',
		// margin: '0 auto'
	}
}

const Tetris = () => {
	const defaulDropTime = 1000
	const [dropTime, setDropTime] = useState(null)
	const [currentDropTime, setCurrentDropTime] = useState(defaulDropTime)
	const [gameOver, setGameOver] = useState(true)
	const [displayBoard, setDisplayBoard] = useState(createDisplayBoard())
	const [piece, ghostPiece, updatePiece, getPiece, pieceRotate] = usePiece(setDisplayBoard)
	const [board, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared] = useBoard(piece, ghostPiece, getPiece, gameOver)
	const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

	// console.log("board", board)
	

	useEffect(() => {
		// const test = document.getElementsByClassName('cell')[0].clientWidth
		// console.log(test)
	}, [piece])

	useEffect(() => {
		if (checkCollision(piece, boardWithLandedPiece, { x: 0, y: 0 })) {
			if (piece.pos.y < 1) {
				stopGame()
			}
		}
	}, [boardWithLandedPiece])

	const stopGame = () => {
		setGameOver(true)
		setDropTime(null)
		setCurrentDropTime(defaulDropTime)
	}

	const movePiece = (x) => {
		if (!checkCollision(piece, boardWithLandedPiece, { x: x, y: 0 }))
			updatePiece(boardWithLandedPiece, { x: x, y: 0 }, false)
	}

	const moveUp = () => {
		if (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: -1 }))
			updatePiece(boardWithLandedPiece, { x: 0, y: -1 }, false)
	}

	const hardDrop = () => {
		updatePiece(boardWithLandedPiece, { x: 0, y: ghostPiece.pos.y - piece.pos.y }, true)
	}

	const startGame = () => {
		if (dropTime) {
			stopGame()
		} else {
			// Reset Everything
			const newBoard = createBoard()
			setBoard(newBoard)
			setBoardWithLandedPiece(newBoard)
			setDropTime(currentDropTime)
			getPiece(newBoard)
			setGameOver(false)
			setScore(0)
			setRows(0)
			setLevel(0)
		}
	}

	const drop = () => {
		if (rows > (level + 1) * 10) {
			setLevel(prev => prev + 1)
			const newDropTime = defaulDropTime / (level + 1) + 200
			setCurrentDropTime(newDropTime)
			setDropTime(newDropTime)
		}
		if (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: 1 }))
			updatePiece(boardWithLandedPiece, { x: 0, y: 1 }, false)
		else {
			updatePiece(boardWithLandedPiece, { x: 0, y: 0 }, true)
		}
	}

	const keyUp = ({ keyCode }) => {
		if (!gameOver) {
			if (keyCode === 40) {
				setDropTime(currentDropTime)
			}
		}
	}

	const dropPiece = () => {
		setDropTime(null)
		drop()
	}

	const move = (props) => {
		const { keyCode } = props
		if (!gameOver) {
			if (keyCode === KEY_CODE.LEFT || keyCode === KEY_CODE.A)
				movePiece(-1)
			else if (keyCode === KEY_CODE.RIGHT || keyCode === KEY_CODE.D)
				movePiece(1)
			else if (keyCode === KEY_CODE.DOWN || keyCode === KEY_CODE.S)
				dropPiece()
			else if (keyCode === KEY_CODE.UP || keyCode === KEY_CODE.W)
				// moveUp()
				pieceRotate(boardWithLandedPiece, 1)
			else if (keyCode === KEY_CODE.Z)
				pieceRotate(boardWithLandedPiece, -1)
			else if (keyCode === KEY_CODE.X)
				pieceRotate(boardWithLandedPiece, 1)
			else if (keyCode === KEY_CODE.SPACE)
				hardDrop(boardWithLandedPiece)
		}
	}

	useInterval(() => {
		drop()
	}, dropTime)

	return (
		<div style={styles.mainContainer} role={'button'} tabIndex={'0'} onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
			<div style={styles.gameContainer}>
				<div style={styles.boardContainer}>
					<Board board={board} />
				</div>
				<div style={styles.infoContainer}>
					<div style={styles.previewContainer}>
						<Board board={piece.shape} mini={true}/>
					</div>
					{gameOver ? (
						<Display gameOver={gameOver} text={'Game Over'} />
					) : (
						<div>
							{/* <Display text={`Score: ${score}`} />
							<Display text={`Rows: ${rows}`} />
							<Display text={`Level: ${level}`} /> */}
							
						</div>
					)}
					
					<Button onClick={startGame} text={gameOver ? 'Start Game' : 'Quit Game'}/>
				</div>
				{/* <div style={{ width: "100px"}}> */}
					
				{/* </div> */}
			</div>
		</div>
	)
}

export default Tetris