/**
 * lib
 */
import { Block, BlockChain, Hash } from './types';
import {
	createBlock,
	generateFirstBlock,
	verifyChain,
	calculateHash,
	checkDifficulty,
} from './utils/crypto';

/**
 * main
 */
const main = async () => {
	let blockChain: BlockChain = [generateFirstBlock()];
	setInterval(() => {
		console.log('-'.repeat(10));
		blockChain.push(createBlock('test', blockChain));
		console.log(blockChain);
		if (verifyChain(blockChain)) {
			console.log('當前合法');
		} else {
			console.log('當前非法');
			do {
				blockChain.pop();
			} while (!verifyChain(blockChain));
		}
	}, 5000);
	// fake block add
	setTimeout(() => {
		const lastBlock = blockChain[blockChain.length - 2];
		let nonce = 0;
		const block = {
			timestamp: new Date().getTime(),
			data: 'fake block',
			previousHash: lastBlock.hash,
		};
		while (true) {
			const newHash: Hash = calculateHash({ ...block, nonce: ++nonce });
			if (checkDifficulty(newHash)) {
				blockChain.push({
					...block,
					hash: newHash,
					nonce,
					blockNumber: lastBlock.blockNumber + 1,
				} as Block);
				break;
			}
		}
	}, 15000);
	// remote block add
	setTimeout(() => {
		blockChain.push(createBlock('remote block', blockChain));
	}, 8000);
	// late block add
	setTimeout(() => {
		const lastBlock = blockChain[blockChain.length - 3];
		let nonce = 0;
		const block = {
			timestamp: lastBlock.timestamp + 1,
			data: 'late block',
			previousHash: lastBlock.hash,
		};
		while (true) {
			const newHash: Hash = calculateHash({ ...block, nonce: ++nonce });
			if (checkDifficulty(newHash)) {
				blockChain = blockChain
					.filter((item) => item.timestamp < block.timestamp)
					.concat([
						{
							...block,
							hash: newHash,
							nonce,
							blockNumber: lastBlock.blockNumber + 1,
						},
					]);
				break;
			}
		}
	}, 24000);
};

main();
