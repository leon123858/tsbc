import { generateUser } from './core/api/user';
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 1337;

app.get('/newUser', async (req: Request, res: Response) => {
	const newUser = await generateUser();
	res.status(200).json({ ...newUser });
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
