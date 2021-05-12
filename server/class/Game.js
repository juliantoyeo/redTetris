class Game {
	constructor(props) {
		this.name = props.name;
		this.owner = props.owner;
		this.players = props.players;
		this.maxPlayer = props.maxPlayer;
		this.isStarted = false;
	}

	addPlayer = (player) => {
		this.players.push(player);
	}

	removePlayer = (playerName) => {
		const playerIndex = this.players.findIndex((player) => player.name == playerName);
		this.players.splice(playerIndex, 1);
		if (this.owner === playerName) this.owner = this.players[0].name;
	}

	update = (data) => {
		if (!data) return;
		this.name = data.name || this.name;
		this.owner = data.owner || this.owner;
		this.players = data.players || this.players;
		this.isStarted = data.isStarted || this.isStarted;
	}
}

export default Game
