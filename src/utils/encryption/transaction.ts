import SHA256 from 'crypto-js/sha256';
import { TransactionOutput } from 'types/blockchain';
import { Hash } from '../../types/utils';

const getSha256 = (payload: any) =>
	SHA256(JSON.stringify(payload)).toString() as Hash;

export const getUnSpendTransactionOutputId = ({
	transactionId,
	publicKey,
	value,
	unLockScript,
}: TransactionOutput) => {
	return getSha256(transactionId + publicKey + value + unLockScript);
};
