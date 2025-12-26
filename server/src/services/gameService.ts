import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PredictGame {
  id: string;
  userId: string;
  stockCode: string;
  stockName: string;
  startPrice: number;
  startTime: string;
  prediction?: 'up' | 'down';
  endPrice?: number;
  endTime?: string;
  result?: 'win' | 'lose' | 'pending';
  points?: number;
}

export class GameService {
  private dataPath: string;

  constructor() {
    this.dataPath = join(__dirname, '../../data/games.json');
  }

  async startPredictGame(stockCode: string, userId: string): Promise<PredictGame> {
    // 模拟获取股票当前价格
    const startPrice = this.getMockPrice(stockCode);
    
    const game: PredictGame = {
      id: `game-${Date.now()}`,
      userId,
      stockCode,
      stockName: this.getStockName(stockCode),
      startPrice,
      startTime: new Date().toISOString(),
      result: 'pending'
    };

    this.saveGame(game);
    return game;
  }

  async submitPrediction(gameId: string, prediction: 'up' | 'down'): Promise<PredictGame> {
    const games = this.loadGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
      throw new Error('游戏不存在');
    }

    game.prediction = prediction;
    this.saveGames(games);
    return game;
  }

  async getGameResult(gameId: string): Promise<PredictGame> {
    const games = this.loadGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
      throw new Error('游戏不存在');
    }

    // 如果游戏还未结束，模拟结束并计算结果
    if (game.result === 'pending' && game.prediction) {
      const endPrice = this.getMockPrice(game.stockCode, game.startPrice);
      const priceChange = endPrice - game.startPrice;
      const actualDirection = priceChange > 0 ? 'up' : 'down';
      
      game.endPrice = endPrice;
      game.endTime = new Date().toISOString();
      game.result = game.prediction === actualDirection ? 'win' : 'lose';
      game.points = game.result === 'win' ? 100 : 0;
      
      this.saveGames(games);
    }

    return game;
  }

  private getMockPrice(stockCode: string, basePrice?: number): number {
    // 模拟价格变动（实际应该从真实数据源获取）
    if (basePrice) {
      // 模拟1-5%的随机变动
      const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
      return basePrice * (1 + changePercent);
    }
    
    // 根据股票代码返回模拟价格
    const prices: Record<string, number> = {
      '000001': 12.50,
      '600519': 1850.00,
      '000858': 145.50,
      '300750': 185.30,
      '002415': 38.50
    };
    return prices[stockCode] || 10.00;
  }

  private getStockName(stockCode: string): string {
    const names: Record<string, string> = {
      '000001': '平安银行',
      '600519': '贵州茅台',
      '000858': '五粮液',
      '300750': '宁德时代',
      '002415': '海康威视'
    };
    return names[stockCode] || '未知股票';
  }

  private loadGames(): PredictGame[] {
    if (!existsSync(this.dataPath)) {
      return [];
    }
    const data = readFileSync(this.dataPath, 'utf-8');
    return JSON.parse(data);
  }

  private saveGame(game: PredictGame) {
    const games = this.loadGames();
    games.push(game);
    this.saveGames(games);
  }

  private saveGames(games: PredictGame[]) {
    const dir = join(__dirname, '../../data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.dataPath, JSON.stringify(games, null, 2), 'utf-8');
  }
}

