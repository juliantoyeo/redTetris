import { combineReducers } from 'redux'
import alertReducer from './alert'
import playerReducer from './playerReducer'
import roomReducer from './roomReducer'

const rootReducer = combineReducers({
	message: alertReducer,
	currentPlayer: playerReducer,
	rooms: roomReducer
})

export default rootReducer