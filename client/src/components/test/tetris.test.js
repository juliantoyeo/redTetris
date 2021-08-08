import React from 'react';
import { shallow } from 'enzyme';
import enableHooks from 'jest-react-hooks-shallow';

import Tetris from '../Tetris';
import * as AppContext from '../../contexts/combinedContext';
import { KEY_CODE } from '../../constants/gameConstant';

import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
socket.emit = jest.fn();

enableHooks(jest);

// mock userParam, useHistory
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		roomName: 'room1'
	}),
	useHistory: () => ({
		action: jest.fn(),
		push: jest.fn(),
		listen: jest.fn()
	})
}));

// mock checkCollison
const mockCheckCollison = jest.fn();

jest.mock('../../utils/boardUtils', () => ({
	__esModule: true,
	checkCollision: (...props) => mockCheckCollison(...props)
}));

// mock usePiece
const mockUsePiece = jest.fn();

jest.mock('../../hooks/usePiece', () => ({
	__esModule: true,
	usePiece: (...props) => mockUsePiece(...props)
}));

const piece = {
	pos: {
		x: 0,
		y: 0
	}
};
const ghostPiece = {
	pos: {
		x: 0,
		y: 0
	}
};
const updatePiece = jest.fn();
const getPiece = jest.fn();
const pieceRotate = jest.fn();

mockUsePiece.mockReturnValue([piece, ghostPiece, updatePiece, getPiece, pieceRotate]);

// mock useBoard
const mockUseBoard = jest.fn();

jest.mock('../../hooks/useBoard', () => ({
	__esModule: true,
	useBoard: (...props) => mockUseBoard(...props)
}));

const setBoard = jest.fn();
const boardWithLandedPiece = [];
const setBoardWithLandedPiece = jest.fn();
const rowsCleared = 0;
const putBlockingRow = jest.fn();

mockUseBoard.mockReturnValue([null, setBoard, boardWithLandedPiece, setBoardWithLandedPiece, rowsCleared, putBlockingRow]);

// mock useInterval
const mockUseInterval = jest.fn();

jest.mock('../../hooks/useInterval', () => ({
	__esModule: true,
	useInterval: (...props) => mockUseInterval(...props)
}));

const fakePlayer1 = {
	name: 'player1',
	stackIndex: 0
}

const fakeRoom1 = {
	name: 'room1',
	players: [fakePlayer1],
	pieces: {
		stack: [[]]
	}
}

let state = {
	currentPlayer: {
		name: 'player1'
	},
	rooms: [
		fakeRoom1
	]
}


describe('Test Tetris component', () => {

	const setState = jest.fn();

	// beforeAll(() => {
	// 	jest.useFakeTimers();
	// });

	beforeEach(() => {
		const contextValues = [state, jest.fn()];

		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => contextValues);

		jest.spyOn(React, 'useEffect').mockImplementation(f => f());
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([null, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should render properly with socket with winner', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([null, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['test1', setState]) // winner

		const wrapper = shallow(<Tetris socket={socket} />);
		expect(wrapper.exists()).toBe(true);
	});
	it('Should render properly without socket and countdown is not 0', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([null, setState]) // currentRoom
			.mockReturnValueOnce([3, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		expect(wrapper.exists()).toBe(true);
	});
	it('Should render properly with drawGameArea branch 1', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([fakeRoom1, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		expect(wrapper.exists()).toBe(true);
	});
	it('Should render properly with drawGameArea branch 2', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([{
				...fakeRoom1,
				players: [
					{
						...fakePlayer1,
						stackIndex: 1
					}
				]
			}, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		expect(wrapper.exists()).toBe(true);
	});
	it('Should test keyDown and keyUp', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([fakeRoom1, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([false, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.LEFT });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.RIGHT });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.DOWN });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.UP });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.Z });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.X });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.SPACE });
		wrapper.props().onKeyDown({ keyCode: 0 });
		wrapper.props().onKeyUp({ keyCode: 40 });
		wrapper.props().onKeyUp({ keyCode: 0 });
	});
	it('Should test keyDown and keyUp when game over', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([fakeRoom1, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		mockCheckCollison.mockReturnValue(true);

		const wrapper = shallow(<Tetris socket={null} />);
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.LEFT });
		wrapper.props().onKeyUp({ keyCode: 40 });
	});
	it('Should test keyDown when checkCollision return true', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([fakeRoom1, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([false, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		mockCheckCollison.mockReturnValue(true);

		const wrapper = shallow(<Tetris socket={socket} />);
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.LEFT });
		wrapper.props().onKeyDown({ keyCode: KEY_CODE.DOWN });
	});
	it('Should test onReturnToLobby', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([fakePlayer1, setState]) // currPlayer
			.mockReturnValueOnce([fakeRoom1, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		const gameArea = wrapper.find('GameArea');
		gameArea.props().quitGame();
	});
	it('Should test onReturnToLobby with 2 players', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([fakePlayer1, setState]) // currPlayer
			.mockReturnValueOnce([{
				...fakeRoom1,
				players: [
					{
						name: 'player1',
						stackIndex: 1
					},
					{
						name: 'player2',
						stackIndex: 1
					}
				]
			}, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		const wrapper = shallow(<Tetris socket={null} />);
		const gameArea = wrapper.find('GameArea').at(0);
		gameArea.props().quitGame();
	});
	it('Should test room not found', () => {
		const newContextValues = [{
			...state,
			rooms: []
		}, jest.fn()];

		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => newContextValues);

		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([null, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		shallow(<Tetris socket={null} />);
	});
	it('Should test no state.rooms', () => {
		const newContextValues = [[], jest.fn()];

		jest
			.spyOn(AppContext, 'useAppContext')
			.mockImplementation(() => newContextValues);

		React.useState = jest.fn()
			.mockReturnValueOnce([null, setState]) // currPlayer
			.mockReturnValueOnce([null, setState]) // currentRoom
			.mockReturnValueOnce([0, setState]) // countDown
			.mockReturnValueOnce([null, setState]) // dropTime
			.mockReturnValueOnce([1000, setState]) // currentDropTime
			.mockReturnValueOnce([true, setState]) // gameOver
			.mockReturnValueOnce([1, setState]) // numberOfPlayer
			.mockReturnValueOnce([false, setState]) // openModal
			.mockReturnValueOnce(['', setState]) // winner

		shallow(<Tetris socket={null} />);
	});
});