import React from 'react'
import { connect } from 'react-redux'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";
import Tetris from './Tetris'


const App = (props) => {
	props
	return (
		<Router>
			<Switch>
				<Route exact path={'*'}>
					<div className="App">
						<Tetris/>
					</div>
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


