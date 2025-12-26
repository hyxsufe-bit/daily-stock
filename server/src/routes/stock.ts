import { Router, Request, Response } from 'express';
import { StockService } from '../services/stockService.js';

const router = Router();
const stockService = new StockService();

// 获取今日热门股票列表
router.get('/today', async (req: Request, res: Response) => {
  try {
    const stocks = await stockService.getTodayStocks();
    res.json({ success: true, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取股票列表失败' });
  }
});

// 获取单个股票的详细信息
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const stock = await stockService.getStockDetail(code);
    if (!stock) {
      return res.status(404).json({ success: false, error: '股票不存在' });
    }
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取股票详情失败' });
  }
});

export { router as stockRouter };

