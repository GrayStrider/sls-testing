import {Board, Tasks} from '../../types/kanbanflow'
import {kanbanGet} from './KBF'

const getBoard = () => kanbanGet<Board>('board')
const getTasks = () => kanbanGet<Tasks>('task')
export {getBoard}
