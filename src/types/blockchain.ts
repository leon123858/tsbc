import { Hash } from './utils';
/**
 * 交易輸入
 */
export interface TransactionInput {
	transactionId: string;
	outputIndex: number;
	scriptResult: string;
	lockTime: number;
}
/**
 * 交易輸出
 */
export interface TransactionOutput {
	value: number;
	unLockScript: string;
}
/**
 * 交易
 */
export interface Transaction {
	id: string;
	version: number;
	inputs: TransactionInput[];
	outputs: TransactionOutput[];
}
/**
 * 區塊標頭
 */
export interface BlockHeader {
	id: string;
	index: number;
	version: number;
	prevBlockHeaderHash: Hash;
	hashMerkleRoot: Hash;
	timestamp: number;
	difficulty: number;
	nonce: number;
}
/**
 * 區塊
 */
export interface Block extends BlockHeader {
	isMerkleCheck: boolean;
	transactions: Transaction[];
}
/**
 * 區塊鏈
 */
export type BlockChain = Block[];
