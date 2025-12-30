import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, GitCompare, Plus, ChevronRight, ArrowLeft, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import './AIRecommend.css';

// 市场热点板块数据
interface MarketHotspot {
  id: string;
  emoji: string;
  name: string;
  description: string;
  references: number[];
}

// 股票推荐数据
interface StockRecommendation {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  nearMonthChange: number;
  tags: string[];
}

// 板块推荐分组
interface SectorRecommendation {
  sectorId: string;
  sectorName: string;
  sectorTitle: string; // 板块情况小标题
  reasonOverview: string;
  stocks: StockRecommendation[];
  totalCount: number;
}

// 市场热点数据
const marketHotspots: MarketHotspot[] = [
  {
    id: 'ai',
    emoji: '🤖',
    name: 'AI算力',
    description: 'DeepSeek等国产大模型持续迭代，算力需求激增，光模块、服务器等细分赛道表现强势。',
    references: [1, 2],
  },
  {
    id: 'robot',
    emoji: '🦾',
    name: '人形机器人',
    description: '特斯拉Optimus量产在即，国内厂商加速布局，减速器、传感器等核心零部件订单放量。',
    references: [1],
  },
  {
    id: 'semiconductor',
    emoji: '💎',
    name: '半导体设备',
    description: '国产替代进程加速，刻蚀机、光刻胶等关键环节突破，设备龙头业绩持续高增。',
    references: [3],
  },
];

// 板块推荐数据
const sectorRecommendations: SectorRecommendation[] = [
  {
    sectorId: 'ai',
    sectorName: 'AI算力板块精选股票',
    sectorTitle: '📈 AI算力近一周上涨12.5%，资金持续流入',
    reasonOverview: '当前市场AI算力板块持续走强，DeepSeek-V3发布引爆国产大模型热潮，算力需求呈指数级增长。海康威视作为AI视觉龙头，机器人业务打开第二曲线；中科创达深度绑定高通、英伟达，智能座舱市占率持续提升；寒武纪云端训练芯片出货量翻倍，受益国产替代加速。三只标的均处于业绩拐点，近期北向资金持续加仓。',
    totalCount: 86,
    stocks: [
      {
        code: '002415',
        name: '海康威视',
        price: 34.56,
        changePercent: 3.25,
        nearMonthChange: 18.42,
        tags: ['AI视觉龙头', '安防+机器人', '分红稳定'],
      },
      {
        code: '300496',
        name: '中科创达',
        price: 78.90,
        changePercent: 5.67,
        nearMonthChange: 32.15,
        tags: ['智能操作系统', '车载AI', '大模型'],
      },
      {
        code: '688256',
        name: '寒武纪',
        price: 245.80,
        changePercent: 4.12,
        nearMonthChange: 45.68,
        tags: ['AI芯片', '国产替代', '科创龙头'],
      },
    ],
  },
  {
    sectorId: 'robot',
    sectorName: '人形机器人板块精选股票',
    sectorTitle: '🔥 机器人板块连续3日领涨，主力资金净流入超50亿',
    reasonOverview: '人形机器人产业迎来量产元年，特斯拉Optimus二代亮相CES展会，国内优必选、宇树科技订单激增。机器人作为国内龙头，与华为合作开发人形机器人；双环传动RV减速器已进入特斯拉供应链，产能利用率超90%；绿的谐波打破日本垄断，毛利率维持45%高位。板块处于0-1向1-10过渡期，确定性强。',
    totalCount: 52,
    stocks: [
      {
        code: '300024',
        name: '机器人',
        price: 12.85,
        changePercent: 6.23,
        nearMonthChange: 35.42,
        tags: ['机器人龙头', '工业自动化', '国资背景'],
      },
      {
        code: '002472',
        name: '双环传动',
        price: 28.45,
        changePercent: 4.85,
        nearMonthChange: 42.18,
        tags: ['RV减速器', '特斯拉链', '产能扩张'],
      },
      {
        code: '688017',
        name: '绿的谐波',
        price: 92.30,
        changePercent: 3.45,
        nearMonthChange: 28.65,
        tags: ['谐波减速器', '国产替代', '高毛利率'],
      },
    ],
  },
  {
    sectorId: 'semiconductor',
    sectorName: '半导体设备板块精选股票',
    sectorTitle: '💎 半导体设备Q3订单同比增长65%，景气度持续向上',
    reasonOverview: '半导体设备国产替代进入深水区，美国对华芯片限制升级倒逼国产化提速。北方华创作为平台型龙头，刻蚀、薄膜沉积设备均进入14nm产线验证；中微公司刻蚀机已实现5nm突破，海外大厂认证进展顺利；上海新阳ArF光刻胶量产在即，打破日本垄断。三季度设备招标金额同比增长65%，板块景气度向上。',
    totalCount: 45,
    stocks: [
      {
        code: '002371',
        name: '北方华创',
        price: 328.50,
        changePercent: 2.86,
        nearMonthChange: 22.34,
        tags: ['刻蚀设备', '薄膜沉积', '国产龙头'],
      },
      {
        code: '688012',
        name: '中微公司',
        price: 156.70,
        changePercent: 3.12,
        nearMonthChange: 18.92,
        tags: ['刻蚀机', '先进制程', '国际竞争'],
      },
      {
        code: '300236',
        name: '上海新阳',
        price: 45.80,
        changePercent: 5.23,
        nearMonthChange: 31.45,
        tags: ['光刻胶', '电子特气', '材料龙头'],
      },
    ],
  },
];

