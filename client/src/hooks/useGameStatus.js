import React from 'react'
import _ from 'lodash';

export const useGameStatus = (rowsCleared) => {
	const [gameStatus, setGameStatus] = React.useState({
		score: 0,
		rows: 0,
		level: 0
	})

	const linePoints = [40, 100, 300, 1200]

	const calcScore = () => {
		if (rowsCleared > 0) {
			const prevGameStatus = _.cloneDeep(gameStatus);
			const newScore = prevGameStatus.score + linePoints[rowsCleared - 1] * (prevGameStatus.level + 1);
			const newRows = prevGameStatus.rows + rowsCleared;
			const newLevel = Math.floor(newRows / 10);
			const newGameStatus = {
				...prevGameStatus,
				score: newScore,
				rows: newRows,
				level: newLevel
			}
			setGameStatus(newGameStatus);
		}
	}

	React.useEffect(() => {
		calcScore()
	}, [rowsCleared])

	return [gameStatus];
}