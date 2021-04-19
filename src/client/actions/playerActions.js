import { PLAYER_ACTIONS } from '../constants/actionConstant'

export const createPlayer = (currentPlayer) => {
	//connect server
	return {
		type: PLAYER_ACTIONS.CREATE_PLAYER,
		name: currentPlayer.name,
		roomName: currentPlayer.roomName
	}
}

export const updatePlayer = (currentPlayer) => {
	return {
		type: PLAYER_ACTIONS.UPDATE_PLAYER,
		name: currentPlayer.name,
		roomName: currentPlayer.roomName,
		connected: currentPlayer.connected
	}
}