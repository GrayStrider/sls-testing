import {Board, KBFParamsGeneric, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet} from './KBF'

const getBoard = () => kanbanGet<Board>({resource: 'board'})
const getTaskByID = (id: Task['_id']) => kanbanGet<Task>({resource: `tasks/${id}`})
const getTasksByColumn = (params: getTasksByColumnParams) =>
	kanbanGet<Tasks>({resource: 'tasks', params: params})



export interface getTasksByColumnParams {
	columnId: string
}

export {getBoard, getTaskByID, getTasksByColumn}
