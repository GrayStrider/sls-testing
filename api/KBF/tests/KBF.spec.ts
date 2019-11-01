import {Board, Collaborator, Comment, Date, Label, Task, Tasks, TasksBySwimlane} from '../../../types/kanbanflow'
import {
	getAllTasksFromBoard,
	getBoard,
	getTaskByID,
	getTaskDetailsById,
	getTasksByColumn,
	getTasksByColumnAndSwimlane
} from '../requests'


const taskMaxFeatures: Task = {
	_id: 'hia9zFNn',
	name: 'test_task3',
	description: 'test',
	color: 'white',
	columnId: 'Uqsc6jy2Cbl9',
	totalSecondsSpent: 60,
	totalSecondsEstimate: 60,
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

const taskMinFeatues: Task = {
	_id: 'hh6RHiEw',
	name: 'test_task',
	description: '',
	color: 'white',
	columnId: 'Uqsc6jy2Cbl9',
	totalSecondsSpent: 0,
	totalSecondsEstimate: 0,
	swimlaneId: 'V8pP3mn7NcSG',
}
const maxFeatuesId = 'hia9zFNn'

it('should fetch valid board data', async () => {
	const exp: Board = {
		_id: 'is54ys',
		name: 'GH> KBF TS',
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
	const res = await getBoard()
	expect(res).toMatchObject(exp)
	
})

it('should return a single task by id', async () => {
	
	const act1: Task = await getTaskByID(maxFeatuesId)
	expect(act1).toMatchObject(taskMaxFeatures)
	const act2: Task = await getTaskByID('hh6RHiEw')
	expect(act2).toMatchObject(taskMinFeatues)
})

it('should return all tasks in the column', async () => {
	const expTasks: Tasks = [
		{
			columnId: 'Uqsc6jy2Cbl9',
			columnName: 'TEST',
			tasksLimited: false,
			tasks: [taskMinFeatues, taskMaxFeatures],
			swimlaneId: 'V8pP3mn7NcSG',
			swimlaneName: 'A'
		},
		{
			columnId: 'Uqsc6jy2Cbl9',
			columnName: 'TEST',
			tasksLimited: false,
			tasks: [],
			swimlaneId: 'V9eKUkwDY8Vz',
			swimlaneName: 'B'
		}
	]
	const exp = expect.arrayContaining([
		expect.objectContaining(expTasks[0]),
		expect.objectContaining(expTasks[1])
	])
	
	const actById: Tasks =
		await getTasksByColumn({columnId: 'Uqsc6jy2Cbl9'})
	expect(actById).toEqual(exp)
	
	const actByName: Tasks =
		await getTasksByColumn({columnName: 'TEST'})
	expect(actByName).toEqual(exp)
	
	const actByIndex: Tasks =
		await getTasksByColumn({columnIndex: 1})
	expect(actByIndex).toEqual(exp)
	
	const expTaskByColumnAndSwimlane: TasksBySwimlane = {
		columnId: 'Uqsc6jy2Cbl9',
		columnName: 'TEST',
		tasksLimited: false,
		tasks: [],
		swimlaneId: 'V9eKUkwDY8Vz',
		swimlaneName: 'B'
	}
	const expByColumnAndSwimlane = expect.arrayContaining([
		expect.objectContaining(expTaskByColumnAndSwimlane)
	])
	const actByColumnAndSwimlane =
		await getTasksByColumnAndSwimlane({columnIndex: 1, swimlaneId: 'V9eKUkwDY8Vz'})
	expect(actByColumnAndSwimlane).toMatchObject(expByColumnAndSwimlane)
	
})

it('should return all tasks on the board', async () => {
	const res = await getAllTasksFromBoard()
	// snapshot will do, since all types are tested in previous tests.
	expect(res).toMatchSnapshot()
})

describe('should fetch specific task properties', () => {
	it('should fetch comments', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'comments')
		const exp: Comment = {
			_id: 'm8q9JVny',
			text: 'test',
			authorUserId: '5b2a3ad796a22ce0d687f7f8181232b1',
			createdTimestamp: '2019-11-01T04:21:31.774Z'
		}
		
		expect(act).toMatch(
			expect.arrayContaining([
				expect.objectContaining(exp)
			])
		)
		
	})
	
	it('should fetch labels', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'labels')
		const exp: Label = {
			name: 'test_label',
			pinned: false
		}
		expect(act).toMatch(
			expect.arrayContaining([
				expect.objectContaining(exp)
			
			])
		)
		
	})
	
	
	it('should fetch dates', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'dates')
		const exp: Date = {
			targetColumnId: 'UsbzO1HUaPhw',
			status: 'active',
			dateType: 'dueDate',
			dueTimestamp: '2019-11-01T06:00:00.000Z',
			dueTimestampLocal: '2019-11-01T17:00:00+11:00'
		}
		expect(act).toMatch(
			expect.arrayContaining([
				expect.objectContaining(exp)
			
			])
		)
	})
	
	it('should fetch collaborators', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'collaborators')
		const exp: Collaborator = {} //todo
		expect(act).toHaveLength(0)
		
	})
	
	it('should fetch attachments', async () => {
		
		const act = await getTaskDetailsById(maxFeatuesId, 'labels')
		const exp/*: Date*/ = {}
		expect(act).toMatch(
			expect.arrayContaining([
				expect.objectContaining(exp)
			
			])
		)
	})
	
	
})
