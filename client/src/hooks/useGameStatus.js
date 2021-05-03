import { useState, useEffect } from 'react'

export const useGameStatus = (rowsCleared) => {
	const [gameStatus, setGameStatus] = useState({
		score: 0,
		rows: 0,
		level: 0,
	})

	const linePoints = [40, 100, 300, 1200]

	const calcScore = () => {
		if (rowsCleared > 0) {
			setGameStatus(prev => ({
				...prev,
				score: prev.score + linePoints[rowsCleared - 1] * (prev.level + 1),
				rows: prev.rows + rowsCleared
			}))
		}
	}

	useEffect(() => {
		calcScore()
	}, [rowsCleared])

	return [gameStatus, setGameStatus]
}