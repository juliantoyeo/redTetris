import { BOARD_SIZE } from '../constants/gameConstant';

class Player {
	constructor(props) {
		this.id = props.id;
		this.name = props.name;
		this.connected = false;
		this.board = null;
		this.gameOver = false;
		this.gameStatus = {
			score: 0,
			rows: 0,
			level: 0
		};
		this.stackIndex = 0;
	}

	createBoard = () => {
		this.board = (
			Array.from(new Array(BOARD_SIZE.HEIGHT), () =>
				new Array(BOARD_SIZE.WIDTH).fill('0')
			)
		);
	}

	resetPlayer = () => {
    this.createBoard();
		this.gameOver = false;
		this.gameStatus = {
			score: 0,
			rows: 0,
			level: 0
		};
		this.stackIndex = 0;
	}

	update = (data) => {
		if (!data) return;
		this.board = data.board ? data.board : this.board;
		this.gameOver = typeof data.gameOver !== 'undefined' ? data.gameOver : this.gameOver;
		this.gameStatus = data.gameStatus ? data.gameStatus : this.gameStatus;
		this.stackIndex = data.stackIndex ? data.stackIndex : this.stackIndex;
		this.connected = typeof data.connected !== 'undefined' ? data.connected : this.connected;
	}
}

export default Player