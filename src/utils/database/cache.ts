import { connectRedis, disconnectRedis } from './initRedis';
import { Transaction } from '../../types/blockchain';
import { v4 as uid } from 'uuid';
import { RedisClientType } from 'redis';
/**
 * 在快取創建未確認交易
 * @param transaction
 * @returns 交易id
 */
export const createTransactionInCache = async (
	transaction: Omit<Transaction, 'id'>
) => {
	const cacheClient = (await connectRedis()) as RedisClientType;
	const transactionId: string = uid();
	await cacheClient.set(
		`transaction-${transactionId}`,
		JSON.stringify({ ...transaction, id: transactionId } as Transaction)
	);
	await disconnectRedis(cacheClient);
	return transactionId;
};
/**
 * 取得特定未確認交易
 * @param transactionId
 * @returns 交易實體
 */
export const getUnConfirmTransaction = async (transactionId: string) => {
	const cacheClient = (await connectRedis()) as RedisClientType;
	const key = `transaction-${transactionId}`;
	const result = await cacheClient.multi().get(key).del(key).exec();
	await disconnectRedis(cacheClient);
	if (result[0]) {
		return JSON.parse(result[0] as string) as Transaction;
	}
	throw 'not exist transaction';
};
/**
 * 更新公鑰所擁有資產
 * @param publicKey
 * @param value
 * @returns 當前資產
 */
export const updateUserStatus = async (publicKey: string, value: number) => {
	const cacheClient = (await connectRedis()) as RedisClientType;
	const keyValue = await cacheClient.incrBy(`publicKey-${publicKey}`, value);
	await disconnectRedis(cacheClient);
	return keyValue;
};
