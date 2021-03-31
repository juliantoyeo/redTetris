import React from 'react'

const mainContainerStyle = (props) => {
	return ({
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		margin: '0 0 20px 0',
		padding: '20px',
		minHeight: '30px',
		width: '100%',
		borderRadius: '20px',
		border: 'none',
		color: 'white',
		background: '#333',
		outline: 'none',
		fontFamily: "Avenir Next",
		fontSize: '0.8rem',
		cursor: 'pointer'
	})
}

const StartButton = (props) => {
	props
	return (
		<div style={mainContainerStyle()} onClick={props.onClick}>
			Start Game
		</div>
	)
}

export default StartButton