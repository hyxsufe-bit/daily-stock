import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  market: string;
  industry: string;
  description: string;
  basicInfo: {
    established: string;
    headquarters: string;
    employees: number;
    mainBusiness: string;
  };
  financials: {
    revenue: number;
    profit: number;
    growthRate: number;
    roe: number;
  };
  valuation: {
    pe: number;
    pb: number;
    marketCap: number;
    analysis: string;
  };
  whyHot: string;
  futureAnalysis: string;
}

export class StockService {
  private dataPath: string;

  constructor() {
    this.dataPath = join(__dirname, '../../data/stocks.json');
    this.initializeData();
  }

  private initializeData() {
    if (!existsSync(this.dataPath)) {
      const defaultStocks: Stock[] = [
        {
          code: '000001',
          name: '平安银行',
          currentPrice: 12.50,
          changePercent: 3.2,
          market: '深交所',
          industry: '银行',
          description: '中国平安集团旗下银行，专注于零售银行和财富管理业务。',
          basicInfo: {
            established: '1987年',
            headquarters: '深圳',
            employees: 45000,
            mainBusiness: '零售银行、财富管理、企业金融'
          },
          financials: {
            revenue: 1800,
            profit: 360,
            growthRate: 8.5,
            roe: 12.3
          },
          valuation: {
            pe: 6.5,
            pb: 0.8,
            marketCap: 2400,
            analysis: '估值处于历史低位，PB低于1，具有较高安全边际。'
          },
          whyHot: '近期银行板块估值修复，平安银行零售转型成效显著，业绩稳健增长。',
          futureAnalysis: '随着经济复苏，银行业基本面改善，估值有望持续修复。零售银行转型持续推进，长期成长性可期。'
        },
        {
          code: '600519',
          name: '贵州茅台',
          currentPrice: 1850.00,
          changePercent: 2.1,
          market: '上交所',
          industry: '白酒',
          description: '中国白酒行业龙头企业，以茅台酒闻名于世。',
          basicInfo: {
            established: '1999年',
            headquarters: '贵州茅台镇',
            employees: 35000,
            mainBusiness: '白酒生产与销售'
          },
          financials: {
            revenue: 1200,
            profit: 600,
            growthRate: 15.2,
            roe: 28.5
          },
          valuation: {
            pe: 35.2,
            pb: 12.5,
            marketCap: 23000,
            analysis: '估值相对较高，但考虑到品牌价值和盈利能力，仍具投资价值。'
          },
          whyHot: '消费复苏预期，高端白酒需求回暖，茅台作为行业龙头受益明显。',
          futureAnalysis: '消费升级趋势下，高端白酒市场空间广阔。茅台品牌护城河深厚，长期价值稳定。'
        },
        {
          code: '000858',
          name: '五粮液',
          currentPrice: 145.50,
          changePercent: 1.8,
          market: '深交所',
          industry: '白酒',
          description: '中国著名白酒品牌，浓香型白酒代表。',
          basicInfo: {
            established: '1998年',
            headquarters: '四川宜宾',
            employees: 28000,
            mainBusiness: '白酒生产与销售'
          },
          financials: {
            revenue: 800,
            profit: 300,
            growthRate: 12.5,
            roe: 22.3
          },
          valuation: {
            pe: 28.5,
            pb: 8.2,
            marketCap: 5600,
            analysis: '估值合理，品牌力强，盈利能力稳定。'
          },
          whyHot: '白酒板块整体回暖，五粮液作为次高端龙头，受益于消费升级。',
          futureAnalysis: '产品结构持续优化，高端产品占比提升，盈利能力有望进一步增强。'
        },
        {
          code: '300750',
          name: '宁德时代',
          currentPrice: 185.30,
          changePercent: -1.2,
          market: '创业板',
          industry: '新能源',
          description: '全球领先的锂离子电池制造商，动力电池行业龙头。',
          basicInfo: {
            established: '2011年',
            headquarters: '福建宁德',
            employees: 95000,
            mainBusiness: '动力电池、储能系统'
          },
          financials: {
            revenue: 3200,
            profit: 300,
            growthRate: 25.3,
            roe: 18.5
          },
          valuation: {
            pe: 22.5,
            pb: 4.2,
            marketCap: 8100,
            analysis: '估值相对合理，考虑到行业高增长性，仍有上升空间。'
          },
          whyHot: '新能源汽车市场持续增长，电池技术不断突破，行业前景广阔。',
          futureAnalysis: '全球电动化趋势明确，公司技术领先，市场份额有望进一步提升。储能业务成为新的增长点。'
        },
        {
          code: '002415',
          name: '海康威视',
          currentPrice: 38.50,
          changePercent: 2.5,
          market: '深交所',
          industry: '安防',
          description: '全球领先的以视频为核心的智能物联网解决方案提供商。',
          basicInfo: {
            established: '2001年',
            headquarters: '杭州',
            employees: 52000,
            mainBusiness: '视频监控产品、智能家居、机器人'
          },
          financials: {
            revenue: 840,
            profit: 128,
            growthRate: 5.2,
            roe: 15.8
          },
          valuation: {
            pe: 18.5,
            pb: 3.2,
            marketCap: 3600,
            analysis: '估值处于合理区间，AI和物联网业务带来新的增长动力。'
          },
          whyHot: 'AI技术应用加速，智能安防需求增长，公司技术实力领先。',
          futureAnalysis: 'AI+物联网深度融合，公司从硬件制造商向解决方案提供商转型，长期成长空间打开。'
        }
      ];
      const dir = join(__dirname, '../../data');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(this.dataPath, JSON.stringify(defaultStocks, null, 2), 'utf-8');
    }
  }

  async getTodayStocks(): Promise<Stock[]> {
    const data = readFileSync(this.dataPath, 'utf-8');
    const stocks: Stock[] = JSON.parse(data);
    // 返回3-5个股票（这里返回全部，实际可以根据热度筛选）
    return stocks.slice(0, 5);
  }

  async getStockDetail(code: string): Promise<Stock | null> {
    const data = readFileSync(this.dataPath, 'utf-8');
    const stocks: Stock[] = JSON.parse(data);
    return stocks.find(s => s.code === code) || null;
  }
}

