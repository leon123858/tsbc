import sha256 from 'crypto-js/sha256';
import { Block, BlockChain, Hash } from '../types';

export const calculateHash = ({ previousHash, timestamp, data, nonce = 1 }) => {
	return sha256(
		previousHash + timestamp + JSON.stringify(data) + nonce
	).toString();
};

export const generateFirstBlock = () => {
	const block = {
		timestamp: new Date().getTime(),
		data: 'FirstBlock',
		previousHash: '0',
		blockNumber: 0,
	};
	return {
		...block,
		hash: calculateHash(block),
	} as Block;
};

export const checkDifficulty = (hash) => {
	return hash.substr(0, 2) === '00';
};

export const createBlock = (data, chain: BlockChain) => {
	let nonce = 0;
	const prevBlock = chain[chain.length - 1];
	const block = {
		timestamp: new Date().getTime(),
		data,
		previousHash: prevBlock.hash,
		blockNumber: prevBlock.blockNumber + 1,
	};
	while (true) {
		const newHash: Hash = calculateHash({ ...block, nonce: ++nonce });
		if (checkDifficulty(newHash)) {
			return { ...block, hash: newHash, nonce } as Block;
		}
	}
};

const verifyBlock = (block: Block) => {
	const originHash: Hash = block.hash;
	const newHash = calculateHash({ ...block });
	return originHash === newHash;
};

export const verifyChain = (chain: BlockChain) => {
	for (let i = chain.length - 1; i > 0; i--) {
		const currentBlock = chain[i];
		const previousBlock = chain[i - 1];
		if (
			!verifyBlock(currentBlock) ||
			currentBlock.previousHash !== previousBlock.hash
		) {
			return false;
		}
	}
	return true;
};
