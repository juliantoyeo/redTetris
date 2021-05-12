import { PLAYER_ACTIONS } from '../constants/actionConstant';

export const playerInitialState = {}

const reducer = (state, action) => {
	switch (action.type) {
		case PLAYER_ACTIONS.CREATE_PLAYER:
			return { ...state, ...action.player };
		case PLAYER_ACTIONS.UPDATE_PLAYER:
			return { ...state, name: action.name, connected: action.connected };
		default:
			return state;
	}
}

export default reducer;