import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { COLORS } from '../constants/gameConstant'

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
		fontFamily: "Avenir Next",
		fontSize: '1.2vw',
	},
	box: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px solid #333',
		borderRadius: '3vw',
		width: '70vw',
		padding: '2vw'
		// minheight: '10vw'
	},
	form: {
		// marginTop: "50px",
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		textAlign: 'center',
		// padding: '2vw',
		height: '15vw',
		// border: '2px solid #333'
	},
	inputLabel: {
		// fontSize: '1em',
		width: '70%',
		// marginBottom: '10px',
		// marginRight: '10px',
	},
	textInput: {
		display: 'flex',
		flexDirection: 'row',
		// fontSize: '1em',
		border: '1px solid #333',
		color: '#6A6A6A',
		width: '100%',
		height: '3vw',
		textAlign: 'center',
		borderRadius: '3vw',
		// padding: '0.5vw',
		justifyContent: 'space-between',
		// marginBottom: '10px',
		// marginRight: '10px',
		backgroundColor: 'white',
	},
	submit: {
		backgroundColor: `rgba(${COLORS.RED}, 1)`,
		borderRadius: '1vw',
		fontSize: '1em',
		height: '3vw',
		width: '20%',
		// marginTop: '30px',
		color: 'white',
		// padding: '1vw',
		cursor: 'pointer',
	},
	roomContainer: {
		width: '100%',
		minHeight: '2vw',
		textAlign: 'center',
		padding: '1vw 0',
		maxHeight: '45vw',
		overflow: 'auto'
	},
	room: {
		border: '1px solid #333',
		display: 'flex',
		alignItems: 'center',
		borderRadius: '3vw',
		justifyContent: 'space-around',
		height: '5vw',
		margin: '1vw 0',
		// padding: '1vw 0'
	},
	text: {
		width: '20%',
		whiteSpace: 'nowrap',
		textAlign: 'left',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	}
}

const Home = () => {
	const history = useHistory();
	const [form, setform] = useState({ playerName: "", roomName: ""})
	const [playerName, setPlayerName] = useState(null)
	// const [rooms, setRooms] = useState([{ name:"testRoom", creator:"player123", playerCount: 0 }])
	const [rooms, setRooms] = useState([])

	// console.log("form", form)
	// console.log("rooms", rooms)

	const onSearchChange = (event, type) => {
		if (type == "playerName") {
			const playerName = event.target.value
			setform({
				...form,
				playerName,
			})
		}
		else if (type == "roomName") {
			const roomName = event.target.value
			setform({
				...form,
				roomName,
			})
		}
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
			playerCount: 0
		}
		const newRooms = _.cloneDeep(rooms)
		newRooms.push(room)
		setRooms(newRooms)
	}

	const onJoinRoom = (roomName, player) => {
		console.log("im hereeeee ", roomName, player)
		history.push(`/${roomName}[${player}]`)
	}

	const getRooms = () => {
		let roomArray = []
		if (!_.isEmpty(rooms)) {
			roomArray = _.map(rooms, (room, index) => {
				return (
					<div style={styles.room} key={`${room.name}#${index}`}>
						<span style={styles.text}>Created By: {room.creator}</span>
						<span style={styles.text}>Player Count: {room.playerCount}</span>
						<button style={styles.submit} onClick={() => onJoinRoom(room.name, playerName)}>Join</button>
					</div>
				)
			})
		}
		else {
			roomArray.push(
				<div style={styles.room} key={'empty'}>
					<span>No room to join</span>
				</div>
			)
		}
		// console.log("roomArray", roomArray)
		return roomArray
	}

	return (
		<div style={styles.mainContainer}>
			{playerName ? 
			<div style={styles.box}>
				<span>Rooms : </span>
				<div style={styles.roomContainer}>
					{getRooms()}
				</div>
				<form style={styles.form} onSubmit={onSubmitRoom} key={"roomForm"}>
					<div style={styles.inputLabel}>
						Create Room
					</div>
					<label style={styles.inputLabel}>
						<input
							name={"roomName"}
							style={styles.textInput}
							type={"text"}
							defaultValue={form.roomName}
							onChange={(e) => onSearchChange(e, "roomName")}
							required
						/>
					</label>
					<button style={styles.submit} type={"submit"}>Create</button>
				</form>
			</div>
			: 
			<div style={styles.box}>
				Welcome to Red Tetris!
				<form style={styles.form} onSubmit={onSubmitName} key={"nameForm"}>
					<div style={styles.inputLabel}>
						Enter Your Name
					</div>
					<label style={styles.inputLabel}>
						<input
							name={"playerName"}
							style={styles.textInput}
							type={"text"}
							defaultValue={form.playerName}
							onChange={(e) => onSearchChange(e, "playerName")}
							required
						/>
					</label>
					<button style={styles.submit} type={"submit"}>Play</button>
				</form>
			</div>}
		</div>
	)
}

export default Home