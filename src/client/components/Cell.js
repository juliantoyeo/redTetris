import React from 'react'
import { PIECES } from '../constants/gameConstant'

const mainContainerStyle = (props) => {
	return ({
		width: 'auto',
		background: `rgba(${props.color}, 0.8)`,
		border: `${props.type === '0' ? '1px solid' : '0.6vw solid'}`,
		borderColor: `rgba(${props.color}, 1)`,
		// borderBottomColor: `rgba(${props.color}, 0.1)`,
		// borderRightColor: `rgba(${props.color}, 1)`,
		// borderTopColor: `rgba(${props.color}, 1)`,
		// borderLeftColor: `rgba(${props.color}, 0.3)`
	})
}

const Cell = (props) => {
	const { type } = props
	return (
		<div style={mainContainerStyle({ type, color: PIECES[type].color })} className={"cell"}/>
	)
}

export default React.memo(Cell)