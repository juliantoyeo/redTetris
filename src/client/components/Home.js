import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { createPlayer, updatePlayer } from '../actions/playerActions'
import { addRoom, deleteRoom, updateRoom } from '../actions/roomActions'

import combinedContext from '../contexts/combinedContext'

import RoomDisplay from './RoomDisplay'
import NameForm from './form/NameForm'
import RoomCreationForm from './form/RoomCreationForm'
import _ from 'lodash';

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
	const [state, dispatch] = useContext(combinedContext)
	const { currentPlayer, rooms } = state
	const [form, setForm] = useState({ playerName: '', roomName: '', maxPlayer: 1 })
	const [selectedRoom, setSelectedRoom] = useState(null)

	console.log('state', state)


	useEffect(() => {
		// const newPlayer = {
		// 	name: 'player123',
		// 	roomName: 'hsdjasjh'
		// }
		// const newRoom = {
		// 	name:'testRoom',
		// 	creator:'im here',
		// 	players: ['im here'],
		// 	maxPlayer: 2
		// }
		// dispatch(createPlayer(newPlayer))
		// dispatch(addRoom(newRoom))
		// dispatch(addRoom(newRoom))
		// dispatch(addRoom(newRoom))
	}, [])

	const onFormChange = (event, type) => {
		const value = event.target.value
		setForm(prev => ({
			playerName: type === 'playerName' ? value : prev.playerName,
			roomName: type === 'roomName' ? value : prev.roomName,
			maxPlayer: type === 'maxPlayer' ? parseInt(value) : prev.maxPlayer,
		}))
	}


	const onSubmitName = (event) => {
		event.preventDefault()
		const newPlayer = {
			name: form.playerName,
			roomName: ''
		}
		dispatch(createPlayer(newPlayer))
	}

	const enterOrLeaveRoom = (room) => {
		const updatedPlayer = {
			...currentPlayer,
			roomName: room ? room.name : ''
		}
		setSelectedRoom(room)
		dispatch(updatePlayer(updatedPlayer))
	}

	const onCreateRoom = (event) => {
		event.preventDefault()
		const newRoom = {
			name: form.roomName,
			creator: currentPlayer.name,
			players: [currentPlayer.name],
			maxPlayer: form.maxPlayer
		}
		dispatch(addRoom(newRoom))
		enterOrLeaveRoom(newRoom)
	}

	const onJoinRoom = (room) => {
		const updatedRoom = {
			...room,
			players: [...room.players, currentPlayer.name]
		}
		dispatch(updateRoom(updatedRoom))
		enterOrLeaveRoom(updatedRoom)
	}

	const onLeaveGame = (room) => {
		const updatedRoom = {
			...room,
			players: _.filter(room.players, (player) => player !== currentPlayer.name)
		}
		if (updatedRoom.players.length === 0)
			dispatch(deleteRoom(updatedRoom))
		else
			dispatch(updateRoom(updatedRoom))
		enterOrLeaveRoom(null)
	}

	const onStartGame = (room) => {
		history.push(`/${room.name}[${currentPlayer.name}]`)
	}

	const getRooms = () => {
		if (selectedRoom)
			return <RoomDisplay room={_.find(rooms, (room) => room.name === currentPlayer.roomName)} onClick={onStartGame} onLeave={onLeaveGame}/>
		else if (!_.isEmpty(rooms))
			return _.map(rooms, (room, index) => <RoomDisplay room={room} onClick={onJoinRoom} key={`${room.name}#${index}`} />)
		return <RoomDisplay room={null} onClick={null} />
	}

	return (
		<div style={styles.mainContainer}>
			{currentPlayer.connected ?
			<div style={styles.box}>
				<span className={'header'}>{!selectedRoom? 'Available Rooms' : 'Game Lobby'}</span>
				<div style={styles.roomContainer}>
					{getRooms()}
				</div>
				{!selectedRoom && <RoomCreationForm  onSubmit={onCreateRoom} onChange={onFormChange} />}
			</div> :
			<div style={styles.box}>
				<NameForm onSubmit={onSubmitName} onChange={onFormChange} />
			</div>}
		</div>
	)
}

export default Home