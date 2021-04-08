import React, { useState, useEffect } from 'react'
import Board from './Board'
import Display from './Display'
import Button from './Button'
import { CELL_SIZE } from '../constants/gameConstant'

const styles = {
	mainContainer: {
		width: '50%',
		maxWidth: '50vw',
		display: 'flex',
		// flexDireaction: 'row',
		// alignItems: 'flex-start',
		// flexWrap: 'wrap',
		// padding: '40px',
		// margin: '0 auto',
		// maxWidth: '500px',
		border: '1px solid white'
	},
	boardContainer: {
		width: '60%',
		// background: 'black'
		// border: '1px solid white'
	},
	sideContainer: {
		color: 'white',
		width: '30%',
		// maxWidth: '200px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		textAlign: 'center',
		borderRadius: '3vw',
		border: '2px solid #333',
		padding: '2vw',
		margin: '0 auto'
	},
	previewContainer: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '2vw',
		backgroundColor: 'black',
		// border: '1px solid #333',
		padding: '1vw',
		overflow: 'hidden',
		height: `${CELL_SIZE * 4}vw`
		// color: 'white',
		// margin: '0 auto'
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		border: '1px solid white',
		borderRadius: '2vw',
		border: '2px solid #333',
		padding: '1vw',
		
		margin: '1vw 0',
		height: '20vw'
	}
}

const GameArea = (props) => {
	const {board, piece, gameOver, gameStatus, startGame} = props

	return (
		<div style={styles.mainContainer}>
			<div style={styles.boardContainer}>
				<Board board={board} />
			</div>
			<div style={styles.sideContainer}>
				Next Piece
				<div style={styles.previewContainer}>
					<Board board={piece.shape} mini={true}/>
				</div>
				<div style={styles.infoContainer}>
					<span>Player Name : Jyeoooo</span>
					<span>Score : {gameStatus.score}</span>
					<span>Rows : {gameStatus.rows}</span>
					<span>Level : {gameStatus.level}</span>
				</div>
				{/* {gameOver ? (
					<Display gameOver={gameOver} text={'Game Over'} />
				) : (
					<div>
					</div>
				)} */}
				
				<Button onClick={startGame} text={gameOver ? 'Start Game' : 'Quit Game'}/>
			</div>
		</div>
	)
}

export default GameArea