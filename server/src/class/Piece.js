import { PIECES } from '../constants/gameConstant';

class Piece {
	constructor(props) {
		this.stack = [];
		this.version = 0;
	}

	randomPiece = () => {
		const types = 'IJLOSZT';
		const randType = types[Math.floor(Math.random() * types.length)];
		return [PIECES[randType].shape[0], randType];
	}

	generatePieces = (amount) => {
		for (let i = 0; i < amount; i++) {
			this.stack.push(this.randomPiece());
		}
		this.version++;
	}

	update = (data) => {
		if (!data) return;
		this.stack = data.stack || this.stack;
		this.version = data.version || this.version;
	}
}

export default Piece