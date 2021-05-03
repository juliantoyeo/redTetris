import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import { updatePlayer, createPlayer } from '../actions/playerActions'
import { initiateSocket, disconnectSocket } from '../actions/server';
import { addRoom, deleteRoom, updateRoom } from '../actions/roomActions'
import { SOCKET_RES, SOCKET_ACTIONS } from '../constants/socketConstants'

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
	const [state, dispatch] = useContext(combinedContext);

	const [socket, setSocket] = useState(null);
	const [form, setForm] = useState({ playerName: '', roomName: '', maxPlayer: 2 });
	const [selectedRoom, setSelectedRoom] = useState(null);

	const { currentPlayer, rooms } = state;

	console.log('state', state)

	useEffect(() => {
		setSocket(initiateSocket())


		// const newPlayer = {
		// 	name: 'player123',
		// 	roomName: 'hsdjasjh'
		// }
		// const newRoom = {
		// 	name:'testRoom',
		// 	owner:'im here',
		// 	players: ['im here'],
		// 	maxPlayer: 2
		// }
		// addRoom(initSocket, newRoom)(dispatch)
		// dispatch(createPlayer(newPlayer))
		// dispatch(addRoom(newRoom))
		// dispatch(addRoom(newRoom))
		// dispatch(addRoom(newRoom))

		return () => {
			disconnectSocket(socket);
		}
	}, [])

	useEffect(() => {
		if (socket) {
			socket.on(SOCKET_ACTIONS.CREATE_ROOM, (newRoom) => {
				console.log('WebSocket createRoom event received :', newRoom)
				dispatch(addRoom(newRoom))
				return
			});
			socket.on(SOCKET_ACTIONS.DELETE_ROOM, (roomName) => {
				console.log('WebSocket deleteRoom event received :', roomName)
				dispatch(deleteRoom(roomName))
				return
			});
			socket.on(SOCKET_ACTIONS.UPDATE_ROOM, (updatedRoom) => {
				console.log('WebSocket updateRoom event received :', updatedRoom)
				dispatch(updateRoom(updatedRoom))
				return
			});
		}
	}, [socket])

	const onFormChange = (event, type) => {
		const value = event.target.value
		setForm(prev => ({
			playerName: type === 'playerName' ? value : prev.playerName,
			roomName: type === 'roomName' ? value : prev.roomName,
			maxPlayer: type === 'maxPlayer' ? parseInt(value) : prev.maxPlayer,
		}))
	}

	const onSubmitName = async (event) => {
		event.preventDefault()
		const newPlayer = {
			name: form.playerName,
			roomName: ''
		}
		createPlayer(socket, newPlayer)(dispatch);
	}

	const enterOrLeaveRoom = (room) => {
		const updatedPlayer = {
			...currentPlayer,
			roomName: room ? room.name : ''
		}
		setSelectedRoom(room)
		updatePlayer(socket, updatedPlayer)(dispatch);
	}

	const onCreateRoom = (event) => {
		event.preventDefault()
		const newRoom = {
			name: form.roomName,
			owner: currentPlayer.name,
			players: [currentPlayer.name],
			maxPlayer: form.maxPlayer
		}
		if (socket) socket.emit(SOCKET_ACTIONS.CREATE_ROOM, newRoom, (res) => {
			if (res.msg == SOCKET_RES.ROOM_CREATED) {
				enterOrLeaveRoom(newRoom)
			} else {
				alert('Room name exist, please try a different name')
			}
		});
	}

	const doDeleteRoom = (roomName) => {
		if (socket) socket.emit(SOCKET_ACTIONS.DELETE_ROOM, roomName, (res) => {
			if (res.msg === SOCKET_RES.ROOM_DELETED) {
				enterOrLeaveRoom(null)
			} else {
				alert('Room does not exist, please try again')
			}
		})
	}

	const doUpdateRoom = (updatedRoom, isJoinRoom) => {
		if (socket) socket.emit(SOCKET_ACTIONS.UPDATE_ROOM, updatedRoom, (res) => {
			if (res.msg === SOCKET_RES.ROOM_UPDATED) {
				enterOrLeaveRoom(isJoinRoom ? updatedRoom : null)
			} else {
				alert('Room does not exist, please try a different room')
			}
		});
	}

	const onJoinRoom = (room) => {
		const updatedRoom = {
			...room,
			players: [...room.players, currentPlayer.name]
		}
		doUpdateRoom(updatedRoom, true)
	}

	const onLeaveRoom = (room) => {
		const isOwnerLeaving = currentPlayer.name === room.owner
		const newPlayerList = _.filter(room.players, (player) => player !== currentPlayer.name)
		const updatedRoom = {
			...room,
			players: newPlayerList,
			owner: isOwnerLeaving ? _.head(newPlayerList) : room.owner
		}
		if (updatedRoom.players.length === 0)
			doDeleteRoom(updatedRoom.name)
		else
			doUpdateRoom(updatedRoom, false)
	}

	const onStartGame = (room) => {
		history.push(`/${room.name}[${currentPlayer.name}]`)
	}

	const getRooms = () => {
		if (selectedRoom) {
			const room = _.find(rooms, (room) => room.name === selectedRoom.name)
			if (room) return <RoomDisplay room={room} isLobby={true} isOwner={room.owner === currentPlayer.name} onClick={onStartGame} onLeave={onLeaveRoom} />
		}
		else if (!_.isEmpty(rooms))
			return _.map(rooms, (room, index) => <RoomDisplay room={room} onClick={onJoinRoom} key={`${room.name}#${index}`} />)
		return <RoomDisplay room={null} onClick={null} />
	}

	return (
		<div style={styles.mainContainer}>
			{currentPlayer.connected ?
				<div style={styles.box}>
					<span className={'header'}>{!selectedRoom ? 'Available Rooms' : 'Game Lobby'}</span>
					<div style={styles.roomContainer}>
						{getRooms()}
					</div>
					{!selectedRoom && <RoomCreationForm onSubmit={onCreateRoom} onChange={onFormChange} />}
				</div> :
				<div style={styles.box}>
					<NameForm onSubmit={onSubmitName} onChange={onFormChange} />
				</div>}
		</div>
	)
}

export default Home