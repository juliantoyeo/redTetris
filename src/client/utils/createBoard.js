import { BOARD_SIZE } from '../constants/gameConstant'
import _ from 'lodash'

export const createBoard = () => {
	return (
		Array.from(new Array(BOARD_SIZE.HEIGHT), () => 
			new Array(BOARD_SIZE.WIDTH).fill('0')
		)
	)
}

export const checkCollision = (piece, prevPiece, board, { x: moveX, y: moveY }) => {
	const newBoard = _.cloneDeep(board)
	let pieceToDelete = piece
	if (prevPiece) pieceToDelete = prevPiece

	for (let y = 0; y < pieceToDelete.shape.length; y += 1) {
		for (let x = 0; x < pieceToDelete.shape[y].length; x += 1) {
			if (pieceToDelete.shape[y][x] !== '0') {
				newBoard[y + pieceToDelete.pos.y][x + pieceToDelete.pos.x] = '0'
			}
		}
	}

	// console.log("newBoard", newBoard)

	for (let y = 0; y < piece.shape.length; y += 1) {
		for (let x = 0; x < piece.shape[y].length; x += 1) {
			const moveToY = y + piece.pos.y + moveY
			const moveToX = x + piece.pos.x + moveX
			if (piece.shape[y][x] !== '0') {
				// if (!newBoard[moveToY] || !newBoard[moveToY][moveToX] || newBoard[moveToY][moveToX][1] !== 'clear') {
				if (!newBoard[moveToY] || !newBoard[moveToY][moveToX] || newBoard[moveToY][moveToX] !== '0') {
					return true
				}
			}
		}
	}
}