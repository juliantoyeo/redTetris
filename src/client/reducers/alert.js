import { ACTIONS } from '../constants/actionConstant'

const reducer = (state = null , action) => {
	switch(action.type){
	case ACTIONS.ALERT_POP:
		return { ...state, message: action.message }
	default: 
		return state
	}
}

export default reducer

