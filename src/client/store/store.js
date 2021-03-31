import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../reducers'

export const initialState = {
	message: "",
	test: "123"
}

const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, createLogger())
)

export default store
