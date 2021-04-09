import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentPlayer } from '../selectors/rootSelector'
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
	buttonContainer: {
		width: '20%',
		display: 'flex',
		justifyContent: 'space-evenly'
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
	const { room, onClick, onLeave } = props
	const currentPlayer = useSelector(selectCurrentPlayer)
	const isLobby = currentPlayer.roomName === room.name

	if (!room)
		return (<div style={styles.mainContainer} key={'empty'}><span>No room to join</span></div>)

	let canJoin = true
	const playerCount = room.players.length
	if (playerCount === room.maxPlayer)
		canJoin = false
	return (
		<div style={styles.mainContainer} key={`${room.name}#`}>
			<span style={styles.text}>Room Name : {room.name}</span>
			<span style={styles.text}>Created By : {room.creator}</span>
			<span style={styles.text}>Player Count : {`${playerCount}/${room.maxPlayer}`}</span>
			{isLobby ?
			<div style={styles.buttonContainer}>
				<Button style={{ width: '40%' }} type={'button'} onClick={() => onLeave(room)} text={'Leave'} />
				<Button style={{ width: '40%', backgroundColor: `rgba(${COLORS.DARK_GREEN}, 1)` }} type={'button'} onClick={() => onClick(room)} text={'Start'} />
			</div> :
				<Button style={{ width: '15%' }} type={'button'} onClick={() => onClick(room)} isDisable={!canJoin} text={canJoin ? 'Join' : 'Full'} />
			}
		</div>
	)
}

export default RoomDisplay