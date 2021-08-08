/* eslint-disable comma-dangle */
import React from 'react';
import { usePiece } from '../usePiece';
import { PIECES, TEST_BOARD } from '../../constants/gameConstant';

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.on = jest.fn();
socket.emit = jest.fn();
socket.disconnect = jest.fn();

const fakeCurrentPlayer = {
	name: 'fakePlayer1',
	stackIndex: 0
}

const fakeCurrentRoom = {
	name: 'fakeRoom1',
	players: [fakeCurrentPlayer],
	pieces: {
		stack: [
			['I', PIECES['I'].shape[0]]
		]
	}
}

const fakePiece = {
	pos: { x: 0, y: 0 },
	type: 'I',
	rotation: 0,
	shape: PIECES['I'].shape[0],
	landed: false
};

const fakeBoard = TEST_BOARD.NEW_BOARD;

const setCurrentPlayer = jest.fn();

// mock checkCollison
const mockCheckCollision = jest.fn();
const mockGetLandPosition = jest.fn();

jest.mock('../../utils/boardUtils', () => ({
	__esModule: true,
	checkCollision: (...props) => mockCheckCollision(...props),
	getLandPosition: (...props) => mockGetLandPosition(...props)
}));

describe('test usePiece', () => {
	const setState = jest.fn();

	beforeEach(() => {
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([fakePiece, setState])
			.mockReturnValueOnce([null, setState])
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('test usePiece pieceRotate', () => {
		const [, , , , pieceRotate] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		pieceRotate(fakeBoard, -1);
		pieceRotate(fakeBoard, 1);
	});
	test('test usePiece pieceRotate if checkCollison', () => {
		mockCheckCollision.mockReturnValue(true);
		const [, , , , pieceRotate] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		pieceRotate(fakeBoard, -1);
		pieceRotate(fakeBoard, 1);
	});
	test('test usePiece pieceRotate with 0 piece', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([{
				...fakePiece,
				type: 'O'
			}, setState])
			.mockReturnValueOnce([null, setState])

		const [, , , , pieceRotate] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		pieceRotate(fakeBoard, 1);
	});
	test('test usePiece pieceRotate with I piece and max rotation', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([{
				...fakePiece,
				type: 'J',
				rotation: 4
			}, setState])
			.mockReturnValueOnce([null, setState])
		mockCheckCollision.mockReturnValue(false);
		const [, , , , pieceRotate] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		pieceRotate(fakeBoard, 1);
	});
	test('test usePiece updatePiece landed true', () => {
		const [, , updatePiece, ,] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		updatePiece(fakeBoard, 1, true);
	});
	test('test usePiece getPiece', () => {
		const [, , , getPiece,] = usePiece(socket, fakeCurrentRoom, fakeCurrentPlayer, setCurrentPlayer);
		getPiece(fakeBoard);
	});
});