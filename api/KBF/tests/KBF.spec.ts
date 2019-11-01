import {Attachment, Board, Comment, Task, Tasks, TasksBySwimlane} from '../../../types/kanbanflow'
import {createTask, getAllTasksFromBoard, getBoard, getTaskByID, getTaskDetailsById, getTasksByColumn, getTasksByColumnAndSwimlane, postParams} from '../requests'
import {maxFeatuesId, taskMaxFeatures, taskMinFeatues, testColumnId, testDate, testLabel, testSubtasks, testSwimlaneId, testUserId} from './mocks'

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
			swimlaneName: 'A',
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
	expect(actById[0]).toMatchObject(expTasks[0])
	expect(actById[1]).toMatchObject(expTasks[1])
	
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
		
		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(exp)
			])
		)
		
	})
	it('should fetch labels', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'labels')
		
		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(testLabel)
			])
		)
	})
	it('should fetch dates', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'dates')
		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(testDate)
			
			])
		)
	})
	it('should fetch subtasks', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'subtasks')
		expect(act[0]).toMatchObject(testSubtasks[0])
		expect(act[1]).toMatchObject(testSubtasks[1])
	})
	it('should fetch collaborators', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'collaborators')
		
		expect(act).toHaveLength(0)
		
	})
	it('should fetch attachments', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'attachments')
		const exp: Partial<Attachment> = {
			// some properties omitted
			_id: 'QWAnJzYkcu7x',
			provider: 'KanbanFlow',
			name: 'wuauserv.reg.jpg',
			size: 6990,
			mimeType: 'image/jpeg',
			createdTimestamp: '2019-11-01T12:37:01.675Z',
		}
		expect(act[0]).toMatchObject(exp)
	})
})


describe('should create tasks/properties', () => {
	it('should add new task', async () => {
		const minFeaturesParams: postParams = {
			name: 'TESTMIN',
			columnId: testColumnId,
			swimlaneId: testSwimlaneId, //todo warning on ommiting swimlane when board has swimlanes, or implement check before submitting task!
		}
		const maxFeaturesParams: postParams = {
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
		
		const actMin = await createTask(minFeaturesParams)
		expect(actMin).toHaveProperty(['taskId'])
		expect(actMin).toHaveProperty(['taskNumber'])
		
		const actMax = await createTask(maxFeaturesParams)
		expect(actMax).toHaveProperty(['taskId'])
		expect(actMax).toHaveProperty(['taskNumber'])
	})
	it('should create subtask', async () => {
		
		
		throw 'not implemented'
	})
	it('should create label', async () => {
		throw 'not implemented'
	})
	it('should create / update date', async () => {
		throw 'not implemented'
	})
	it('should create add collaborator', async () => {
		throw 'not implemented'
	})
	it('should create comment', async () => {
		throw 'not implemented'
	})
	it('should add attachment', async () => {
		throw 'not implemented'
	})
	it('should add manual time entry', async () => {
		throw 'not implemented'
	})
	
})

describe('should update entries', () => {
	it('should update subtasks', async () => {
		throw 'not implemented'
	})
	it('should update label', async () => {
		throw 'not implemented'
	})
	it('should create / update date', async () => {
		throw 'not implemented'
	})
	it('update comment', async () => {
		throw 'not implemented'
	})
	it('should update manual time entry', async () => {
		throw 'not implemented'
	})
	
})

describe('should delete entries', () => {
	it('should delete subtask', async () => {
		
		
		throw 'not implemented'
	})
	it('should delete label', async () => {
		throw 'not implemented'
	})
	it('should delete date', async () => {
		throw 'not implemented'
	})
	it('should delete collaborator', async () => {
		throw 'not implemented'
	})
	it('should delete comment', async () => {
		throw 'not implemented'
	})
	it('should delete attachment', async () => {
		throw 'not implemented'
	})
	it('should delete manual time entry', async () => {
		throw 'not implemented'
	})
	
})

describe('should manage time entries', () => {
	it('should get stoppwatch entries', async () => {
		
		
		throw 'not implemented'
	})
	it('should delete stopwatch entries', async () => {
		throw 'not implemented'
	})
	it('should get pomodory entries', async () => {
		throw 'not implemented'
	})
	it('should delete pomodoro entries', async () => {
		throw 'not implemented'
	})
	it('should get manual entries', async () => {
		throw 'not implemented'
	})
	it('should delete manual entries', async () => {
		throw 'not implemented'
	})
	
})

it('should get users', async () => {
  
  throw 'Not implemented'
});
it('should get events', async () => {
  
  throw 'Not implemented'
});

describe('should manage webhooks', () => {
	it('should create webhook', async () => {
	  
	  throw 'Not implemented'
	});
	it('should update webhook', async () => {
		
		throw 'Not implemented'
	});
	it('should delete webhoook', async () => {
		
		throw 'Not implemented'
	});
	it('should recieve events', async () => {
		
		throw 'Not implemented'
	});
	it('should verify signature', async () => {
		
		throw 'Not implemented'
	});
	
})
