import React, { useState, useEffect } from 'react'
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
		width: '50vw',
		padding: '2vw'
		// minheight: '10vw'
	},
	form: {
		// marginTop: "50px",
		width: "100%",
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
		// fontSize: "1em",
		width: window.innerWidth <= 600 ? "100%" : "50%",
		// marginBottom: "10px",
		// marginRight: "10px",
	},
	textInput: {
		display: "flex",
		flexDirection: "row",
		// fontSize: "1em",
		border: "1px solid #ccc",
		color: "#6A6A6A",
		width: "100%",
		height: "3vw",
		textAlign: 'center',
		// padding: "0.5vw",
		justifyContent: "space-between",
		// marginBottom: "10px",
		// marginRight: "10px",
		backgroundColor: "white",
	},
	submit: {
		backgroundColor: `rgba(${COLORS.RED}, 1)`,
		borderRadius: "1vw",
		fontSize: "1em",
		height: "3vw",
		width: window.innerWidth <= 600 ? "100%" : "20%",
		// marginTop: "30px",
		color: "white",
		// padding: "1vw",
		cursor: "pointer",
	},
}

const Home = () => {
	const [form, setform] = useState({})

	const onSearchChange = (event, type) => {
		if (type == "playerName") {
			const playerName = _.toUpper(event.target.value)
			setform({
				...form,
				playerName,
			})
		}
	}

	const onSubmit = async (event) => {
		event.preventDefault()
	}

	return (
		<div style={styles.mainContainer}>
			<div style={styles.box}>
				Welcome to Red Tetris!
				<form style={styles.form} onSubmit={onSubmit}>
					<div style={styles.inputLabel}>
						Enter Your Name
					</div>
					<label style={styles.inputLabel}>
						<input
							name={"playerName"}
							style={{ ...styles.textInput, ...styles.upperCase}}
							type={"text"}
							defaultValue={form.playerName}
							onChange={(e) => onSearchChange(e, "playerName")}
							required
						/>
					</label>
					<button style={styles.submit} type={"submit"}>Play</button>
				</form>
			</div>
		</div>
	)
}

export default Home