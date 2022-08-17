import { expect } from 'chai';
import { describe } from 'mocha';
import { RedisClientType } from 'redis';
import {
	createTransactionInCache,
	getUnConfirmTransaction,
	updateUserStatus,
} from '../src/utils/database/cache';
import { connectRedis, disconnectRedis } from '../src/utils/database/initRedis';

const sampleTransaction = {
	id: 'test',
	version: 0,
	inputs: [
		{
			transactionId: 'pretest',
			outputIndex: 0,
			scriptResult: 'result...',
			lockTime: 0,
		},
	],
	outputs: [
		{
			value: 10,
			unLockScript: 'match 123456 test',
		},
	],
};

describe('transaction operation in cache', function () {
	it('should create/get transaction in it', async () => {
		const tmp = { ...sampleTransaction };
		delete tmp['id'];
		const id = await createTransactionInCache(tmp);
		const result = await getUnConfirmTransaction(id);
		expect(result).eqls({ ...tmp, id });
		try {
			await getUnConfirmTransaction(id);
			throw 'should error';
		} catch (err) {
			expect(err).eql('not exist transaction');
		}
	});
});

describe('user status operation in cache', function () {
	let client: RedisClientType;
	before(async () => {
		client = (await connectRedis()) as RedisClientType;
		await client.set('publicKey-test', 20);
	});
	after(async () => {
		await client.del('publicKey-test');
		await client.del('publicKey-test2');
		await disconnectRedis(client);
	});
	it('should update value for key in it', async () => {
		await updateUserStatus('test', 100);
		expect(await client.get('publicKey-test')).eql('120');
		await updateUserStatus('test', -130);
		expect(await client.get('publicKey-test')).eql('-10');
		await updateUserStatus('test', 13);
		expect(await client.get('publicKey-test')).eql('3');
	});
	it('should create when not exist publicKey', async () => {
		await updateUserStatus('test2', 100);
		expect(await client.get('publicKey-test2')).eql('100');
	});
});
