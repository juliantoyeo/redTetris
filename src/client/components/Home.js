import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { COLORS } from '../constants/gameConstant'

import RoomDisplay from './RoomDisplay'
import Button from './subComponents/Button'
import NameForm from './form/NameForm'
import RoomCreationForm from './form/RoomCreationForm'

const styles = {
	mainContainer: {
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100vw',
		height: '100vh',
		color: 'white',
		backgroundColor: '#555',
		backgroundSize: 'cover',
		fontFamily: 'Avenir Next',
		fontSize: '1vw',
	},
	box: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px solid #333',
		borderRadius: '3vw',
		width: '80vw',
		padding: '2vw'
	},
	roomContainer: {
		width: '100%',
		minHeight: '2vw',
		textAlign: 'center',
		padding: '1vw 0',
		maxHeight: '20vw',
		overflow: 'auto'
	},
}

const Home = () => {
	const history = useHistory();
	const [form, setform] = useState({ playerName: '', roomName: '', maxPlayer: 1 })
	const [playerName, setPlayerName] = useState(null)
	const [rooms, setRooms] = useState([])
	// const [playerName, setPlayerName] = useState('player123')
	// const [rooms, setRooms] = useState([{ name:'testRoom', creator:'player123', playerCount: 1, maxPlayer: 1 }])

	console.log('form', form)
	// console.log('rooms', rooms)

	const onFormChange = (event, type) => {
		const value = event.target.value
		setform(prev => ({
			playerName: type === 'playerName' ? value : prev.playerName,
			roomName: type === 'roomName' ? value : prev.roomName,
			maxPlayer: type === 'maxPlayer' ? parseInt(value) : prev.maxPlayer,
		}))
	}

	const onSubmitName = (event) => {
		event.preventDefault()
		setPlayerName(form.playerName)
	}

	const onSubmitRoom = (event) => {
		event.preventDefault()
		const room = {
			name: form.roomName,
			creator: playerName,
			playerCount: 0,
			maxPlayer: form.maxPlayer
		}
		const newRooms = _.cloneDeep(rooms)
		newRooms.push(room)
		setRooms(newRooms)
	}

	const onJoinRoom = (roomName) => {
		history.push(`/${roomName}[${playerName}]`)
	}

	const getRooms = () => {
		if (!_.isEmpty(rooms))
			return _.map(rooms, (room, index) => <RoomDisplay room={room} onClick={onJoinRoom} key={`${room.name}#${index}`} />)
		return <RoomDisplay room={null} onClick={null} key={`empty`} />
	}

	return (
		<div style={styles.mainContainer}>
			{playerName ?
			<div style={styles.box}>
				<span className={'header'}>All Rooms</span>
				<div style={styles.roomContainer}>
					{getRooms()}
				</div>
				<RoomCreationForm  onSubmit={onSubmitRoom} onChange={onFormChange} />
			</div> :
			<div style={styles.box}>
				<NameForm onSubmit={onSubmitName} onChange={onFormChange} />
			</div>}
		</div>
	)
}

export default Home