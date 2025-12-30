import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight, Sparkles, Trophy, Clock, CheckCircle, Star, Gift, BookOpen } from 'lucide-react';
import stocksData from '../data/stocks.json';
import AIChat from '../components/AIChat';
import './Home.css';

interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  heatIndex: number;
  heatTags: string[];
  aiSummary: string;
  industry?: string;
}

interface DailyProgress {
  date: string;
  completed: boolean;
  stockCode?: string;
  stockName?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [totalLearned, setTotalLearned] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    setStocks(stocksData as Stock[]);
    setLoading(false);
    loadProgress();
  }, []);

  const loadProgress = () => {
    // 从localStorage加载进度
    const savedStreak = localStorage.getItem('learningStreak');
    const savedTotal = localStorage.getItem('totalLearned');
    const lastLearnDate = localStorage.getItem('lastLearnDate');
    const today = new Date().toDateString();

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedTotal) setTotalLearned(parseInt(savedTotal));
    if (lastLearnDate === today) setTodayCompleted(true);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % stocks.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + stocks.length) % stocks.length);
  };

  const getCardPosition = (index: number) => {
    if (index === currentIndex) return 'active';
    const prev = (currentIndex - 1 + stocks.length) % stocks.length;
    const next = (currentIndex + 1) % stocks.length;
    if (index === prev) return 'prev';
    if (index === next) return 'next';
    return 'hidden';
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '👑';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  const getStreakMessage = () => {
    if (streak >= 30) return '股神之路！';
    if (streak >= 14) return '投资达人！';
    if (streak >= 7) return '学习达人！';
    if (streak >= 3) return '初露锋芒！';
    if (streak >= 1) return '坚持就是胜利！';
    return '开启学习之旅';
  };

  const getEncouragement = () => {
    const messages = [
      '今天学习一只股票，明天离财富自由更近一步 💰',
      '巴菲特说：投资自己是最好的投资 📚',
      '每天3分钟，一年认识365只股票 🚀',
      '知识就是力量，学习就是赚钱 💡',
      '别人在刷抖音，你在涨知识 😎',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>正在获取今日热股...</p>
        </div>
      </div>
    );
  }

  const currentStock = stocks[currentIndex];

  return (
    <div className="home-container">
      {/* 今日任务卡片 */}
      <div className="daily-mission">
        <div className="mission-header">
          <div className="mission-time">
            <Clock size={16} />
            <span>每天3分钟</span>
          </div>
          <div className="mission-streak">
            <span className="streak-emoji">{getStreakEmoji()}</span>
            <span className="streak-text">连续{streak}天</span>
          </div>
        </div>
        
        <h1 className="mission-title">
          {todayCompleted ? '✅ 今日任务已完成！' : '📚 今日任务'}
        </h1>
        
        <p className="mission-desc">
          {todayCompleted 
            ? `太棒了！你已完成今日学习，明天继续保持！` 
            : `认识一只热门股票，了解它的投资价值`}
        </p>

        {/* 进度条 */}
        <div className="mission-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: todayCompleted ? '100%' : '0%' }}
            />
          </div>
          <span className="progress-text">{todayCompleted ? '1/1' : '0/1'}</span>
        </div>
      </div>

      {/* 激励语 */}
      <div className="encouragement-banner">
        <Sparkles size={16} />
        <span>{getEncouragement()}</span>
      </div>

      {/* 学习成就概览 */}
      <div className="achievement-bar">
        <div className="achievement-item">
          <div className="achievement-icon">📈</div>
          <div className="achievement-info">
            <span className="achievement-value">{totalLearned}</span>
            <span className="achievement-label">已学股票</span>
          </div>
        </div>
        <div className="achievement-divider" />
        <div className="achievement-item">
          <div className="achievement-icon">{getStreakEmoji()}</div>
          <div className="achievement-info">
            <span className="achievement-value">{streak}天</span>
            <span className="achievement-label">{getStreakMessage()}</span>
          </div>
        </div>
        <div className="achievement-divider" />
        <div className="achievement-item clickable" onClick={() => navigate('/collection')}>
          <div className="achievement-icon">🃏</div>
          <div className="achievement-info">
            <span className="achievement-value">查看</span>
            <span className="achievement-label">收藏卡片</span>
          </div>
        </div>
      </div>

      {/* 今日推荐股票 */}
      <div className="today-stock-section">
        <div className="section-header">
          <h2>
            <span className="fire-icon">🔥</span>
            今日热股推荐
          </h2>
          <span className="stock-count">{currentIndex + 1}/{stocks.length}</span>
        </div>

        <div className="carousel-container">
          <button className="carousel-btn prev" onClick={prevCard}>
            <ChevronLeft size={24} />
          </button>

          <div className="card-stack">
            {stocks.map((stock, index) => {
              const position = getCardPosition(index);
              if (position === 'hidden') return null;

              return (
                <div
                  key={stock.code}
                  className={`stock-card-3d ${position}`}
                  onClick={() => position === 'active' && navigate(`/stock/${stock.code}`)}
                >
                  <div className="card-inner">
                    {/* 卡片顶部标签 */}
                    <div className="card-top">
                      <span className="industry-tag">{stock.industry || '热门'}</span>
                      <div className={`price-change ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* 股票名称 */}
                    <h3 className="stock-name">{stock.name}</h3>
                    
                    {/* AI简介 */}
                    <p className="stock-summary">{stock.aiSummary}</p>

                    {/* 热门话题标签 */}
                    <div className="card-tags">
                      {stock.heatTags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>

                    {/* 底部按钮 */}
                    <div className="card-footer">
                      <div className="heat-info">
                        <Flame size={14} />
                        <span>{stock.heatIndex}w人关注</span>
                      </div>
                      {position === 'active' && (
                        <button className="learn-btn">
                          <BookOpen size={16} />
                          开始学习
                          <span className="time-badge">3分钟</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-btn next" onClick={nextCard}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 进度点 */}
        <div className="carousel-dots">
          {stocks.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* 学习奖励预览 */}
      <div className="reward-preview">
        <div className="reward-header">
          <Gift size={18} />
          <span>完成学习可获得</span>
        </div>
        <div className="reward-items">
          <div className="reward-item">
            <span className="reward-icon">🃏</span>
            <span className="reward-text">股票卡片</span>
          </div>
          <div className="reward-item">
            <span className="reward-icon">⭐</span>
            <span className="reward-text">经验值+15</span>
          </div>
          <div className="reward-item">
            <span className="reward-icon">🔥</span>
            <span className="reward-text">连续天数+1</span>
          </div>
        </div>
      </div>

      {/* 新手导师入口 */}
      <div className="mentor-card" onClick={() => document.querySelector<HTMLButtonElement>('.ai-chat-fab')?.click()}>
        <div className="mentor-icon">
          <Sparkles size={24} />
        </div>
        <div className="mentor-info">
          <h3>🎓 新手导师</h3>
          <p>有疑问？AI导师随时在线答疑！</p>
        </div>
        <div className="mentor-arrow">💬</div>
      </div>

      {/* AI Chat */}
      <AIChat 
        stockName="股票投资"
        stockCode="general"
      />
    </div>
  );
}
