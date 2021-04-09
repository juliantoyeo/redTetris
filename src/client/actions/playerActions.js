import { PLAYER_ACTIONS } from '../constants/actionConstant'

export const createPlayer = (currentPlayer) => {
	return {
		type: PLAYER_ACTIONS.CREATE_PLAYER,
		currentPlayer
	}
}

export const updatePlayer = (currentPlayer) => {
	return {
		type: PLAYER_ACTIONS.UPDATE_PLAYER,
		currentPlayer
	}
}