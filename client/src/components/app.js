import React from 'react'
import '@babel/polyfill' // for aysnc function
import {
	HashRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';
import Tetris from './Tetris'
import Home from './Home'
import CombinedContext from '../contexts/combinedContext'
import useCombinedReducers from '../reducers/combinedReducers'


const App = () => {

	const [state, dispatch] = useCombinedReducers()

	return (
		<CombinedContext.Provider value={[state, dispatch]}>
			<Router>
				<Switch>
					<Route exact path={'/:roomName[:playerName]'}>
						<Tetris />
					</Route>
					<Route exact path={'*'}>
						<Home />
					</Route>
				</Switch>
			</Router>
		</CombinedContext.Provider>
	)
}

export default App


