import SHA256 from 'crypto-js/sha256';
import { Hash } from '../../types/utils';

const getSha256 = (payload: any) =>
	SHA256(JSON.stringify(payload)).toString() as Hash;

export const getBlockHash = ({
	preBlockHeaderHash,
	timestamp,
	blockHeaderHash,
	nonce,
}: {
	preBlockHeaderHash: Hash;
	timestamp: number;
	blockHeaderHash: Hash;
	nonce: number;
}) => {
	return getSha256(preBlockHeaderHash + timestamp + blockHeaderHash + nonce);
};
