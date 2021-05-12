import React from 'react';
import PropTypes from 'prop-types';
import { PIECES } from '../constants/gameConstant';

const mainContainerStyle = (props) => {
	let borderWidth = 0.4;
	if (props.numberOfPlayer > 3)
		borderWidth = 0.3;
	return ({
		width: 'auto',
		background: `rgba(${props.color}, 0.8)`,
		border: `${props.type === '0' ? '1px solid' : `${borderWidth}vw solid`}`,
		borderColor: `rgba(${props.color}, 1)`
		// borderBottomColor: `rgba(${props.color}, 0.1)`,
		// borderRightColor: `rgba(${props.color}, 1)`,
		// borderTopColor: `rgba(${props.color}, 1)`,
		// borderLeftColor: `rgba(${props.color}, 0.3)`
	});
}

const Cell = (props) => {
	const { type, numberOfPlayer } = props;
	return (
		<div style={mainContainerStyle({ type, color: PIECES[type].color, numberOfPlayer: numberOfPlayer })} className={'cell'}/>
	)
}

Cell.propTypes = {
	type: PropTypes.string,
	numberOfPlayer: PropTypes.number
};

export default React.memo(Cell);