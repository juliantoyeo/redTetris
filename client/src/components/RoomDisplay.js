import React from 'react';
import PropTypes from 'prop-types';

import Button from './subComponents/Button';
import { COLORS } from '../constants/gameConstant';

const styles = {
	mainContainer: {
		border: '1px solid #333',
		display: 'flex',
		alignItems: 'center',
		borderRadius: '3vw',
		justifyContent: 'space-around',
		height: '5vw',
		margin: '1vw 0'
	},
	buttonContainer: {
		width: '20%',
		display: 'flex',
		justifyContent: 'space-evenly'
	},
	text: {
		width: '15%',
		whiteSpace: 'nowrap',
		textAlign: 'left',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}
}

const RoomDisplay = (props) => {
	const { room, isLobby, isOwner, onClick, onLeave } = props;

	if (!room)
		return (<div style={styles.mainContainer} key={'empty'}><span>No room to join</span></div>);

	let isFull = false;
	const playerCount = room.players.length;
	if (playerCount === room.maxPlayer)
		isFull = true;
	return (
		<div style={styles.mainContainer} key={`${room.name}#`}>
			<span style={styles.text}>Room Name : {room.name}</span>
			<span style={styles.text}>Room Owner : {room.owner}</span>
			<span style={styles.text}>Player Count : {`${playerCount}/${room.maxPlayer}`}</span>
			<span style={styles.text}>Game Mode : {room.gameMode}</span>
			{isLobby ?
				<div style={styles.buttonContainer}>
					<Button className={'leaveRoom'} style={{ width: '40%' }} type={'button'} onClick={() => onLeave(room)} text={'Leave'} />
					{isOwner && <Button className={'startGame'} style={{ width: '40%', backgroundColor: `rgba(${COLORS.DARK_GREEN}, 1)` }} type={'button'} onClick={() => onClick(room)} text={'Start'} />}
				</div> :
				<Button className={'joinRoom'} style={{ width: '15%' }} type={'button'} onClick={() => onClick(room)} isDisable={isFull || room.isStarted} text={room.isStarted ? 'Game Started' : isFull ? 'Full' : 'Join'} />
			}
		</div>
	)
}

RoomDisplay.propTypes = {
	room: PropTypes.object,
	isLobby: PropTypes.bool,
	isOwner: PropTypes.bool,
	onClick: PropTypes.func,
	onLeave: PropTypes.func
};

export default RoomDisplay;