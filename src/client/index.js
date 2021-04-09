import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './components/app'
import {alert} from './actions/alert'

ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

// store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
