import {Attachment, Comment, Task, Tasks, TasksBySwimlane} from '../../../types/kanbanflow'
import {kanbanPost, KBF} from '../index'
import {getTaskByID, getTaskDetailsById, getTasksByColumn, getTasksByColumnAndSwimlane} from '../requests'
import {createTaskParams} from '../types/interfaces'
import {maxFeatuesId, minFeaturesParams, taskMaxFeatures, taskMinFeatues, testBoard, testDate, testLabel, testSubtasks, testUserId} from './mocks'

describe('should fetch data', () => {
	it('valid board data', () => {
		KBF.board().then((res) =>
			expect(res).toMatchObject(testBoard))
	})
	it('a single task by id', () => {
		KBF.tasks.getById(maxFeatuesId).then((act) =>
			expect(act).toMatchObject(taskMaxFeatures))
		KBF.tasks.getById('hh6RHiEw').then((act) =>
			expect(act).toMatchObject(taskMinFeatues))
	})
	it.skip('all tasks in the column', async () => {
		const expTasks: Tasks = [
			{
				columnId    : 'Uqsc6jy2Cbl9',
				columnName  : 'TEST',
				tasksLimited: false,
				tasks       : [taskMinFeatues, taskMaxFeatures],
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
		expect(actById[0]).toMatchObject(expTasks[0])
		expect(actById[1]).toMatchObject(expTasks[1])

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
		expect(actByColumnAndSwimlane).toMatchObject(expByColumnAndSwimlane)

	})
	it('all tasks on the board', () => {
		KBF.tasks.getAll().then((act) =>
			// snapshot will do, since all types are tested in previous tests.
			expect(act).toMatchSnapshot())
	})
	it('comments', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'comments')

		const exp: Comment = {
			_id             : 'm8q9JVny',
			text            : 'test',
			authorUserId    : '5b2a3ad796a22ce0d687f7f8181232b1',
			createdTimestamp: '2019-11-01T04:21:31.774Z'
		}

		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(exp)
			])
		)

	})
	it('labels', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'labels')

		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(testLabel)
			])
		)
	})
	it('dates', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'dates')
		expect(act).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining(testDate)

			])
		)
	})
	it('subtasks', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'subtasks')
		expect(act[0]).toMatchObject(testSubtasks[0])
		expect(act[1]).toMatchObject(testSubtasks[1])
	})
	it('collaborators', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'collaborators')

		expect(act).toHaveLength(0)

	})
	it('attachments', async () => {
		const act = await getTaskDetailsById(maxFeatuesId, 'attachments')
		const exp: Partial<Attachment> = {
			// some properties omitted
			_id             : 'QWAnJzYkcu7x',
			provider        : 'KanbanFlow',
			name            : 'wuauserv.reg.jpg',
			size            : 6990,
			mimeType        : 'image/jpeg',
			createdTimestamp: '2019-11-01T12:37:01.675Z',
		}
		expect(act[0]).toMatchObject(exp)
	})
})

describe('should create / update / delete [tasks / properties]', () => {
	let testTempMaxTaskId: Task['_id'] // to delete later
	let testTempMinTaskId: Task['_id']


	it('should add new task', async () => {
		kanbanPost({params: minFeaturesParams}).then((act) => {
			expect(act).toHaveProperty(['taskId'])
			expect(act).toHaveProperty(['taskNumber'])
		})
		KBF.tasks.create(minFeaturesParams).then((act) => {
				expect(act).toHaveProperty(['taskId'])
				expect(act).toHaveProperty(['taskNumber'])
		})


	})
	it.skip('should update task', async () => {
		const changes: Partial<createTaskParams> = {
			name: 'CHANGED'
			// todo
		}
		await kanbanPost({params: changes, taskId: testTempMaxTaskId})
		const result = await getTaskByID(testTempMaxTaskId)
		expect(result.name).toBe(changes.name)
	})
	it.skip('should create subtask', () => {
		kanbanPost({
			addParam: 'subtask', taskId: maxFeatuesId,
			params  : {
				name    : 'ADDED SUBTASK',
				finished: false,
				userId  : testUserId,
			}
		}).then((act) =>
			expect(act).toHaveProperty('insertIndex'))
	})
	it.skip('should update subtasks', () => {
		kanbanPost({
			modifyParam: 'subtask',
			taskId     : maxFeatuesId, //todo
			params     : {finished: true}
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
