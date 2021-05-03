import { useReducer } from 'react'
import playerReducer, { playerInitialState } from './playerReducer'
import roomReducer, { roomsInitialState } from './roomReducer'

const useCombinedReducers = () => {

	const combinedReducers = {
		currentPlayer: useReducer(playerReducer, playerInitialState),
		rooms: useReducer(roomReducer, roomsInitialState),
	}

	// Global State
	const state = Object.keys(combinedReducers).reduce(
		(acc, key) => ({ ...acc, [`${key}`]: combinedReducers[`${key}`][0] }), {});

	// Global Dispatch Function
	const dispatch = action =>
		Object.keys(combinedReducers)
			.map(key => combinedReducers[`${key}`][1])
			.forEach(fn => fn(action));

	return [state, dispatch];
}

export default useCombinedReducers;