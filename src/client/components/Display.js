import React from 'react'

const mainContainerStyle = (props) => {
	return ({
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		margin: '0 0 20px 0',
		padding: '20px',
		border: '2px solid #333',
		minHeight: '30px',
		width: '100%',
		borderRadius: '20px',
		color: `${props.gameOver ? 'red' : '#999'}`,
	})
}

const Display = (props) => {
	return (
		<div style={mainContainerStyle(props)}>
			{props.text}
			{props.child}
		</div>
	)
}

export default Display