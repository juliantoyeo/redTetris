import { BOARD_SIZE } from '../../client/src/constants/gameConstant';

class Player {
	constructor(props) {
		this.id = props.id;
		this.name = props.name;
		this.connected = false;
		this.board = null;
		this.gameOver = true;
		this.gameStatus = {
			score: 0,
			rows: 0,
			level: 0
		};
	}

	createBoard = () => {
		this.board = (
			Array.from(new Array(BOARD_SIZE.HEIGHT), () => 
				new Array(BOARD_SIZE.WIDTH).fill('0')
			)
		);
	}

	update = (data) => {
		if (!data) return;
		this.board = data.board ? data.board : this.board;
		this.gameOver = data.gameOver;
		this.gameStatus = data.gameStatus ? data.gameStatus : this.gameStatus;
		this.connected = data.connected;
	}
}

export default Player