import { combineReducers } from 'redux'
import alertReducer from './alert'
import playerReducer from './playerReducer'

const rootReducer = combineReducers({
	message: alertReducer,
	currentPlayer: playerReducer
})

export default rootReducer