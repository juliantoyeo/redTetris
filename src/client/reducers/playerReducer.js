import { PLAYER_ACTIONS } from '../constants/actionConstant'

const reducer = (state = null , action) => {
	switch(action.type){
	case PLAYER_ACTIONS.CREATE_PLAYER:
		return { ...state, ...action.currentPlayer }
	case PLAYER_ACTIONS.UPDATE_PLAYER:
			return { ...state, ...action.currentPlayer }
	default:
		return state
	}
}

export default reducer