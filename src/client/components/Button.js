import React from 'react'

const styles = {
	mainContainer: {
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0 auto',
		height: '5vw',
		width: '100%',
		borderRadius: '4vw',
		color: 'white',
		background: '#333',
		outline: 'none',
		cursor: 'pointer'
	}
}

const Button = (props) => {
	return (
		<div style={styles.mainContainer} onClick={props.onClick}>
			{props.text}
		</div>
	)
}

export default Button