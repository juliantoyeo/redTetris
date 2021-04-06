import { PIECES } from '../constants/gameConstant'

export const randomPiece = () => {
	const types = 'IJLOSZT'
	const randType = types[Math.floor(Math.random() * types.length)]
	return [PIECES[randType].shape[0], randType]
}

// try to open 2 tab on browser, both go to address 'http://localhost:8080/',
// check if the server recognize them as 2 seperate client, if else make the server register them as 2 seperate client

// on 'redTetris/src/client/components/Tetris.js' when startGame button is pressed (from any client for now) it will tell the server to start the game
// when server receive signal to start the game, the server will :
// - use redTetris/src/client/utils/boardUtils.js createBoard to create emptyBoard for each client
// - generate 2 random pieces 'IJLOSZT' (current and next piece) and send the pieces back to both client
// - tell all the client to start the game (a boolean or something)

// on 'redTetris/src/client/components/Tetris.js' useEffect for piece, send the board data back to server
// the server will then update its data of the board that belong to that client, and push it to all other client
