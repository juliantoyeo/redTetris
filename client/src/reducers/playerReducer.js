import { PLAYER_ACTIONS } from '../constants/actionConstant'

export const playerInitialState = {
	name: '',
	roomName: '',
	connected: false
}

const reducer = (state, action) => {
	switch (action.type) {
		case PLAYER_ACTIONS.CREATE_PLAYER:
			return { ...state, name: action.name, roomName: action.roomName, connected: true }
		case PLAYER_ACTIONS.UPDATE_PLAYER:
			return { ...state, name: action.name, roomName: action.roomName, connected: action.connected }
		default:
			return state
	}
}

export default reducer