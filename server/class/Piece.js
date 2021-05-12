import { PIECES } from '../../client/src/constants/gameConstant';

class Piece {
	constructor(props) {
		this.pieces = []
	}

	randomPiece = () => {
		const types = 'IJLOSZT';
		const randType = types[Math.floor(Math.random() * types.length)];
		return [PIECES[randType].shape[0], randType];
	}

	update = (data) => {
		if (!data) return;
		this.pieces = data.pieces || this.pieces;
	}
}

export default Piece