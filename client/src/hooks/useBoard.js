import { useState, useEffect } from 'react';
import _ from 'lodash';
import { createBoard } from '../utils/boardUtils';
import { BOARD_SIZE } from '../constants/gameConstant';

export const useBoard = (currentPiece, ghostPiece, getPiece, gameOver) => {
	const [board, setBoard] = useState(createBoard());
	const [boardWithLandedPiece, setBoardWithLandedPiece] = useState(createBoard());
	const [rowsCleared, setRowsCleared] = useState(0);

	useEffect(() => {
		setRowsCleared(0);
		setBoard(updateBoard());
	}, [currentPiece]);

	const findEmptyCell = (row) => {
		let i = 0;
		while (row[i])
		{
			if (row[i] === '0')
				return true;
			i++	
		}
	}

	const checkRows = (board) => {
		let newBoard = new Array();
		for (let y = 0; y < BOARD_SIZE.HEIGHT; y += 1) {
			const row = board[y];
			if (!findEmptyCell(row)) {
				setRowsCleared(prev => prev + 1);
				newBoard.unshift(new Array(BOARD_SIZE.WIDTH).fill('0'));
			}
			else
				newBoard.push(row);
		}
		return newBoard;
	}

	const updateBoard = () => {
		let newBoard = _.cloneDeep(boardWithLandedPiece);
		// console.log("currentPiece", currentPiece)
		// console.log("ghostPiece", ghostPiece)
		if (ghostPiece)
		{
			for (let y = 0; y < ghostPiece.shape.length; y += 1) {
				for (let x = 0; x < ghostPiece.shape[y].length; x += 1) {
					if (ghostPiece.shape[y][x] !== '0') {
						newBoard[y + ghostPiece.pos.y][x + ghostPiece.pos.x] = ghostPiece.shape[y][x];
					}
				}
			}
		}

		for (let y = 0; y < currentPiece.shape.length; y += 1) {
			for (let x = 0; x < currentPiece.shape[y].length; x += 1) {
				if (currentPiece.shape[y][x] !== '0') {
					newBoard[y + currentPiece.pos.y][x + currentPiece.pos.x] = currentPiece.shape[y][x];
				}
			}
		}

		if (currentPiece.landed && !gameOver) {
			newBoard = checkRows(newBoard);
			getPiece(newBoard);
			setBoardWithLandedPiece(newBoard);
		}
		
		// console.log("newBoard", newBoard)
		// console.log("boardWithLandedPiece", boardWithLandedPiece)
		return newBoard;
	}

	return [board, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared];
}