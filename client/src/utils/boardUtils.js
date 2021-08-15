import { BOARD_SIZE } from '../constants/gameConstant';
import _ from 'lodash';

export const createBoard = () => {
	return (
		Array.from(new Array(BOARD_SIZE.HEIGHT), () => 
			new Array(BOARD_SIZE.WIDTH).fill('0')
		)
	);
}

export const checkCollision = (piece, boardWithLandedPiece, { x: moveX, y: moveY }) => {
	const newBoard = _.cloneDeep(boardWithLandedPiece);
	for (let y = 0; y < piece.shape.length; y += 1) {
		for (let x = 0; x < piece.shape[y].length; x += 1) {
			const moveToY = y + piece.pos.y + moveY;
			const moveToX = x + piece.pos.x + moveX;
			if (piece.shape[y][x] !== '0') {
				if (!newBoard[moveToY] || !newBoard[moveToY][moveToX] || newBoard[moveToY][moveToX] !== '0') {
					return true;
				}
			}
		}
	}
	return false;
}

export const getLandPosition = (piece, boardWithLandedPiece) => {
	let moveY = piece.pos.y;
	if (piece.pos.y <= 0)
		moveY = 0;
	while (!checkCollision(piece, boardWithLandedPiece, { x: 0, y: moveY - piece.pos.y}))
	{
		moveY++;
	}
	moveY -= 1;
	if (moveY < 0 && piece.type !== 'I') moveY = 0
	return { x: piece.pos.x, y: moveY};
}
