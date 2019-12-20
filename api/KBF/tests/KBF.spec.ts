import nock from 'nock'
import {Attachment, Comment, SubTask, Task, Tasks, TasksBySwimlane} from '../../../types/kanbanflow'
import {kanbanPost, KBF} from '../index'
import {API_URL, dispatch} from '../lib/axiosGeneric'
import {getAllTasksFromBoard, getBoard, getTaskByID, getTaskDetailsById, getTasksByColumn, getTasksByColumnAndSwimlane} from '../requests'
import {CreateTaskParams} from '../types/interfaces'
import {maxFeatuesId, maxFeaturesParams, minFeaturesId, minFeaturesParams, taskMaxFeatures, taskMinFeatures, testBoard, testDate, testLabel, testSubtasks, testUserId} from './mocks'
import mock = jest.mock

process.env.NOCK_ENABLED = 'true'

const initializeNock = (response: any[] | object) => {
	if (process.env.NOCK_ENABLED) {
		nock(/.*/)
			.get(/.*/)
			.times(Infinity)
			.reply(200, response)
		
		nock(/.*/)
			.post(/.*/)
			.times(Infinity)
			.reply(200, response)
	}
}

afterEach(() => nock.cleanAll())

describe('should fetch data', () => {
	it('valid board data', async () => {
		initializeNock(testBoard)
		const res = await KBF.board()
		expect(res).toStrictEqual(testBoard)
	})
	it('a single task by id (min)', async () => {
		initializeNock(taskMinFeatures)
		await expect(KBF.tasks.get(minFeaturesId))
			.resolves.toStrictEqual(taskMinFeatures)
	})
	it('a single task by id (max)', async () => {
		initializeNock(taskMaxFeatures)
		await expect(KBF.tasks.get(maxFeatuesId))
			.resolves.toStrictEqual(taskMaxFeatures)
	})
	
	
	it('multiple tasks by id', async () => {
		const act = await KBF.tasks.get([maxFeatuesId, minFeaturesId])
		expect(act[0]).toStrictEqual(taskMaxFeatures)
		expect(act[1]).toStrictEqual(taskMinFeatures)
	})
	it.skip('all tasks in the column', async () => {
		const expTasks: Tasks = [
			{
				columnId    : 'Uqsc6jy2Cbl9',
				columnName  : 'TEST',
				tasksLimited: false,
				tasks       : [taskMinFeatures, taskMaxFeatures],
				swimlaneId  : 'V8pP3mn7NcSG',
				swimlaneName: 'A',
			},
			{
				columnId    : 'Uqsc6jy2Cbl9',
				columnName  : 'TEST',
				tasksLimited: false,
				tasks       : [],
				swimlaneId  : 'V9eKUkwDY8Vz',
				swimlaneName: 'B'
			}
		]
		const exp = expect.arrayContaining([
			expect.objectContaining(expTasks[0]),
			expect.objectContaining(expTasks[1])
		])
		
		const actById: Tasks =
			await getTasksByColumn({columnId: 'Uqsc6jy2Cbl9'})
		expect(actById[0]).toStrictEqual(expTasks[0])
		expect(actById[1]).toStrictEqual(expTasks[1])
		
		const actByName: Tasks =
			await getTasksByColumn({columnName: 'TEST'})
		expect(actByName).toEqual(exp)
		
		const actByIndex: Tasks =
			await getTasksByColumn({columnIndex: 1})
		expect(actByIndex).toEqual(exp)
		
		const expTaskByColumnAndSwimlane: TasksBySwimlane = {
			columnId    : 'Uqsc6jy2Cbl9',
			columnName  : 'TEST',
			tasksLimited: false,
			tasks       : [],
			swimlaneId  : 'V9eKUkwDY8Vz',
			swimlaneName: 'B'
		}
		const expByColumnAndSwimlane = expect.arrayContaining([
			expect.objectContaining(expTaskByColumnAndSwimlane)
		])
		const actByColumnAndSwimlane =
			await getTasksByColumnAndSwimlane({columnIndex: 1, swimlaneId: 'V9eKUkwDY8Vz'})
		expect(actByColumnAndSwimlane).toStrictEqual(expByColumnAndSwimlane)
		
	})
	it('all tasks on the board', async () => {
		await expect(KBF.tasks.getAll()).resolves
			.toMatchSnapshot()
	})
	it('comments', async () => {
		const commentExp: Comment = {
			_id             : 'm8q9JVny',
			text            : 'test',
			authorUserId    : '5b2a3ad796a22ce0d687f7f8181232b1',
			createdTimestamp: '2019-11-01T04:21:31.774Z'
		}
		initializeNock([commentExp])
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'comments')
		
		expect(act).toStrictEqual(
			expect.arrayContaining([
				expect.objectContaining(commentExp)
			])
		)
		
	})
	it('labels', async () => {
		initializeNock([testLabel])
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'labels')
		
		expect(act).toStrictEqual(
			expect.arrayContaining([
				expect.objectContaining(testLabel)
			])
		)
	})
	it('dates', async () => {
		initializeNock([testDate])
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'dates')
		expect(act).toStrictEqual(
			expect.arrayContaining([
				expect.objectContaining(testDate)
			
			])
		)
	})
	it('subTasks', async () => {
		initializeNock(testSubtasks)
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'subTasks')
		expect(act[0]).toStrictEqual(testSubtasks[0])
		expect(act[1]).toStrictEqual(testSubtasks[1])
	})
	it('collaborators', async () => {
		initializeNock([])
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'collaborators')
		expect(act).toStrictEqual([])
		
	})
	it('attachments', async () => {
		const exp: Partial<Attachment> = {
			// some properties omitted
			_id             : 'QWAnJzYkcu7x',
			provider        : 'KanbanFlow',
			name            : 'wuauserv.reg.jpg',
			size            : 6990,
			mimeType        : 'image/jpeg',
			createdTimestamp: '2019-11-01T12:37:01.675Z',
		}
		initializeNock([exp])
		const act = await KBF.tasks.getProperty(maxFeatuesId, 'attachments')
		expect(act[0]).toStrictEqual(exp)
	})
	
	it('from several tasks', async () => {
		initializeNock([['comment']])
		const res = await KBF.tasks.getProperty([maxFeatuesId, minFeaturesId], 'comments')
		expect(res[0].length).toBe(1)
	})
})

