import { Hash } from 'crypto';

export interface TransactionInput {}

export interface TransactionOutput {}

export interface Transaction {
	version: number;
	index: number;
	inputs: { [key: number]: TransactionInput };
	outputs: { [key: number]: TransactionOutput };
}

export interface Block {
	index: number;
	version: number;
	prevBlockHeaderHash: Hash;
	hashMerkleRoot: Hash;
	timestamp: number;
	difficulty: number;
	nonce: number;
	isMerkleCheck: boolean;
	transactions: { [key: number]: Transaction };
}
