import { initialState } from '../store/store'
import { ACTIONS } from '../constants/actionConstant'

const reducer = (state = initialState , action) => {
	switch(action.type){
	case ACTIONS.ALERT_POP:
		return { ...state, message: action.message }
	default: 
		return state
	}
}

export default reducer

