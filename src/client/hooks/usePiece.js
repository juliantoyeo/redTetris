import { useCallback, useState } from 'react'
import _ from 'lodash'
import { BOARD_SIZE, PIECES } from '../constants/gameConstant'
import { randomPiece } from '../utils/randomPiece'
import { checkCollision } from '../utils/createBoard'

export const usePiece = () => {
	const [piece, setPiece] = useState({ // eslint-disable-line
		pos: { x: 0, y: 0 },
		shape: PIECES[0].shape,
		landed: false
	})
	const [prevPiece, setPrevPiece] = useState(null)

	const rotate = (matrix, dir) => {
		//Make rows become cols
		const rotatedPiece = matrix.map((_, index) => matrix.map(col => col[index]))

		//Reverse each row to get rotated matrix
		if (dir > 0) return _.map(rotatedPiece, (row) => row.reverse())
		return rotatedPiece.reverse()
	}

	const pieceRotate = (board, dir) => {
		const clonedPiece = _.cloneDeep(piece)
		clonedPiece.shape = rotate(clonedPiece.shape, dir)

		const pos = clonedPiece.pos.x
		let offset = 1
		while (checkCollision(clonedPiece, piece, board, { x: 0, y: 0})) {
			clonedPiece.pos.x += offset
			offset = -(offset + (offset > 0 ? 1 : -1))
			if (offset > clonedPiece.shape[0].length)
			{
				rotate(clonedPiece.shape, -dir)
				clonedPiece.pos.x = pos
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
		const newPiece = {
			pos: { x: BOARD_SIZE.WIDTH / 2 - 2, y: 0 },
			shape: randomPiece().shape,
			landed: false
		}
		setPrevPiece(newPiece)
		setPiece(newPiece)
	}

	return [piece, prevPiece, updatePiece, getPiece, pieceRotate]
}
