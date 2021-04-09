import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentPlayer } from '../selectors/rootSelector'
import { createPlayer, updatePlayer } from '../actions/playerActions'
import { alert } from '../actions/alert'
import { COLORS } from '../constants/gameConstant'

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
	const dispatch = useDispatch();
	const currentPlayer = useSelector(selectCurrentPlayer)
	const [form, setform] = useState({ playerName: '', roomName: '', maxPlayer: 1 })
	const [playerName, setPlayerName] = useState(null)
	// const [rooms, setRooms] = useState([])
	// const [playerName, setPlayerName] = useState('player123')
	const [rooms, setRooms] = useState([{ name:'testRoom', creator:'im here', players: ['im here'],  maxPlayer: 2 }])
	const [selectedRoom, setSelectedRoom] = useState(null)

	// console.log('form', form)
	
	// console.log(currentPlayer)
	console.log('rooms', rooms)
	useEffect(() => {
		// console.log(test)
		setPlayerName('player123')
		const newPlayer = {
			name: 'player123',
			roomName: null
		}
		dispatch(createPlayer(newPlayer))
	}, [])

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
		const newPlayer = {
			name: form.playerName,
			roomName: null
		}
		dispatch(createPlayer(newPlayer))
	}

	const enterOrLeaveRoom = (room) => {
		const updatedPlayer = {
			...currentPlayer,
			roomName: room ? room.name : null
		}
		setSelectedRoom(room)
		dispatch(updatePlayer(updatedPlayer))
	}

	const onCreateRoom = (event) => {
		event.preventDefault()
		const room = {
			name: form.roomName,
			creator: playerName,
			players: [playerName],
			maxPlayer: form.maxPlayer
		}
		const newRooms = _.cloneDeep(rooms)
		newRooms.push(room)
		setRooms(newRooms)
		enterOrLeaveRoom(room)
	}

	const onJoinRoom = (room) => {
		const updatedRoom = {
			...room,
			players: [...room.players, currentPlayer.name]
		}
		setRooms(_.unionBy([updatedRoom], rooms, 'name'))
		enterOrLeaveRoom(updatedRoom)
	}

	const onLeaveGame = (room) => {
		const updatedRoom = {
			...room,
			players: _.filter(room.players, (player) => player !== currentPlayer.name)
		}
		if (updatedRoom.players.length === 0)
			setRooms(_.filter(rooms, (room) => room.name !== updatedRoom.name))
		else
			setRooms(_.unionBy([updatedRoom], rooms, 'name'))
		enterOrLeaveRoom(null)
	}

	const onStartGame = (room) => {
		history.push(`/${room.name}[${playerName}]`)
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
			{playerName ?
			<div style={styles.box}>
				<span className={'header'}>{!selectedRoom? 'Available Rooms' : 'Game Lobby'}</span>
				<div style={styles.roomContainer}>
					{getRooms()}
				</div>
				{!selectedRoom&& <RoomCreationForm  onSubmit={onCreateRoom} onChange={onFormChange} />}
			</div> :
			<div style={styles.box}>
				<NameForm onSubmit={onSubmitName} onChange={onFormChange} />
			</div>}
		</div>
	)
}

export default Home