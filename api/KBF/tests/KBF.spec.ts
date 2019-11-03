import {Attachment, Comment, Task, Tasks, TasksBySwimlane} from '../../../types/kanbanflow'
import {kanbanPost} from '../KBF'
import {getAllTasksFromBoard, getBoard, getTaskByID, getTaskDetailsById, getTasksByColumn, getTasksByColumnAndSwimlane} from '../requests'
import {createTaskParams} from '../types/interfaces'
import {maxFeatuesId, taskMaxFeatures, taskMinFeatues, testBoard, testColumnId, testDate, testLabel, testSubtasks, testSwimlaneId, testUserId} from './mocks'

describe('should fetch data', () => {
	it('should fetch valid board data', () => {
		getBoard().then((res) =>
			expect(res).toMatchObject(testBoard))
	})
	it('should return a single task by id', () => {
		getTaskByID(maxFeatuesId).then((act) =>
			expect(act).toMatchObject(taskMaxFeatures))
		getTaskByID('hh6RHiEw').then((act) =>
			expect(act).toMatchObject(taskMinFeatues))
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
	it('should return all tasks on the board', () => {
		getAllTasksFromBoard().then((act) =>
			// snapshot will do, since all types are tested in previous tests.
			expect(act).toMatchSnapshot())
	})
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
describe('should create / update / delete tasks/properties', () => {
	let testTempTaskId: Task['_id']
	
	it('should add new task', async () => {
		const minFeaturesParams: createTaskParams = {
			name: 'TESTMIN',
			columnId: testColumnId,
			swimlaneId: testSwimlaneId, //todo warning on ommiting swimlane when board has swimlanes, or implement check before submitting task!
		}
		const maxFeaturesParams: createTaskParams = {
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
		
		const actMin = await kanbanPost({params: minFeaturesParams})
		expect(actMin).toHaveProperty(['taskId'])
		expect(actMin).toHaveProperty(['taskNumber'])
		
		const actMax = await kanbanPost({params: maxFeaturesParams})
		expect(actMax).toHaveProperty(['taskId'])
		expect(actMax).toHaveProperty(['taskNumber'])
		
		testTempTaskId = actMax.taskId
	})
	it('should update task', async () => {
		const changes: Partial<createTaskParams> = {
			name: 'CHANGED'
			// todo
		}
		await kanbanPost({params: changes, taskId: testTempTaskId})
		const result = await getTaskByID(testTempTaskId)
		expect(result.name).toBe(changes.name)
	})
	// delete all tasks as latest test
	
})
describe('should create / update / delete tasks / properties', () => {
	
	it.skip('should create subtask', () => {
		kanbanPost({
			addParam: 'subtask', taskId: maxFeatuesId,
			params: {
				name: 'ADDED SUBTASK',
				finished: false,
				userId: testUserId,
			}
		}).then((act) =>
			expect(act).toHaveProperty('insertIndex'))
	})
	it.skip('should update subtasks', () => {
		kanbanPost({
			modifyParam: 'subtask',
			taskId: maxFeatuesId, //todo
			params: {finished: true}
		})
	})
	it.todo('should delete subtask')
	
	it.todo('should create label')
	it.todo('should update label')
	it.todo('should delete label')
	
	
	it.todo('should create / update date')
	it.todo('should create / update date')
	it.todo('should delete date')
	
	
	it.todo('should create add collaborator')
	it.todo('should delete collaborator')
	
	
	it.todo('should create comment')
	it.todo('update comment')
	it.todo('should delete comment')
	
	
	it.todo('should add attachment')
	it.todo('should delete attachment')
	
	
	it.todo('should add manual time entry')
	it.todo('should update manual time entry')
	it.todo('should delete manual time entry')
	
	it.todo('should delete task')
})

describe('should manage time entries', () => {
	
	it.todo('should get stoppwatch entries')
	it.todo('should get manual entries')
	it.todo('should delete stopwatch entries')
	
	it.todo('should get pomodory entries')
	it.todo('should delete pomodoro entries')
	it.todo('should delete manual entries')
	
})

it.todo('should get users')
it.todo('should get events')

describe('should manage webhooks', () => {
	it.todo('should create webhook')
	it.todo('should update webhook')
	it.todo('should delete webhoook')
	it.todo('should recieve events')
	it.todo('should verify signature')
	
})
