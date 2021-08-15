import React from 'react'
import { createMemoryHistory } from 'history'
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

import Tetris from './Tetris'
import Home from './Home'
import CombinedContext from '../contexts/combinedContext'
import useCombinedReducers from '../reducers/combinedReducers'
import { initiateSocket, disconnectSocket } from '../actions/server';

const App = () => {
	const [state, dispatch] = useCombinedReducers();
	const [socket, setSocket] = React.useState(null);
	const history = createMemoryHistory();

	React.useEffect(() => {
		if (!socket) {
			setSocket(initiateSocket(dispatch));
		}

		return () => {
			disconnectSocket(socket);
		}
	}, []);

	return (
		<CombinedContext.Provider value={[state, dispatch]}>
			<Router history={history}>
				<Switch>
					<Route exact path={'/:roomName[:playerName]'}>
						<Tetris socket={socket}/>
					</Route>
					<Route exact path={'*'}>
						<Home socket={socket}/>
					</Route>
				</Switch>
			</Router>
		</CombinedContext.Provider>
	)
}

export default App


