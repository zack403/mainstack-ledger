import express, { Request, Response, Application } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';

dotenv.config();
import './config/env.config';

const app: Application = express();

const logStream = fs.createWriteStream('api.log', {
    flags: 'a',
});

app.use(helmet());
app.use(morgan('combined', { stream: logStream }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.json({ 'name': 'Mainstack Ledger API', 'version': '1.0' });
});
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'API is healthy' });
});

export default app;