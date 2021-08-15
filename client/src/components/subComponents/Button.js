import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/gameConstant';

const styles = {
	mainContainer: {
		boxSizing: 'border-box',
		width: '100%',
		height: '3vw',
		color: 'white',
		cursor: 'pointer',
		backgroundColor: `rgba(${COLORS.DARK_RED}, 1)`,
		borderRadius: '1vw',
		fontSize: '1em'
	},
	disable: {
		cursor: 'cursor',
		backgroundColor: `rgba(${COLORS.RED}, 1)`
	}
}

const Button = (props) => {
	const { type, style, onClick, text, isDisable } = props;

	const onButtonClick = () => {
		if (isDisable)
			return;
		else if (onClick)
			onClick();
	}

	return (
		<button style={{ ...styles.mainContainer, ...style, ...(isDisable ? styles.disable : {}) }} type={type} onMouseDown={onButtonClick}>{text}</button>
	)
}

Button.propTypes = {
	type: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
	text: PropTypes.string,
	isDisable: PropTypes.bool
};

export default Button;