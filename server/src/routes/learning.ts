import { Router, Request, Response } from 'express';
import { LearningService } from '../services/learningService.js';

const router = Router();
const learningService = new LearningService();

// 开始学习某个股票
router.post('/start/:stockCode', async (req: Request, res: Response) => {
  try {
    const { stockCode } = req.params;
    const { userId } = req.body;
    const session = await learningService.startLearning(userId || 'default', stockCode);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: '开始学习失败' });
  }
});

// 获取学习进度
router.get('/progress/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const progress = await learningService.getProgress(sessionId);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取进度失败' });
  }
});

// 完成一个学习任务
router.post('/complete-task', async (req: Request, res: Response) => {
  try {
    const { sessionId, taskType, taskId, score } = req.body;
    const result = await learningService.completeTask(sessionId, taskType, taskId, score);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: '完成任务失败' });
  }
});

// 完成学习
router.post('/complete/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const result = await learningService.completeLearning(sessionId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: '完成学习失败' });
  }
});

export { router as learningRouter };

