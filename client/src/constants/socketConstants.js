export const SOCKET_RES = {
	PLAYER_CREATED: 'PLAYER_CREATED',
	PLAYER_NAME_EXIST: 'PLAYER_NAME_EXIST',
	PLAYER_NOT_EXIST: 'PLAYER_NOT_EXIST',
	ROOM_CREATED: 'ROOM_CREATED',
	ROOM_NAME_EXIST: 'ROOM_NAME_EXIST',
	ROOM_DOESNT_EXIST: 'ROOM_DOESNT_EXIST',
	ROOM_UPDATED: 'ROOM_UPDATED',
	ROOM_DELETED: 'ROOM_DELETED'
}

export const SOCKET_EVENTS = {
	START_GAME: 'START_GAME',
	RESTART_GAME: 'RESTART_GAME',
	CREATE_PLAYER: 'CREATE_PLAYER',
	UPDATE_PLAYER: 'UPDATE_PLAYER',
	FECTH_ALL_ROOM: 'FECTH_ALL_ROOM',
	CREATE_ROOM: 'CREATE_ROOM',
	UPDATE_ROOM: 'UPDATE_ROOM',
	DELETE_ROOM: 'DELETE_ROOM',
	UPDATE_BOARD: 'UPDATE_BOARD',
	GET_NEW_STACK: 'GET_NEW_STACK',
	UPDATE_STACK_INDEX: 'UPDATE_STACK_INDEX',
	ADD_BLOCKING_ROW: 'ADD_BLOCKING_ROW',
	SET_PLAYER_GAME_OVER: 'SET_PLAYER_GAME_OVER',
	GAME_IS_OVER: 'GAME_IS_OVER'
}
