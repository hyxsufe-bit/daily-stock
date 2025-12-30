import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Users, BookOpen, Star, TrendingUp, Target } from 'lucide-react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const foundStock = (stocksData as Stock[]).find(s => s.code === stockCode);
    if (foundStock) {
      setStock(foundStock);
      const shuffled = [...foundStock.questions].sort(() => Math.random() - 0.5);
      setQuestionPool(shuffled);
      setTotalQuestions(foundStock.questions.length);
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

  // 每页显示3个问题
  const questionsPerPage = 3;
  const totalPages = Math.ceil(questionPool.length / questionsPerPage);
  
  const getCurrentPageQuestions = () => {
    const start = currentQuestionIndex * questionsPerPage;
    return questionPool.slice(start, start + questionsPerPage);
  };

  // 获取问题类型对应的卡片颜色
  const getTypeCardStyle = (type: string) => {
    switch (type) {
      case 'battle':
        return { bg: 'linear-gradient(135deg, rgba(255, 45, 85, 0.12), rgba(255, 45, 85, 0.05))', border: 'rgba(255, 45, 85, 0.3)' };
      case 'slider':
        return { bg: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(0, 212, 255, 0.05))', border: 'rgba(0, 212, 255, 0.3)' };
      case 'trueFalse':
        return { bg: 'linear-gradient(135deg, rgba(46, 213, 115, 0.12), rgba(46, 213, 115, 0.05))', border: 'rgba(46, 213, 115, 0.3)' };
      default:
        return { bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(168, 85, 247, 0.05))', border: 'rgba(168, 85, 247, 0.3)' };
    }
  };

  const handleShuffle = () => {
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    setQuestionPool(shuffled);
    setCurrentQuestionIndex(0);
  };

  const nextPage = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % totalPages);
      setSwipeDirection(null);
    }, 200);
  };

  const prevPage = () => {
    setSwipeDirection('right');
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => (prev - 1 + totalPages) % totalPages);
      setSwipeDirection(null);
    }, 200);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextPage();
    } else if (distance < -minSwipeDistance) {
      prevPage();
    }
    setTouchStart(0);
    setTouchEnd(0);
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

  const currentPageQuestions = getCurrentPageQuestions();

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

      {/* 探索进度 - 放在最上面 */}
      <section className="explore-progress-section">
        <div className="explore-progress-card">
          <div className="explore-header">
            <div className="explore-title">
              <span className="explore-emoji">🎮</span>
              <span>探索{stock.name}</span>
            </div>
            <span className="explore-percent">{progress}%</span>
          </div>
          <div className="explore-bar-wrapper">
            <div className="explore-bar-bg">
              <div className="explore-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="explore-stats">
            <span className="explore-count">已解锁 {learnedCount}/{totalQuestions} 个话题</span>
            {learnedCount < 3 && (
              <span className="explore-reward">🃏 再答{Math.max(0, 3 - learnedCount)}题得卡片</span>
            )}
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="questions-section-swipe">
        <div className="section-header-swipe">
          <div className="title-group">
            <BookOpen size={20} className="title-icon-svg" />
            <div>
              <h2 className="section-title">🔥 热门话题</h2>
              <p className="section-subtitle">左右滑动查看更多</p>
            </div>
          </div>
          <button className="shuffle-btn" onClick={handleShuffle}>
            🔄 换一换
          </button>
        </div>

        {/* 左右滑动卡片区域 */}
        <div 
          className="swipe-cards-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="swipe-nav-btn prev" onClick={prevPage}>
            <ChevronLeft size={20} />
          </button>

          <div className={`question-cards-list ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
            {currentPageQuestions.map((q, index) => (
              <div 
                key={q.id}
                className={`question-card-item type-${q.type}`}
                style={{ 
                  background: getTypeCardStyle(q.type).bg,
                  borderColor: getTypeCardStyle(q.type).border
                }}
                onClick={() => navigate(`/game/${stock.code}/${q.id}`)}
              >
                <div className="card-top-row">
                  <div className="tag-group">
                    <span className={`game-type-badge type-${q.type}`}>
                      {getTypeIcon(q.type)} {getTypeLabel(q.type)}
                    </span>
                    <span className="knowledge-tag">
                      {q.knowledgeTag || q.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="game-question">{q.question}</h3>
                
                {getQuestionBackground(q) && (
                  <p className="question-background">{getQuestionBackground(q)}</p>
                )}
                
                <div className="card-bottom">
                  <span className="asked-count">
                    <Users size={12} />
                    {formatAskedCount(q.askedCount)}人学过
                  </span>
                  <span className="learn-arrow">→</span>
                </div>
              </div>
            ))}
          </div>

          <button className="swipe-nav-btn next" onClick={nextPage}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="swipe-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`swipe-dot ${index === currentQuestionIndex ? 'active' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            />
          ))}
        </div>
      </section>


      {/* 公司简介 */}
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
