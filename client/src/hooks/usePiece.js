import { useState } from 'react';
import _ from 'lodash';
import { BOARD_SIZE, MAX_ROTATION, PIECES, WALL_KICK, WALL_KICK_I } from '../constants/gameConstant';
import { randomPiece } from '../utils/randomPiece';
import { checkCollision, getLandPosition } from '../utils/boardUtils';

export const usePiece = () => {
	const initPiece = {
		pos: { x: 0, y: 0 },
		type: '0',
		rotation: 0,
		shape: PIECES[0].shape[0],
		landed: false
	}
	const [piece, setPiece] = useState(initPiece)
	const [ghostPiece, setGhostPiece] = useState({
		...initPiece,
		type: 'X'
	})
	
	// useEffect(() => {
	// 	const landPos = getLandPosition(piece)
	// 	setGhostPiece({
	// 		...piece,
	// 		type: 'X',
	// 		pos: landPos
	// 	})
	// }, [piece])

	// const getLandPosition = () =>
	// {
	// 	let landPos = {x : 0, y : 0}
	// 	return landPos
	// }

	const getGhostPiece = (newPiece, boardWithLandedPiece) =>
	{
		const ghostPieceShape = Array.from(new Array(newPiece.shape.length), () => 
			new Array(newPiece.shape.length).fill('0')
		);
		for (let y = 0; y < newPiece.shape.length; y += 1) {
			for (let x = 0; x < newPiece.shape[y].length; x += 1) {
				if (newPiece.shape[y][x] !== '0') {
					ghostPieceShape[y][x] = 'X';
				}
			}
		}
		setGhostPiece({
			type: 'X',
			shape: ghostPieceShape,
			pos: getLandPosition(newPiece, boardWithLandedPiece)
		});
		// console.log("ghostPieceShape ", ghostPieceShape)
	}

	const rotate = (piece, dir) => {
		let rotation = piece.rotation + dir;
		if (rotation > MAX_ROTATION) rotation = 0;
		else if (rotation === -1) rotation = MAX_ROTATION;
		piece.rotation = rotation;
		piece.shape = PIECES[piece.type].shape[rotation];
	}

	const pieceRotate = (boardWithLandedPiece, dir) => {
		if (piece.type === 'O')
			return;
		let clonedPiece = _.cloneDeep(piece)
		rotate(clonedPiece, dir);

		let wallKickTest = WALL_KICK;
		if (piece.type === 'I')
			wallKickTest = WALL_KICK_I;
		let wallKickSet = piece.rotation;
		if (dir === -1)
			wallKickSet = clonedPiece.rotation;
		let i = 0;
		while (checkCollision(clonedPiece, boardWithLandedPiece, { x: 0, y: 0}))
		{
			if (i > 3) {
				clonedPiece = piece;
				return;
			}
			const offset = wallKickTest[wallKickSet][i];
			// console.log("offset : ", offset)
			clonedPiece.pos = {x : piece.pos.x + (offset.x * dir), y : piece.pos.y + (offset.y * dir)};
			i++;
		}
		setPiece(clonedPiece);
		// setGhostPiece({
		// 	...clonedPiece,
		// 	type: 'X',
		// 	pos: getLandPosition(clonedPiece, boardWithLandedPiece)
		// })
		getGhostPiece(clonedPiece, boardWithLandedPiece);
	}

	const updatePiece = (boardWithLandedPiece, dir, landed) => {
		// const { x, y, landed } = props
		const newPiece = {
			...piece,
			pos: { x: (piece.pos.x + dir.x), y: (piece.pos.y + dir.y )},
			landed
		}
		setPiece(newPiece);
		// setGhostPiece({
		// 	...newPiece,
		// 	type: 'X',
		// 	pos: getLandPosition(newPiece, boardWithLandedPiece)
		// })
		getGhostPiece(newPiece, boardWithLandedPiece);
	}

	// const getFirstY = (rotation, type) => {
	// 	let y = 0
	// 	if (type !== 'O')
	// 	{
	// 		if (type === 'I' && rotation === 2)
	// 			y = -2
	// 		else	if (rotation === 2 || type === 'I' && rotation === 0)
	// 			y = -1
	// 	}
	// 	return y
	// }

	const getFirstPos = (rotation, type) => {
		let x = BOARD_SIZE.WIDTH / 2 - 2;
		let y = 0;
		if (type !== 'O')
		{
			if (type === 'I' && rotation === 2)
				y = -2;
			else	if (rotation === 2 || type === 'I' && rotation === 0)
				y = -1;
		} else {
			x += 1;
		}
		return { x: x, y: y };
	}

	const getPiece = (boardWithLandedPiece) => {
		const [shape, type] = randomPiece();
		const newPiece = {
			pos: getFirstPos(0, type),
			type,
			rotation: 0,
			shape,
			landed: false
		}
		setPiece(newPiece);
		// setGhostPiece({
		// 	...newPiece,
		// 	type: 'X',
		// 	pos: getLandPosition(newPiece, boardWithLandedPiece)
		// })
		getGhostPiece(newPiece, boardWithLandedPiece);
	}

	return [piece, ghostPiece, updatePiece, getPiece, pieceRotate];
}
