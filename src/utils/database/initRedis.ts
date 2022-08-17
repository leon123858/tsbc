import { createClient, RedisClientType } from 'redis';

export const connectRedis = () => {
	const client = createClient();
	return new Promise((resolve, reject) => {
		client.on('error', (err) => {
			reject(err);
		});
		client.connect().then(() => resolve(client));
	});
};

export const disconnectRedis = async (client: RedisClientType) => {
	await client.disconnect();
};
