import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { createBoard } from '../utils/boardUtils';
import { BOARD_SIZE } from '../constants/gameConstant';
import { SOCKET_EVENTS } from '../constants/socketConstants';
import { useGameStatus } from './useGameStatus';

export const useBoard = (socket, roomName, currentPiece, ghostPiece, getPiece, gameOver) => {
	const [board, setBoard] = React.useState(null);
	const [boardWithLandedPiece, setBoardWithLandedPiece] = React.useState(createBoard());
	const [rowsCleared, setRowsCleared] = React.useState(0);
	const [gameStatus] = useGameStatus(rowsCleared);

	const findEmptyCell = (row) => {
		let i = 0;
		while (row[i]) {
			if (row[i] === '0' || row[i] === 'B')
				return true;
			i++
		}
	}

	const putBlockingRow = (clearedRow) => {
		let newBoardWithLandedPiece = _.cloneDeep(boardWithLandedPiece);
		for (let i = 0; i < clearedRow; i += 1) {
			newBoardWithLandedPiece.push(new Array(BOARD_SIZE.WIDTH).fill('B'));
			newBoardWithLandedPiece.shift();
		}
		setBoardWithLandedPiece(newBoardWithLandedPiece);
		return newBoardWithLandedPiece;
	}

	const checkRows = (board) => {
		let newBoard = new Array();
		let clearedRow = 0;

		for (let y = 0; y < BOARD_SIZE.HEIGHT; y += 1) {
			const row = board[y];

			if (!findEmptyCell(row)) {
				setRowsCleared(prev => prev + 1);
				clearedRow++;
				newBoard.unshift(new Array(BOARD_SIZE.WIDTH).fill('0'));
			}
			else
				newBoard.push(row);
		}
		return { boardWithClearedRow: newBoard, clearedRow };
	}

	const updateBoard = () => {
		let newBoard = _.cloneDeep(boardWithLandedPiece);

		if (ghostPiece) {
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
			const { boardWithClearedRow, clearedRow } = checkRows(newBoard);

			newBoard = boardWithClearedRow;
			if (clearedRow > 0) {
				if (socket) socket.emit('emit_room', { roomName, emitEvent: SOCKET_EVENTS.ADD_BLOCKING_ROW, dataToSent: { id: socket.id, clearedRow } });
			}

			getPiece(newBoard);
			setBoardWithLandedPiece(newBoard);
		}

		const updateBoardData = {
			newBoard,
			roomName,
			gameStatus
		}

		if (socket) socket.emit(SOCKET_EVENTS.UPDATE_BOARD, updateBoardData, (res) => {
			if (res.status !== 200) {
				console.log(res.msg);
			}
		});
		return newBoard;
	}

	React.useEffect(() => {
		setRowsCleared(0);
		setBoard(updateBoard());
	}, [currentPiece]);

	return [board, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, putBlockingRow];
}