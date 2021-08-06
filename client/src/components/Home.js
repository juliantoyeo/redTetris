import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

import { createPlayer } from '../actions/playerActions';
import { SOCKET_EVENTS } from '../constants/socketConstants';
import { errorAlert } from '../utils/errorUtils';
import { doRoomSocketEvent } from '../utils/socketUtils';

import combinedContext from '../contexts/combinedContext';

import RoomDisplay from './RoomDisplay';
import NameForm from './form/NameForm';
import RoomCreationForm from './form/RoomCreationForm';


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
		fontSize: '1vw'
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
	}
}

const Home = (props) => {
	const { socket } = props;
	const history = useHistory();
	const [state, dispatch] = useContext(combinedContext);
	const { currentPlayer, rooms } = state;
	const [form, setForm] = useState({ playerName: '', roomName: '', maxPlayer: 10 });
	const [selectedRoom, setSelectedRoom] = useState(null);

	useEffect(() => {
		if (socket) {
			socket.off(SOCKET_EVENTS.START_GAME);
			socket.on(SOCKET_EVENTS.START_GAME, (updatedRoom) => {
				console.log('WebSocket start game event received :', updatedRoom);
				history.push(`/${updatedRoom.name}[${currentPlayer.name}]`);
			});
		}
	}, [socket, currentPlayer]);

	const onFormChange = (event, type) => {
		const value = event.target.value;
		setForm(prev => ({
			playerName: type === 'playerName' ? value : prev.playerName,
			roomName: type === 'roomName' ? value : prev.roomName,
			maxPlayer: type === 'maxPlayer' ? parseInt(value) : prev.maxPlayer
		}))
	}

	const onSubmitName = async (event) => {
		event.preventDefault();
		createPlayer(socket, form.playerName)(dispatch);
	}

	const onCreateRoom = (event) => {
		event.preventDefault();
		const data = {
			newRoom: {
				name: form.roomName,
				owner: currentPlayer.name,
				maxPlayer: form.maxPlayer
			},
			playerName: currentPlayer.name,
			isJoinRoom: true
		}
		doRoomSocketEvent(socket, setSelectedRoom, SOCKET_EVENTS.CREATE_ROOM, data);
	}

	const onJoinOrLeaveRoom = (room, isJoinRoom) => {
		const data = {
			roomName: room.name,
			playerName: currentPlayer.name,
			isJoinRoom
		}
		if (isJoinRoom || room.players.length > 1) {
			doRoomSocketEvent(socket, setSelectedRoom, SOCKET_EVENTS.UPDATE_ROOM, data);
		} else {
			doRoomSocketEvent(socket, setSelectedRoom, SOCKET_EVENTS.DELETE_ROOM, data);
		}
	}

	const onStartGame = (room) => {
		if (socket)
			socket.emit(SOCKET_EVENTS.START_GAME, room.name, (res) => {
				if (res.status !== 200) {
					errorAlert(res.msg);
				}
			});
	}

	const getRooms = () => {
		if (selectedRoom) {
			const room = _.find(rooms, (room) => room.name === selectedRoom.name);
			if (room) return <RoomDisplay room={room} isLobby={true} isOwner={room.owner === currentPlayer.name} onClick={onStartGame} onLeave={(room) => onJoinOrLeaveRoom(room, false)} />;
		}
		else if (!_.isEmpty(rooms))
			return _.map(rooms, (room, index) => <RoomDisplay room={room} onClick={(room) => onJoinOrLeaveRoom(room, true)} key={`${room.name}#${index}`} />);
		return <RoomDisplay room={null} onClick={null} />;
	}

	return (
		<div style={styles.mainContainer}>
			{!_.isEmpty(currentPlayer) ?
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
	);
}

Home.propTypes = {
	socket: PropTypes.object
};

export default Home;