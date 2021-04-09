import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/rootReducer'

const store = createStore(
	rootReducer,
	applyMiddleware(thunk, createLogger())
)

export default store
