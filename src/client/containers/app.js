import React from 'react'
import { connect } from 'react-redux'
import Tetris from '../components/Tetris'


const App = (props) => {
	props
	return (
		// <span>{props.message}</span>
		<div className="App">
			<Tetris/>
		</div>
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


