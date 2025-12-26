import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

const router = Router();
const aiService = new AIService();

// AI问答
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { question, stockCode, context } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, error: '问题不能为空' });
    }
    const answer = await aiService.askQuestion(question, stockCode, context);
    res.json({ success: true, data: { answer } });
  } catch (error) {
    console.error('AI问答错误:', error);
    res.status(500).json({ success: false, error: 'AI回答失败' });
  }
});

export { router as aiRouter };

