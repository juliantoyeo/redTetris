import { PIECES } from '../constants/gameConstant'

export const randomPiece = () => {
	const pieces = 'IJLOSZT'
	const randPiece = pieces[Math.floor(Math.random() * pieces.length)]
	return PIECES[randPiece]
}