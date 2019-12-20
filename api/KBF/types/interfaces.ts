import {SubTask, Task, TaskNumber} from '../../../types/kanbanflow'

export type postReply = { taskId: string, taskNumber: TaskNumber }
export type CreateTaskParams =
	Omit<Task, '_id' | 'totalSecondsSpent' | 'color' | 'description'>
	& Partial<Pick<Task, 'color' | 'description'>>

interface KanbanPost {
	apiKey?: string;
}

interface ModifyTask {
	taskId: Task['_id'];
	
}

export type CreateParams2 = KanbanPost & CreateTaskParams

export interface CreateParams extends KanbanPost {
	params: CreateTaskParams;
}

export interface UpdateParams extends KanbanPost, ModifyTask {
	params: Partial<CreateTaskParams>;
}

type AddOrModifyPropTypes = 'subtask'
export const AddParams: { [key in AddOrModifyPropTypes]: string } = {
	subtask: 'subTasks'
}

export interface AddSubtaskParams extends KanbanPost, ModifyTask {
	params: Pick<SubTask, 'name'> & Partial<SubTask>;
	addParam: 'subtask'
}

export interface ModifySubtaskParams extends KanbanPost, ModifyTask {
	params: Partial<SubTask>;
	modifyParam: AddOrModifyPropTypes
}

export interface ImplementationParams extends KanbanPost {
	params: CreateTaskParams | Partial<CreateTaskParams>;
	taskId?: Task['_id'];
	addParam?: string
	modifyParam?: AddOrModifyPropTypes
}
