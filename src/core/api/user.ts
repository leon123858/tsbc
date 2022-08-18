import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { payments } from 'bitcoinjs-lib';
import { User } from '../../types/user';
const ECPair = ECPairFactory(ecc);

export const generateUser = async () => {
	const keyPair = ECPair.makeRandom();
	const { publicKey, privateKey } = keyPair;
	const address = payments.p2pkh({ pubkey: publicKey }).address;
	return {
		publicKey: publicKey.toString('hex'),
		privateKey: privateKey.toString('hex'),
		address,
	} as User;
};
