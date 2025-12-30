import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Zap, Users, BookOpen, Star, TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import stocksData from '../data/stocks.json';
import AIChat from '../components/AIChat';
import './StockDetail.css';

interface Question {
  id: string;
  type: 'slider' | 'trueFalse' | 'battle';
  category: string;
  knowledgeTag: string;
  question: string;
  askedCount?: number;
  backgroundInfo?: string;
}

interface AIKnowledge {
  basicInfo: string;
  investmentAdvice: string;
  riskWarning: string;
  hotTopics: string[];
  faq: { q: string; a: string }[];
}

interface Stock {
  code: string;
  name: string;
  industry?: string;
  currentPrice: number;
  changePercent: number;
  aiBriefing: string;
  radarData: {
    capitalFlow: number;
    institutionFocus: number;
    valuationSafety: number;
    retailHeat: number;
    profitGrowth: number;
    conceptWind: number;
  };
  questions: Question[];
  aiKnowledge?: AIKnowledge;
}

export default function StockDetail() {
  const { stockCode } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [displayQuestions, setDisplayQuestions] = useState<Question[]>([]);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // 使用本地数据
    const foundStock = (stocksData as Stock[]).find(s => s.code === stockCode);
    if (foundStock) {
      setStock(foundStock);
      setQuestionPool(foundStock.questions);
      setTotalQuestions(foundStock.questions.length);
      shuffleQuestions(foundStock.questions);
      loadLearnProgress(stockCode!);
    }
    setLoading(false);
  }, [stockCode]);

  const loadLearnProgress = (code: string) => {
    const progressKey = `stockProgress_${code}`;
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      const progress = JSON.parse(saved);
      setLearnedCount(progress.questionsAnswered || 0);
    }
  };

  const getLearnProgress = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((learnedCount / totalQuestions) * 100);
  };

  const shuffleQuestions = (questions: Question[]) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDisplayQuestions(shuffled.slice(0, 3));
  };

  const handleShuffle = () => {
    shuffleQuestions(questionPool);
  };

  const handleAddWatchlist = () => {
    setIsWatchlisted(true);
    // Show toast or animation
  };

  const radarLabels = [
    { key: 'capitalFlow', label: '主力资金', icon: '💰' },
    { key: 'institutionFocus', label: '机构关注', icon: '🏦' },
    { key: 'valuationSafety', label: '估值安全', icon: '🛡️' },
    { key: 'retailHeat', label: '散户热度', icon: '🔥' },
    { key: 'profitGrowth', label: '业绩增速', icon: '📈' },
    { key: 'conceptWind', label: '概念风口', icon: '🌪️' },
  ];

  const getRadarPoints = () => {
    if (!stock?.radarData) return '';
    const center = 60;
    const radius = 45;
    const points = radarLabels.map((item, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const value = stock.radarData[item.key as keyof typeof stock.radarData] / 100;
      const x = center + radius * value * Math.cos(angle);
      const y = center + radius * value * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const getOverallScore = () => {
    if (!stock?.radarData) return 0;
    const values = Object.values(stock.radarData);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'S', color: '#ff2d55', text: '顶级热股' };
    if (score >= 70) return { level: 'A', color: '#a855f7', text: '优质标的' };
    if (score >= 60) return { level: 'B', color: '#00d4ff', text: '值得关注' };
    if (score >= 50) return { level: 'C', color: '#fbbf24', text: '中等水平' };
    return { level: 'D', color: '#6b7280', text: '谨慎对待' };
  };

  const getRadarInsight = () => {
    if (!stock?.radarData) return '';
    const data = stock.radarData;
    const insights = [];
    
    if (data.capitalFlow >= 80) insights.push('主力资金强势流入');
    if (data.capitalFlow <= 40) insights.push('注意主力资金流出');
    if (data.valuationSafety <= 40) insights.push('估值偏高需谨慎');
    if (data.valuationSafety >= 80) insights.push('估值处于安全区间');
    if (data.retailHeat >= 90) insights.push('散户关注度极高');
    if (data.profitGrowth >= 80) insights.push('业绩增长强劲');
    if (data.conceptWind >= 90) insights.push('处于热门风口');
    
    return insights.slice(0, 2).join('，') || '整体表现中规中矩';
  };

  const formatAskedCount = (count: number = 0) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}w`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const getTypeIcon = (type: string) => {
    if (type === 'trueFalse') return '✅';
    if (type === 'battle') return '🤔';
    if (type === 'slider') return '🎯';
    return '❓';
  };

  const getTypeLabel = (type: string) => {
    if (type === 'trueFalse') return '涨知识';
    if (type === 'battle') return '选立场';
    if (type === 'slider') return '猜数据';
    return '问答';
  };

  const getCardStyle = (index: number) => {
    const styles = [
      { bg: 'linear-gradient(135deg, rgba(255, 45, 85, 0.12), rgba(168, 85, 247, 0.08))', border: 'rgba(255, 45, 85, 0.25)' },
      { bg: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(168, 85, 247, 0.08))', border: 'rgba(0, 212, 255, 0.25)' },
      { bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(255, 45, 85, 0.08))', border: 'rgba(251, 191, 36, 0.25)' },
    ];
    return styles[index % 3];
  };

  // Get background info for question
  const getQuestionBackground = (q: Question) => {
    // Use the backgroundInfo from question data if available
    if (q.backgroundInfo) return q.backgroundInfo;
    return null; // Return null if no background info
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="detail-container">
        <div className="error-state">股票不存在</div>
      </div>
    );
  }

  const overallScore = getOverallScore();
  const scoreInfo = getScoreLevel(overallScore);

  const progress = getLearnProgress();

  return (
    <div className="detail-container">
      {/* Header */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-info">
          <h1>{stock.name}</h1>
          <span className="stock-code">{stock.industry} · {stock.code}</span>
        </div>
        <div className={`price-badge ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
          <span className="price">{stock.currentPrice.toFixed(2)}</span>
          <span className="change">
            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </header>

      {/* 学习进度卡片 */}
      <section className="learn-progress-section">
        <div className="progress-card">
          <div className="progress-header">
            <div className="progress-title">
              <Target size={16} />
              <span>学习进度</span>
            </div>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="progress-stats">
            <span>已学习 {learnedCount}/{totalQuestions} 个问题</span>
            {progress >= 30 && <span className="progress-reward">🃏 再答{Math.max(0, 3 - learnedCount)}题可获得卡片</span>}
          </div>
        </div>
      </section>

      {/* 公司简介 - 更详细的背景信息 */}
      <section className="company-intro-section">
        <div className="intro-card">
          <div className="intro-header">
            <Zap size={16} />
            <span>一句话了解{stock.name}</span>
          </div>
          <p className="intro-highlight">{stock.aiBriefing}</p>
          
          {stock.aiKnowledge && (
            <div className="intro-detail">
              <h4>📖 公司背景</h4>
              <p>{stock.aiKnowledge.basicInfo}</p>
              
              <h4>💡 投资看点</h4>
              <p>{stock.aiKnowledge.investmentAdvice}</p>
              
              <h4>⚠️ 风险提示</h4>
              <p className="risk-text">{stock.aiKnowledge.riskWarning}</p>
            </div>
          )}
        </div>
      </section>

      {/* Questions Section - Core Feature */}
      <section className="questions-section">
        <div className="section-header">
          <div className="title-group">
            <BookOpen size={20} className="title-icon-svg" />
            <div>
              <h2 className="section-title">大家都在问</h2>
              <p className="section-subtitle">通过热门问题，快速认识{stock.name}</p>
            </div>
          </div>
          <button className="shuffle-btn" onClick={handleShuffle}>
            <RefreshCw size={14} />
            换一批
          </button>
        </div>

        <div className="question-cards">
          {displayQuestions.map((q, index) => {
            const style = getCardStyle(index);
            return (
              <div
                key={q.id}
                className="question-game-card"
                style={{ 
                  background: style.bg,
                  borderColor: style.border,
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => navigate(`/game/${stock.code}/${q.id}`)}
              >
                <div className="card-top-row">
                  <div className="tag-group">
                    <span className="game-type-badge">
                      {getTypeIcon(q.type)} {getTypeLabel(q.type)}
                    </span>
                    <span className="knowledge-tag">
                      {q.knowledgeTag || q.category}
                    </span>
                  </div>
                  <span className="asked-count">
                    <Users size={12} />
                    {formatAskedCount(q.askedCount)}人学过
                  </span>
                </div>
                
                {/* Question title first */}
                <h3 className="game-question">{q.question}</h3>
                
                {/* Background info - subtle display below question */}
                {getQuestionBackground(q) && (
                  <p className="question-background">{getQuestionBackground(q)}</p>
                )}
                
                <div className="card-bottom">
                  <span className="learn-hint">点击学习 →</span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="view-all-btn" onClick={handleShuffle}>
          <RefreshCw size={14} />
          探索更多问题（共{questionPool.length}个）
        </button>
      </section>

      {/* Radar Chart */}
      <section className="radar-section">
        <div className="section-header-row">
          <h2 className="section-title">📊 综合画像</h2>
          <div className="score-badge" style={{ background: scoreInfo.color }}>
            <span className="score-level">{scoreInfo.level}</span>
            <span className="score-value">{overallScore}分</span>
          </div>
        </div>

        <div className="radar-wrapper">
          <div className="radar-chart">
            <svg viewBox="0 0 120 120">
              {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                <polygon
                  key={i}
                  points={radarLabels.map((_, idx) => {
                    const angle = (Math.PI * 2 * idx) / 6 - Math.PI / 2;
                    const x = 60 + 45 * scale * Math.cos(angle);
                    const y = 60 + 45 * scale * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              ))}
              {radarLabels.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1="60"
                    y1="60"
                    x2={60 + 45 * Math.cos(angle)}
                    y2={60 + 45 * Math.sin(angle)}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}
              <polygon
                points={getRadarPoints()}
                fill="url(#radarGradient)"
                stroke="var(--accent-pink)"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 45, 85, 0.4)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0.4)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="radar-labels">
              {radarLabels.map((item, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                const x = 50 + 44 * Math.cos(angle);
                const y = 50 + 44 * Math.sin(angle);
                const value = stock.radarData[item.key as keyof typeof stock.radarData];
                return (
                  <div
                    key={item.key}
                    className="radar-label"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="label-text">{item.label}</span>
                    <span className="label-value" style={{ 
                      color: value >= 70 ? 'var(--accent-pink)' : value >= 50 ? 'var(--accent-yellow)' : 'var(--text-muted)'
                    }}>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="radar-insight">
          <div className="insight-header">
            <span className="insight-icon">💡</span>
            <span className="insight-title">AI解读</span>
          </div>
          <p className="insight-text">
            综合评级<strong style={{ color: scoreInfo.color }}>{scoreInfo.level}级（{scoreInfo.text}）</strong>，
            {getRadarInsight()}。
            {overallScore >= 70 ? '短期关注度高，注意控制仓位。' : '可持续跟踪，等待更好时机。'}
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <p className="cta-text">📚 学完了？下一步行动</p>
        <div className="bottom-cta-buttons">
          <button className={`cta-btn watchlist ${isWatchlisted ? 'active' : ''}`} onClick={handleAddWatchlist}>
            <Star size={16} fill={isWatchlisted ? 'currentColor' : 'none'} />
            {isWatchlisted ? '已加自选' : '加入自选'}
          </button>
          <button className="cta-btn trade">
            <TrendingUp size={16} />
            模拟买入
          </button>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <AIChat 
        stockName={stock.name}
        stockCode={stock.code}
        aiKnowledge={stock.aiKnowledge}
      />
    </div>
  );
}
