import { Hash } from '../../types/utils';
import { Transaction } from '../../types/blockchain';
import SHA256 from 'crypto-js/sha256';
import { MerkleTree } from 'merkletreejs';
/**
 * 創建 merkle tree , 一種二元加密法
 * @param transactions
 * @returns 樹的根
 */
export const buildMerkleTree = (transactions: Transaction[]) => {
	const leaves = transactions.map((v) => SHA256(JSON.stringify(v)));
	const tree = new MerkleTree(leaves, SHA256);
	const root = tree.getRoot().toString('hex');
	return root as Hash;
};
