import { useCallback, useState } from 'react'
import _ from 'lodash'
import { BOARD_SIZE, MAX_ROTATION, PIECES } from '../constants/gameConstant'
import { randomPiece } from '../utils/randomPiece'
import { checkCollision } from '../utils/createBoard'

export const usePiece = () => {
	const [piece, setPiece] = useState({ // eslint-disable-line
		pos: { x: 0, y: 0 },
		type: '0',
		rotation: 0,
		shape: PIECES[0].shape[0],
		landed: false
	})
	const [prevPiece, setPrevPiece] = useState(null)

	const rotate = (piece, dir) => {
		let rotation = piece.rotation + dir
		if (rotation > MAX_ROTATION) rotation = 0
		else if (rotation === -1) rotation = MAX_ROTATION
		piece.rotation = rotation
		piece.shape = PIECES[piece.type].shape[rotation]
	}

	const pieceRotate = (board, dir) => {
		let clonedPiece = _.cloneDeep(piece)
		rotate(clonedPiece, dir)

		let offset = 1
		while (checkCollision(clonedPiece, piece, board, { x: 0, y: 0})) {
			clonedPiece.pos.x += offset
			offset = -(offset + (offset > 0 ? 1 : -1))
			if (offset > clonedPiece.shape[0].length)
			{
				clonedPiece = piece
				return
			}
		}
		setPrevPiece(piece)
		setPiece(clonedPiece)
	}

	const updatePiece = (props) => {
		const { x, y, landed } = props
		if (!landed)
			setPrevPiece(piece)
		else
			setPrevPiece(null)
		setPiece(prev => ({
			...prev,
			pos: { x: (prev.pos.x + x), y: (prev.pos.y + y )},
			landed
		}))
	}

	const getPiece = () => {
		const [shape, type] = randomPiece()
		const newPiece = {
			pos: { x: BOARD_SIZE.WIDTH / 2 - 2, y: 0 },
			type,
			rotation: 0,
			shape,
			landed: false
		}
		setPrevPiece(newPiece)
		setPiece(newPiece)
	}

	return [piece, prevPiece, updatePiece, getPiece, pieceRotate]
}
