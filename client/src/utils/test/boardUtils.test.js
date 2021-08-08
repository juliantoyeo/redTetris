import * as boardUtils from '../boardUtils';
import { PIECES, TEST_BOARD } from '../../constants/gameConstant';

const fakePiece = {
	pos: { x: 0, y: 0 },
	type: 'I',
	rotation: 0,
	shape: PIECES['I'].shape[0],
	landed: false
};

const fakeBoard = TEST_BOARD.NEW_BOARD;

describe('test boardUtils', () => {
	test('test boardUtils checkCollision', () => {
		boardUtils.checkCollision(fakePiece, fakeBoard, { x: 1, y: 1 });
	});
	test('test boardUtils getLandPosition', () => {
		boardUtils.getLandPosition(fakePiece, fakeBoard);
	});
});