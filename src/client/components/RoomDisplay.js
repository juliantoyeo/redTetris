import React from 'react'
import Button from './subComponents/Button'
import { COLORS } from '../constants/gameConstant'

const styles = {
	mainContainer: {
		border: '1px solid #333',
		display: 'flex',
		alignItems: 'center',
		borderRadius: '3vw',
		justifyContent: 'space-around',
		height: '5vw',
		margin: '1vw 0',
	},
	text: {
		width: '20%',
		whiteSpace: 'nowrap',
		textAlign: 'left',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}

const RoomDisplay = (props) => {
	const { room, onClick } = props

	if (!room)
		return (<div style={styles.mainContainer} key={'empty'}><span>No room to join</span></div>)

	let canJoin = true
	if (room.playerCount === room.maxPlayer)
		canJoin = false
	return (
		<div style={styles.mainContainer} key={`${room.name}#`}>
			<span style={styles.text}>Room Name : {room.name}</span>
			<span style={styles.text}>Created By : {room.creator}</span>
			<span style={styles.text}>Player Count : {`${room.playerCount}/${room.maxPlayer}`}</span>
			<Button style={{ width: '15%' }} type={'button'} onClick={() => onClick(room.name)} isDisable={!canJoin} text={canJoin ? 'Join' : 'Full'} />
		</div>
	)
}

export default RoomDisplay