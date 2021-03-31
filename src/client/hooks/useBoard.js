import { useState, useEffect } from 'react'
import _ from 'lodash'
import { createBoard } from '../utils/createBoard'
import { BOARD_SIZE } from '../constants/gameConstant'

export const useBoard = (currentPiece, prevPiece, getPiece) => {
	const [board, setBoard] = useState(createBoard())
	const [rowsCleared, setRowsCleared] = useState(0)

	useEffect(() => {
		setRowsCleared(0)
		setBoard(prev => updateBoard(prev))
	}, [currentPiece])

	const findEmptyCell = (row) => {
		let i = 0
		while (row[i])
		{
			if (row[i] === '0')
				return true
			i++	
		}
	}

	const checkRows = (board) => {
		let newBoard = new Array()
		for (let y = 0; y < BOARD_SIZE.HEIGHT; y += 1) {
			const row = board[y]
			if (!findEmptyCell(row)) {
				setRowsCleared(prev => prev + 1)
				newBoard.unshift(new Array(BOARD_SIZE.WIDTH).fill('0'))
			}
			else
				newBoard.push(row)
		}
		return newBoard
	}

	const updateBoard = (prevBoard) => {
		const newBoard = _.cloneDeep(prevBoard)
		
		if (prevPiece) {
			for (let y = 0; y < prevPiece.shape.length; y += 1) {
				for (let x = 0; x < prevPiece.shape[y].length; x += 1) {
					if (prevPiece.shape[y][x] !== '0') {
						newBoard[y + prevPiece.pos.y][x + prevPiece.pos.x] = '0'
					}
				}
			}
		}

		for (let y = 0; y < currentPiece.shape.length; y += 1) {
			for (let x = 0; x < currentPiece.shape[y].length; x += 1) {
				if (currentPiece.shape[y][x] !== '0') {
					newBoard[y + currentPiece.pos.y][x + currentPiece.pos.x] = currentPiece.shape[y][x]
				}
			}
		}

		if (currentPiece.landed) {
			getPiece()
			return checkRows(newBoard)
		}
		// console.log(currentPiece)
		// console.log(newBoard)
		return newBoard
	}

	return [board, setBoard, rowsCleared]
}