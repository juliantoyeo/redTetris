import React from 'react'
import Button from '../subComponents/Button'

const styles = {
	form: {
		flexDirection: 'column',
		height: '15vw',
	},
}

const NameForm = (props) => {
	const { onSubmit, onChange } = props
	return (
		<div className={'formContainer'}>
			<span className={'header'}>Welcome to Red Tetris!</span>
			<form style={styles.form} onSubmit={onSubmit} key={'nameForm'} className={'standardForm'}>
				<label style={{ width: '70%' }}>
					Enter Your Name
				</label>
				<input
					name={'playerName'}
					className={'inputField'}
					style={{ width: '50%' }}
					type={'text'}
					onChange={(e) => onChange(e, 'playerName')}
					autoComplete='off'
					required
				/>
				<Button style={{ width: '15%' }} type={'submit'} text={'Play'} />
			</form>
		</div>
	)
}

export default NameForm