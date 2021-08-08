/* eslint-disable comma-dangle */
import React from 'react';
import enableHooks from 'jest-react-hooks-shallow';

import { useBoard } from '../useBoard';
import { PIECES, TEST_BOARD } from '../../constants/gameConstant';

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.on = jest.fn();
socket.emit = jest.fn();
socket.disconnect = jest.fn();

enableHooks(jest);

const fakeCurrentPlayer = {
	name: 'fakePlayer1',
	stackIndex: 0
}

const fakeRoom = {
	name: 'fakeRoom1',
	players: [fakeCurrentPlayer],
	pieces: {
		stack: [
			['I', PIECES['I'].shape[0]]
		]
	}
}

const fakeCurrentPiece = {
	pos: { x: 0, y: 0 },
	type: 'I',
	rotation: 0,
	shape: PIECES['I'].shape[0],
	landed: false
};

const fakeGhostPiece = {
	pos: { x: 18, y: 18 },
	type: 'X',
	shape: [
		['0', '0', '0', '0'],
		['X', 'X', 'X', 'X'],
		['0', '0', '0', '0'],
		['0', '0', '0', '0']
	],
};

const fakeBoard = TEST_BOARD.NEW_BOARD;

const setCurrentPlayer = jest.fn();

const getPiece = jest.fn();

const gameOver = false;

// mock boardUtils
const mockCheckCollision = jest.fn();
const mockGetLandPosition = jest.fn();
const mockCreateBoard = jest.fn();

jest.mock('../../utils/boardUtils', () => ({
	__esModule: true,
	checkCollision: (...props) => mockCheckCollision(...props),
	getLandPosition: (...props) => mockGetLandPosition(...props),
	createBoard: (...props) => mockCreateBoard(...props)
}));

describe('test useBoard', () => {
	const setState = jest.fn();

	beforeEach(() => {
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());
		mockCreateBoard.mockReturnValue(fakeBoard);

		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState])
			.mockReturnValueOnce([fakeBoard, setState])
			.mockReturnValueOnce([0, setState])
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('test useBoard', () => {
		const [, , , , , ] = useBoard(socket, fakeRoom.name, fakeCurrentPiece, fakeGhostPiece, getPiece, gameOver);
	});
	test('test useBoard currentPiece landed', () => {
		const newFakeCurrentPiece = {
			...fakeCurrentPiece,
			landed: true
		};

		const [, , , , , ] = useBoard(socket, fakeRoom.name, newFakeCurrentPiece, fakeGhostPiece, getPiece, gameOver);
	});
	test('test useBoard putBlockingRow', () => {
		const newFakeCurrentPiece = {
			...fakeCurrentPiece,
			landed: true
		};

		const [, , , , , putBlockingRow] = useBoard(socket, fakeRoom.name, newFakeCurrentPiece, fakeGhostPiece, getPiece, gameOver);
		putBlockingRow(1);
	});
});
