import { Router, Request, Response } from 'express';
import { GameService } from '../services/gameService.js';

const router = Router();
const gameService = new GameService();

// 开始猜涨跌游戏
router.post('/predict/start', async (req: Request, res: Response) => {
  try {
    const { stockCode, userId } = req.body;
    const game = await gameService.startPredictGame(stockCode, userId || 'default');
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, error: '开始游戏失败' });
  }
});

// 提交预测
router.post('/predict/submit', async (req: Request, res: Response) => {
  try {
    const { gameId, prediction } = req.body; // prediction: 'up' | 'down'
    const result = await gameService.submitPrediction(gameId, prediction);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: '提交预测失败' });
  }
});

// 获取游戏结果
router.get('/predict/:gameId', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const result = await gameService.getGameResult(gameId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取结果失败' });
  }
});

export { router as gameRouter };

