import React from 'react';
import PropTypes from 'prop-types';

import Button from '../subComponents/Button';
import { MAX_PLAYER } from '../../constants/gameConstant';

const styles = {
	input: {
		width: '20%'
	}
}

const RoomCreationForm = (props) => {
	const { onSubmit, onChange } = props;
	return (
		<div className={'formContainer'}>
			<span className={'header'}>Create Room</span>
			<form onSubmit={onSubmit} key={'roomForm'} className={'standardForm'}>
				<label style={styles.inputLabel}>
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
				<label style={styles.inputLabel}>
					Max Player
				</label>
				<input
					name={'maxPlayer'}
					className={'inputField'}
					style={styles.input}
					type={'number'}
					onChange={(e) => onChange(e, 'maxPlayer')}
					defaultValue={2}
					required
					step={'1'}
					min={'1'}
					max={MAX_PLAYER}
				/>
				<Button style={{ width: '15%' }} type={'submit'} text={'Create'} />
			</form>
		</div>
	)
}

RoomCreationForm.propTypes = {
	onSubmit: PropTypes.func,
	onChange: PropTypes.func
};

export default RoomCreationForm;