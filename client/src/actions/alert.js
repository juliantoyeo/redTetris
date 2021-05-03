import { ACTIONS } from '../constants/actionConstant'

export const alert = (message) => {
	return {
		type: ACTIONS.ALERT_POP,
		message
	}
}

