export type Hash = String;

export interface Block {
	blockNumber: number;
	timestamp: number;
	data: String;
	hash: Hash;
	previousHash: Hash;
	nonce?: number;
}

export type BlockChain = Block[];
