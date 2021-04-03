import React, { useState } from 'react'
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
	const [piece, prevPiece, shadowPiece, updatePiece, getPiece, pieceRotate] = usePiece()
	const [board, setBoard, rowsCleared] = useBoard(piece, prevPiece, shadowPiece, getPiece)
	const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

	// console.log('re-render', board)

	const movePiece = (dir) => {
		if (!checkCollision(piece, null, board, { x: dir, y: 0 }))
			updatePiece({ x: dir, y: 0, landed: false })
	}

	const moveUp = () => {
		if (!checkCollision(piece, null, board, { x: 0, y: -1 }))
			updatePiece({ x: 0, y: -1, landed: false })
	}

	const startGame = () => {
		// Reset Everything
		setBoard(createBoard())
		setDropTime(currentDropTime)
		getPiece()
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
		if (!checkCollision(piece, null, board, { x: 0, y: 1 }))
			updatePiece({ x: 0, y: 1, landed: false })
		else {
			if (piece.pos.y < 1) {
				setGameOver(true)
				setDropTime(null)
				setCurrentDropTime(defaulDropTime)
			}
			updatePiece({ x: 0, y: 0, landed: true })
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
				moveUp()
				// pieceRotate(board, 1)
			else if (keyCode === KEY_CODE.Z)
				pieceRotate(board, -1)
			else if (keyCode === KEY_CODE.SPACE || keyCode === KEY_CODE.X)
				pieceRotate(board, 1)
		}
	}

	useInterval(() => {
		// drop()
	}, dropTime)

	return (
		<div style={mainContainerStyle()} role={'button'} tabIndex={'0'} onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
			<div style={containerStyle()}>
				<Board board={board} />
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