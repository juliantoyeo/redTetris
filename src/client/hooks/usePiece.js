import { useState, useEffect } from 'react'
import _ from 'lodash'
import { BOARD_SIZE, MAX_ROTATION, PIECES, WALL_KICK, WALL_KICK_I } from '../constants/gameConstant'
import { randomPiece } from '../utils/randomPiece'
import { checkCollision } from '../utils/boardUtils'

export const usePiece = () => {
	const initPiece = {
		pos: { x: 0, y: 0 },
		type: '0',
		rotation: 0,
		shape: PIECES[0].shape[0],
		landed: false
	}
	const [piece, setPiece] = useState(initPiece)
	const [shadowPiece, setShadowPiece] = useState({
		...initPiece,
		type: 'X'
	})
	const [prevPiece, setPrevPiece] = useState(null)
	
	useEffect(() => {
		const landPos = getLandPosition()
		setShadowPiece({
			...piece,
			type: 'X',
			pos: landPos
		})
	}, [piece])

	const getLandPosition = () =>
	{
		let landPos = {x : 0, y : 0}
		return landPos
	}

	const rotate = (piece, dir) => {
		let rotation = piece.rotation + dir
		if (rotation > MAX_ROTATION) rotation = 0
		else if (rotation === -1) rotation = MAX_ROTATION
		piece.rotation = rotation
		piece.shape = PIECES[piece.type].shape[rotation]
	}

	const pieceRotate = (board, dir) => {
		if (piece.type === 'O')
			return
		let clonedPiece = _.cloneDeep(piece)
		rotate(clonedPiece, dir)

		let wallKickTest = WALL_KICK
		if (piece.type === 'I')
			wallKickTest = WALL_KICK_I
		let wallKickSet = piece.rotation
		if (dir === -1)
			wallKickSet = clonedPiece.rotation
		let i = 0
		while (checkCollision(clonedPiece, piece, board, { x: 0, y: 0}))
		{
			if (i > 3) {
				clonedPiece = piece
				return
			}
			const offset = wallKickTest[wallKickSet][i]
			// console.log("offset : ", offset)
			clonedPiece.pos = {x : piece.pos.x + (offset.x * dir), y : piece.pos.y + (offset.y * dir)}
			i++
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

	const getFirstY = (rotation, type) => {
		let y = 0
		if (type !== 'O')
		{
			if (type === 'I' && rotation === 2)
				y = -2
			else	if (rotation === 2 || type === 'I' && rotation === 0)
				y = -1
		}
		return y
	}

	const getPiece = () => {
		const [shape, type] = randomPiece()
		const newPiece = {
			pos: { x: BOARD_SIZE.WIDTH / 2 - 2, y: getFirstY(0, type) },
			type,
			rotation: 0,
			shape,
			landed: false
		}
		setPrevPiece(newPiece)
		setPiece(newPiece)
	}

	return [piece, prevPiece, shadowPiece, updatePiece, getPiece, pieceRotate]
}
