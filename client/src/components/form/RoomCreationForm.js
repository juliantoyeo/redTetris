import React from 'react';
import PropTypes from 'prop-types';

import Button from '../subComponents/Button';
import { MAX_PLAYER, GAME_MODE } from '../../constants/gameConstant';

const styles = {
	input: {
		width: '30%'
	},
	formContainer: {
		height: '20vw',
		border: '1px solid #333',
		margin: '1vw 0',
		borderRadius: '3vw',
		display: 'flex',
		flexDirection: 'column'
	},
	upperForm: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	lowerForm: {
		width: '50%',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
}

const RoomCreationForm = (props) => {
	const { onSubmit, onChange, form } = props;
	return (
		<div className={'formContainer'}>
			<span className={'header'}>Create Room</span>
			<form onSubmit={onSubmit} key={'roomForm'} className={'standardForm'} style={styles.formContainer}>
				<div style={styles.upperForm}>
					<label>
						Room Name
					</label>
					<input
						name={'roomName'}
						className={'inputField'}
						style={styles.input}
						type={'text'}
						onChange={(e) => onChange(e, 'roomName')}
						autoComplete='off'
						required
					/>
					<label>
						Max Player
					</label>
					<input
						name={'maxPlayer'}
						className={'inputField'}
						style={styles.input}
						type={'number'}
						onChange={(e) => onChange(e, 'maxPlayer')}
						value={form.maxPlayer}
						required
						step={'1'}
						min={'1'}
						max={MAX_PLAYER}
					/>
				</div>
				<div style={styles.lowerForm}>
					<label style={styles.inputLabel}>
						Game Mode
					</label>
					<div className="radio">
						<label>
							<input
								type="radio"
								value={GAME_MODE.NORMAL}
								checked={form.gameMode === GAME_MODE.NORMAL}
								onChange={() => onChange(GAME_MODE.NORMAL, 'gameMode')}
							/>
							{GAME_MODE.NORMAL}
						</label>
					</div>
					<div className="radio">
						<label>
							<input
								type="radio"
								value={GAME_MODE.NO_GHOST_PIECE}
								checked={form.gameMode === GAME_MODE.NO_GHOST_PIECE}
								onChange={() => onChange(GAME_MODE.NO_GHOST_PIECE, 'gameMode')}
							/>
							{GAME_MODE.NO_GHOST_PIECE}
						</label>
					</div>
				</div>
				<Button style={{ width: '15%' }} type={'submit'} text={'Create'} />
			</form>
		</div>
	)
}

RoomCreationForm.propTypes = {
	onSubmit: PropTypes.func,
	onChange: PropTypes.func,
	form: PropTypes.object
};

export default RoomCreationForm;