export default function AIRecommend() {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [addedStocks, setAddedStocks] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedback = (type: 'good' | 'bad') => {
    setFeedback(type);
    setFeedbackSubmitted(true);
    // 这里可以调用API提交反馈
  };

  const handleAddToCompare = (code: string) => {
    if (compareList.includes(code)) {
      setCompareList(compareList.filter(c => c !== code));
      return;
    }
    if (compareList.length >= 3) {
      alert('最多只能对比3只股票');
      return;
    }
    setCompareList([...compareList, code]);
  };

  const handleAddToWatchlist = (code: string) => {
    setAddedStocks(prev => new Set([...prev, code]));
  };

  const handleAddAllToWatchlist = (stocks: StockRecommendation[]) => {
    const newAdded = new Set(addedStocks);
    stocks.forEach(s => newAdded.add(s.code));
    setAddedStocks(newAdded);
  };

  const isAllAdded = (stocks: StockRecommendation[]) => {
    return stocks.every(s => addedStocks.has(s.code));
  };

  const handleCompare = () => {
    if (compareList.length < 2) {
      alert('请至少选择2只股票进行对比');
      return;
    }
    navigate(`/compare?stocks=${compareList.join(',')}`);
  };

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <Sparkles size={18} className="header-icon" />
          <span>问元宝</span>
        </div>
        <div className="header-action">今天买什么</div>
      </header>

      {/* Chat Content */}
      <div className="chat-content">
        {/* AI Message */}
        <div className="ai-message-wrapper">
          <div className="ai-avatar">
            <Sparkles size={16} />
          </div>
          
          {/* 单个回答卡片 */}
          <div className="ai-answer-card">
            {/* 市场热点部分 */}
            <p className="intro-text">今天市场热点比较集中，主要集中在以下几个方向，你可以重点关注：</p>
            
            <div className="hotspots-list">
              {marketHotspots.map((hotspot) => (
                <div key={hotspot.id} className="hotspot-item">
                  <div className="hotspot-header">
                    <span className="hotspot-emoji">{hotspot.emoji}</span>
                    <span className="hotspot-name">{hotspot.name}</span>
                  </div>
                  <p className="hotspot-desc">
                    {hotspot.description}
                    {hotspot.references.map(ref => (
                      <span key={ref} className="ref-tag">{ref}</span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

            {/* 嵌入式股单卡片 */}
            {sectorRecommendations.map((sector) => (
              <div key={sector.sectorId} className="stock-list-wrapper">
                {/* 板块情况小标题 */}
                <h4 className="sector-title-text">{sector.sectorTitle}</h4>
                {/* 股单推荐理由概述 - 正文样式 */}
                <p className="sector-reason-text">{sector.reasonOverview}</p>

                {/* 股单卡片 */}
                <div className="embedded-stock-list">
                  {/* 股单头部 */}
                  <div className="stock-list-header">
                    <div className="stock-list-title">
                      <span className="hot-badge">热</span>
                      <span>{sector.sectorName}</span>
                    </div>
                    <button 
                      className={`btn-compare-header ${compareList.some(c => sector.stocks.map(s => s.code).includes(c)) ? 'active' : ''}`}
                      onClick={() => {
                        const sectorCodes = sector.stocks.map(s => s.code);
                        const allInCompare = sectorCodes.every(c => compareList.includes(c));
                        if (allInCompare) {
                          setCompareList(compareList.filter(c => !sectorCodes.includes(c)));
                        } else {
                          const newList = [...compareList];
                          sectorCodes.forEach(code => {
                            if (!newList.includes(code) && newList.length < 3) {
                              newList.push(code);
                            }
                          });
                          setCompareList(newList);
                        }
                      }}
                    >
                      <GitCompare size={14} />
                      对比
                    </button>
                  </div>

                  {/* 股票列表 */}
                  {sector.stocks.map((stock) => (
                    <div key={stock.code} className="stock-item">
                      {/* 股票信息行 */}
                      <div className="stock-main-info">
                        <div className="stock-left">
                          <div className="stock-name">{stock.name}</div>
                          <div className="stock-code">{stock.code}</div>
                        </div>
                        <div className="stock-right">
                          <div className="stock-price">{stock.price.toFixed(2)}</div>
                          <div className={`stock-change ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
                            {stock.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                          <div className="stock-month-change">
                            {stock.nearMonthChange.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* 标签和按钮行 */}
                      <div className="stock-bottom-row">
                        <div className="stock-tags">
                          {stock.tags.map((tag, i) => (
                            <span key={i} className="stock-tag">{tag}</span>
                          ))}
                        </div>
                        <button 
                          className={`btn-add-single ${addedStocks.has(stock.code) ? 'added' : ''}`}
                          onClick={() => handleAddToWatchlist(stock.code)}
                        >
                          <Plus size={12} />
                          {addedStocks.has(stock.code) ? '已添加' : '加自选'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* 底部一键加自选 */}
                  <button 
                    className={`btn-add-all ${isAllAdded(sector.stocks) ? 'added' : ''}`}
                    onClick={() => handleAddAllToWatchlist(sector.stocks)}
                  >
                    <Plus size={14} />
                    {isAllAdded(sector.stocks) ? '已全部加自选' : `一键加自选(${sector.stocks.length})`}
                  </button>

                  {/* 查看全部 */}
                  <button className="view-all-btn">
                    共{sector.totalCount}只概念股，查看全部 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* 底部提示 */}
            <p className="disclaimer">* 内容由AI模型生成，不构成投资建议，请谨慎投资并咨询专业人员</p>
          </div>
        </div>

        {/* 用户反馈模块 */}
        <div className="feedback-module">
          {!feedbackSubmitted ? (
            <>
              <p className="feedback-question">这个回答容易理解吗？</p>
              <div className="feedback-buttons">
                <button 
                  className={`feedback-btn good ${feedback === 'good' ? 'active' : ''}`}
                  onClick={() => handleFeedback('good')}
                >
                  <ThumbsUp size={18} />
                  <span>清晰易懂</span>
                </button>
                <button 
                  className={`feedback-btn bad ${feedback === 'bad' ? 'active' : ''}`}
                  onClick={() => handleFeedback('bad')}
                >
                  <ThumbsDown size={18} />
                  <span>不太理解</span>
                </button>
              </div>
            </>
          ) : (
            <div className="feedback-thanks">
              <span>✅</span>
              <p>感谢你的反馈！我们会持续优化回答质量</p>
            </div>
          )}
        </div>
      </div>

      {/* 底部对比栏 */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-info">
            <span className="compare-count">已选 {compareList.length}/3</span>
            <div className="compare-list">
              {compareList.map(code => {
                const stock = sectorRecommendations.flatMap(s => s.stocks).find(s => s.code === code);
                return stock ? (
                  <span key={code} className="compare-item">
                    {stock.name}
                    <button onClick={() => setCompareList(compareList.filter(c => c !== code))}>×</button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <button className="btn-do-compare" onClick={handleCompare} disabled={compareList.length < 2}>
            开始对比
          </button>
        </div>
      )}
    </div>
  );
}
