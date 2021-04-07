import React from 'react'
import { connect } from 'react-redux'
import '@babel/polyfill' // for aysnc function
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";
import Tetris from './Tetris'
import Home from './Home'


const App = (props) => {
	props
	return (
		<Router>
			<Switch>
				<Route exact path={'/'}>
					<Home />
				</Route>
				<Route exact path={'*'}>
					<Tetris />
				</Route>
			</Switch>
		</Router>
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		...ownProps,
		message: state.message
	}
}

const mapDispatchToProps = (dispatch) => { //testing dispatch
	return {
		alert: (message) => {
			dispatch(
				{
					type: "test",
					message
				}
			)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)


