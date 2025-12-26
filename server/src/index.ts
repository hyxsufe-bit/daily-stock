import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { stockRouter } from './routes/stock.js';
import { learningRouter } from './routes/learning.js';
import { aiRouter } from './routes/ai.js';
import { gameRouter } from './routes/game.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRouter);
app.use('/api/learning', learningRouter);
app.use('/api/ai', aiRouter);
app.use('/api/game', gameRouter);

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', message: 'AI每日一股 API服务运行中' });
});

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

