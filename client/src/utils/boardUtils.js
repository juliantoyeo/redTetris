import { BOARD_SIZE } from '../constants/gameConstant'
import _ from 'lodash'

export const createBoard = () => {
	return (
		Array.from(new Array(BOARD_SIZE.HEIGHT), () => 
			new Array(BOARD_SIZE.WIDTH).fill('0')
		)
		// TEST_BOARD.I_SPIN
	)
}

export const checkCollision = (piece, boardWithLandedPiece, { x: moveX, y: moveY }) => {
	const newBoard = _.cloneDeep(boardWithLandedPiece)
	// console.log("boardWithLandedPiece", boardWithLandedPiece)
	// console.log(piece)
	for (let y = 0; y < piece.shape.length; y += 1) {
		for (let x = 0; x < piece.shape[y].length; x += 1) {
			const moveToY = y + piece.pos.y + moveY
			const moveToX = x + piece.pos.x + moveX
			if (piece.shape[y][x] !== '0') {
				// if (!newBoard[moveToY] || !newBoard[moveToY][moveToX] || newBoard[moveToY][moveToX][1] !== 'clear') {
				if (!newBoard[moveToY] || !newBoard[moveToY][moveToX] || newBoard[moveToY][moveToX] !== '0') {
					// console.log(piece.shape)
					// console.log("collision happen on x : ", x, " y : ", y, " moveToX : ", moveToX, " moveToY : ", moveToY)
					// colPos = { x: x, y: y}
					// return { collided: true, colPos: { x: x, y: y}}
					return true
				}
			}
		}
	}
}

export const getLandPosition = (piece, boardWithLandedPiece) => {
	// console.log("boardWithLandedPiece", boardWithLandedPiece)
	// console.log(piece)
	// let moveY = BOARD_SIZE.HEIGHT - 1
	let moveY = piece.pos.y
	if (piece.pos.y <= 0)
		moveY = 0
	// console.log("checked moveY : ", moveY, " y : ", moveY - piece.pos.y)
	while (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: moveY - piece.pos.y}))
	{
		
		// if (moveY === BOARD_SIZE.HEIGHT - 1)
		// 	return { x: piece.pos.x, y: moveY - 1}
		moveY++
		// console.log("checked moveY : ", moveY, " y : ", moveY - piece.pos.y)
	}
	moveY -= 1
	if (moveY < 0 && piece.type !== 'I') moveY = 0
	// const landPos = { x: piece.pos.x, y: moveY}
	// console.log("landPos : ", landPos)
	return { x: piece.pos.x, y: moveY}
}
