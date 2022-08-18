import { expect } from 'chai';
import { describe } from 'mocha';
import { RedisClientType } from 'redis';
import {
	createTransactionInCache,
	getUnConfirmTransaction,
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
