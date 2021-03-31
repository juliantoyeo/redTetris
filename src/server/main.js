import params  from '../../params'
import * as server from './index'
// eslint-disable-next-line no-console
server.create(params.server).then( () => console.log('not yet ready to play tetris with U ...') )
