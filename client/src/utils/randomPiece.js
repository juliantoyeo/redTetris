import { PIECES } from '../constants/gameConstant';

export const randomPiece = () => {
	const types = 'IJLOSZT';
	const randType = types[Math.floor(Math.random() * types.length)];
	return [PIECES[randType].shape[0], randType];
}
