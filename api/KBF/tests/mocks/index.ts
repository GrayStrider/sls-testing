import {Board, Collaborator, Date, Label, SubTask, Task} from '../../../../types/kanbanflow'
import {createTaskParams} from '../../types/interfaces'

export const taskMaxFeatures: Task = {
	_id: 'hia9zFNn',
	name: 'test_task3',
	description: 'test',
	color: 'white',
	columnId: 'Uqsc6jy2Cbl9',
	totalSecondsSpent: 60,
	totalSecondsEstimate: 60,
	groupingDate: '',
	number: {
		prefix: 'PRE-',
		value: 1
	},
	responsibleUserId: '5b2a3ad796a22ce0d687f7f8181232b1',
	swimlaneId: 'V8pP3mn7NcSG',
	dates: [
		{
			targetColumnId: 'UsbzO1HUaPhw',
			status: 'active',
			dateType: 'dueDate',
			dueTimestamp: '2019-11-01T06:00:00.000Z',
			dueTimestampLocal: '2019-11-01T17:00:00+11:00'
		}
	],
	subTasks: [
		{
			name: 'sub1',
			finished: false,
			dueDateTimestamp: '2019-11-01T06:00:00.000Z',
			dueDateTimestampLocal: '2019-11-01T17:00:00+11:00'
		},
		{
			name: 'sub2',
			finished: false,
			userId: '5b2a3ad796a22ce0d687f7f8181232b1'
		}
	],
	labels: [
		{
			name: 'test_label',
			pinned: false
		}
	]
}
export const taskMinFeatues: Task = {
	_id: 'hh6RHiEw',
	name: 'test_task',
	description: '',
	color: 'white',
	columnId: 'Uqsc6jy2Cbl9',
	totalSecondsSpent: 0,
	totalSecondsEstimate: 0,
	swimlaneId: 'V8pP3mn7NcSG',
	// not minimun, but it's enabled for whole column
	groupingDate: ''
}
export const maxFeatuesId = 'hia9zFNn'
export const minFeatureId = 'hh6RHiEw'

export const testColumnId = 'Uqsc6jy2Cbl9'
export const testSwimlaneId = 'V8pP3mn7NcSG'
export const testUserId = '5b2a3ad796a22ce0d687f7f8181232b1'
export const testDate: Date = {
	targetColumnId: 'UsbzO1HUaPhw',
	status: 'active',
	dateType: 'dueDate',
	dueTimestamp: '2019-11-01T06:00:00.000Z',
	dueTimestampLocal: '2019-11-01T17:00:00+11:00'
}
export const testSubtasks: SubTask[] = [{
	'name': 'sub1',
	'finished': false,
	'dueDateTimestamp': '2019-11-01T06:00:00.000Z',
	'dueDateTimestampLocal': '2019-11-01T17:00:00+11:00'
}, {
	'name': 'sub2',
	'finished': false,
	'userId': '5b2a3ad796a22ce0d687f7f8181232b1'
}]
export const testLabel: Label = {
	name: 'test_label',
	pinned: false
}
const testCollaborator: Collaborator = {userId: ''}
export const testBoard: Board = {
	_id: 'is54ys',
	name: 'API TEST BOARD',
	columns: [
		{
			uniqueId: 'UpPKrbzD8yBN',
			name: 'To-do'
		},
		{
			uniqueId: 'Uqsc6jy2Cbl9',
			name: 'TEST'
		},
		{
			uniqueId: 'Urnu6XfQg3yU',
			name: 'Awaiting review'
		},
		{
			uniqueId: 'UsbzO1HUaPhw',
			name: 'Done'
		}
	],
	colors: [
		{
			name: 'White',
			description: 'desc',
			value: 'white'
		}
	],
	swimlanes: [
		{
			uniqueId: 'V8pP3mn7NcSG',
			name: 'A'
		},
		{
			uniqueId: 'V9eKUkwDY8Vz',
			name: 'B'
		}
	]
}
export const minFeaturesParams: createTaskParams = {
	name: 'TESTMIN',
	columnId: testColumnId,
	swimlaneId: testSwimlaneId, //todo warning on ommiting swimlane when board has swimlanes, or implement check before submitting task!
}
export const maxFeaturesParams: createTaskParams = {
	name: 'TESTMAX',
	columnId: testColumnId,
	swimlaneId: testSwimlaneId, //todo warning on ommiting swimlane when board has swimlanes, or implement check before submitting task!
	// position: 'bottom', //todo position and grouping data are mutually exclusive
	color: 'green',
	description: 'TEST',
	number: {prefix: 'TESTPREFIX', value: 99},
	responsibleUserId: testUserId,
	totalSecondsEstimate: 60,
	pointsEstimate: 100.99,
	groupingDate: null,
	dates: [testDate],
	subTasks: [testSubtasks[0]],
	labels: [testLabel],
	collaborators: []
}
