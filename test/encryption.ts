import { expect } from 'chai';
import { describe } from 'mocha';
import { buildMerkleTree } from '../src/utils/encryption/merkleTree';
import { MerkleTree } from 'merkletreejs';
import { getBlockHash, getSha256 } from '../src/utils/encryption/blockHash';
import { Transaction } from '../src/types/blockchain';
import SHA256 from 'crypto-js/sha256';

const sampleTransactions = [
	{
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
	},
	{
		id: 'test2',
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
	},
	{
		id: 'test3',
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
	},
];

describe('merkle tree', function () {
	it('should build a tree', async () => {
		const transactions: Transaction[] = sampleTransactions;
		const root = buildMerkleTree(transactions);
		const hashList = transactions.map((v) => getSha256(v));
		const tree = new MerkleTree(hashList, SHA256);
		const leaf = getSha256({
			id: 'test2',
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
		});
		const proof = tree.getProof(leaf);
		expect(tree.verify(proof, leaf, root)).is.true;
		const FakeLeaf = getSha256({
			id: 'test2Fake',
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
		});
		const newProof = tree.getProof(FakeLeaf);
		expect(tree.verify(newProof, hashList[1], root)).is.false;
	});
	it('should get block hash', async () => {
		const tmpHash = getBlockHash({
			preBlockHeaderHash: 'prev',
			timestamp: 1234,
			blockHeaderHash: 'nowHash',
			nonce: 123,
		});
		expect(tmpHash).eql(
			'e9162ed36abd4e7da30caa5c6813ef3f6838684d94d07612afde70d5d1776156'
		);
		expect(tmpHash.length).eql(64);
	});
});
