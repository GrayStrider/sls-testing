import {kanbanGet} from '../KBF'

it('should fetch test board data', async () => {
	const res = await kanbanGet('board')
	expect(res.status).toBe(200)
	expect(res.data.columns).not.toBeFalsy()
	expect(res.data.columns[1].name).toBe('TEST')
	
})
