import React, { useState, useEffect } from 'react'
import Board from './Board'
import Display from './Display'
import StartButton from './StartButton'
import { createBoard, checkCollision } from '../utils/boardUtils'

import { useInterval } from '../hooks/useInterval'
import { usePiece } from '../hooks/usePiece'
import { useBoard } from '../hooks/useBoard'
import { useGameStatus } from '../hooks/useGameStatus'
import { KEY_CODE } from '../constants/gameConstant'


const mainContainerStyle = () => {
	return ({
		width: '100vw',
		height: '100vh',
		backgroundColor: 'black',
		backgroundSize: 'cover',
		overflow: 'hidden'
	})
}

const containerStyle = () => {
	return ({
		display: 'flex',
		alignItems: 'flex-start',
		padding: '40px',
		margin: '0 auto',
		maxWidth: '900px'
	})
}

const asideStyle = () => {
	return ({
		width: '100px',
		maxWidth: '200px',
		display: 'block',
		padding: '0 20px'
	})
}


const Tetris = () => {
	const defaulDropTime = 1000
	const [dropTime, setDropTime] = useState(null)
	const [currentDropTime, setCurrentDropTime] = useState(defaulDropTime)
	const [gameOver, setGameOver] = useState(false)
	const [piece, ghostPiece, updatePiece, getPiece, pieceRotate] = usePiece()
	const [board, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared] = useBoard(piece, ghostPiece, getPiece, gameOver)
	const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

	useEffect(() => {
		if (checkCollision(piece, boardWithLandedPiece, { x: 0, y: 0 })) {
			if (piece.pos.y < 1) {
				setGameOver(true)
				setDropTime(null)
				setCurrentDropTime(defaulDropTime)
			}
		}
	}, [boardWithLandedPiece])

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

	const drop = () => {
		// console.log(piece)
		if (rows > (level + 1) * 10) {
			setLevel(prev => prev + 1)
			const newDropTime = defaulDropTime / (level + 1) + 200
			setCurrentDropTime(newDropTime)
			setDropTime(newDropTime)
		}
		if (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: 1 }))
			updatePiece(boardWithLandedPiece, { x: 0, y: 1 }, false)
		else {
			// if (piece.pos.y < 1) {
			// 	setGameOver(true)
			// 	setDropTime(null)
			// 	setCurrentDropTime(defaulDropTime)
			// }
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
		<div style={mainContainerStyle()} role={'button'} tabIndex={'0'} onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
			<div style={containerStyle()}>
				<Board board={board} ghostPiecePos={ghostPiece.pos}/>
				<aside style={asideStyle()}>
					{gameOver ? (
						<Display gameOver={gameOver} text={'Game Over'} />
					) : (
						<div>
							<Display text={`Score: ${score}`} />
							<Display text={`Rows: ${rows}`} />
							<Display text={`Level: ${level}`} />
						</div>
					)}
					<StartButton onClick={startGame}/>
				</aside>
			</div>
		</div>
	)
}

export default Tetris