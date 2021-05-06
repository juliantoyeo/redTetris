import React, { useEffect, useState } from 'react'
// import '@babel/polyfill/noConflict' // for aysnc function
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import _ from 'lodash';

import Tetris from './Tetris'
import Home from './Home'
import CombinedContext from '../contexts/combinedContext'
import useCombinedReducers from '../reducers/combinedReducers'
import { initiateSocket, disconnectSocket } from '../actions/server';
import { SOCKET_ACTIONS } from '../constants/socketConstants';
import { addRoom } from '../actions/roomActions';



const App = () => {
	const [state, dispatch] = useCombinedReducers();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!socket) {
			const newSocket = initiateSocket();
			setSocket(newSocket);

			newSocket.emit(SOCKET_ACTIONS.FECTH_ALL_ROOM, (res) => {
				console.log('WebSocket fecth all room event received :', res);
				if (res.status === 200) {
					_.map(res.rooms, (room) => {
						dispatch(addRoom(room));
					})
				}
			});

			newSocket.on('disconnect', () => {
				console.log('server disconected')
				alert('Server disconnected press OK to refresh')
				window.location.reload();
			});
		}

		const newRoom = {
			name:'aaRR',
			owner:'aaaa',
			// players: ['aaaa'],
			// players: ['aaaa', 'bbbb'],
			// players: ['aaaa', 'bbbb', 'cccc'],
			// players: ['aaaa', 'bbbb', 'cccc', 'dddd'],
			// players: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee'],
			// players: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff'],
			// players: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg'],
			players: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg', 'hhhh'],
			maxPlayer: 10
		}

		dispatch(addRoom(newRoom));

		return () => {
			disconnectSocket(socket);
		}
	}, []);

	return (
		<CombinedContext.Provider value={[state, dispatch]}>
			<Router>
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