describe('should create / update / delete [tasks / properties]', () => {
	let testTempMaxTaskId: string // to delete later
	let testTempMinTaskId: string
	
	it('should add new task', async () => {
		const actMin = await KBF.tasks.create(minFeaturesParams)
		testTempMinTaskId = actMin.taskId
		expect(Object.keys(actMin)).toStrictEqual(['taskId', 'taskNumber'])
		
		
		const actMax = await KBF.tasks.create(maxFeaturesParams)
		testTempMaxTaskId = actMax.taskId
		expect(Object.keys(actMax)).toStrictEqual(['taskId', 'taskNumber'])
	})
	
	it('should update task', async () => {
		const changes: Partial<CreateTaskParams> = {
			name: 'CHANGED'
		}
		await KBF.tasks.update(testTempMaxTaskId, changes)
		const result = await KBF.tasks.get(testTempMaxTaskId)
		expect(result.name).toBe(changes.name)
	})
	
	it('should create subtask', async () => {
		const sub: SubTask = {
			name    : 'ADDED SUBTASK',
			finished: false,
			userId  : testUserId,
		}
		await KBF.tasks.update(testTempMaxTaskId, {
			subTasks: [sub]
		})
		
	})
	const sub: SubTask = {
		name    : 'UPDATED SUBTASK',
		finished: true,
		userId  : testUserId,
	}
	it('should update subTasks', async () => {
		
		await KBF.tasks.update(testTempMaxTaskId, {
			subTasks: [sub]
		})
		
		KBF.tasks.getProperty(testTempMaxTaskId, 'subTasks').then((res) =>
			expect(res[0]).toStrictEqual(sub))
	})
	// etc
	
	it('should delete subtask', async () => {
		await KBF.tasks.deleteProperty(testTempMaxTaskId, 'subtask', sub.name)
		const act = await KBF.tasks.get(testTempMaxTaskId)
		expect(act.subTasks!.length).toBe(0)
	})
	
	it.todo('should delete task')
})



it('should delete subtask 2', async () => {
	const task = await KBF.tasks.get('Z2B3QyUJ')
	console.log(task)
	
	// await KBF.tasks.deleteProperty('Z2B3QyUJ', 'subtask', 'UPDATED SUBTASK')
	// const act = await KBF.tasks.get('Z2B3QyUJ')
	// expect(act.subTasks!.length).toBe(0)
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

it('should return mock response', async () => {
	if (!process.env.NOCK_ENABLED) {
		return
	}
	const res = await dispatch('get', 'test')
	expect(res).toStrictEqual({test: 'test123'})
})
