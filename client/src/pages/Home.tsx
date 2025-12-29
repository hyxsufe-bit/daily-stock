import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight, Sparkles, Trophy, Target, BookOpen } from 'lucide-react';
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
}

export default function Home() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak] = useState(3);

  useEffect(() => {
    // 使用本地数据
    setStocks(stocksData as Stock[]);
    setLoading(false);
  }, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % stocks.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + stocks.length) % stocks.length);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  const getRankClass = (index: number) => {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return 'rank-normal';
  };

  const getCardPosition = (index: number) => {
    if (index === currentIndex) return 'active';
    
    const prev = (currentIndex - 1 + stocks.length) % stocks.length;
    const next = (currentIndex + 1) % stocks.length;
    
    if (index === prev) return 'prev';
    if (index === next) return 'next';
    return 'hidden';
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

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-main">
          <h1 className="app-title">
            <span className="title-emoji">📈</span>
            每日一股
          </h1>
          <p className="app-tagline">每天认识一只股票，轻松入门A股</p>
        </div>
        <div className="header-actions">
          <button className="collection-btn" onClick={() => navigate('/collection')}>
            <BookOpen size={18} />
          </button>
          <div className="streak-pill">
            <Flame size={16} />
            <span>{streak}天连胜</span>
          </div>
        </div>
      </header>

      {/* Game Stats */}
      <div className="game-stats">
        <div className="stat-card">
          <Trophy size={18} className="stat-icon gold" />
          <div className="stat-info">
            <span className="stat-value">12</span>
            <span className="stat-label">已完成</span>
          </div>
        </div>
        <div className="stat-card">
          <Target size={18} className="stat-icon purple" />
          <div className="stat-info">
            <span className="stat-value">78%</span>
            <span className="stat-label">正确率</span>
          </div>
        </div>
        <div className="stat-card">
          <Sparkles size={18} className="stat-icon pink" />
          <div className="stat-info">
            <span className="stat-value">{stocks.length}</span>
            <span className="stat-label">今日热股</span>
          </div>
        </div>
      </div>

      {/* Card Carousel */}
      <div className="carousel-section">
        <h2 className="carousel-title">
          <span className="title-icon">📊</span>
          今日挑战
        </h2>

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
                    <div className={`card-rank ${getRankClass(index)}`}>
                      {getRankIcon(index)}
                    </div>

                    <div className="card-header">
                      <h3 className="stock-name">{stock.name}</h3>
                      <div className={`stock-change ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
                        {stock.changePercent >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                    </div>

                    <p className="stock-summary">{stock.aiSummary}</p>

                    <div className="card-tags">
                      {stock.heatTags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="card-footer">
                      <div className="heat-display">
                        <Flame size={16} className="heat-icon" />
                        <span className="heat-value">{stock.heatIndex}w热度</span>
                      </div>
                      {position === 'active' && (
                        <button className="start-btn">
                          开始挑战 →
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

        {/* Progress Dots */}
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

      {/* Quick Access */}
      <div className="quick-access">
        <h2 className="section-title">
          <span className="title-icon">⚡</span>
          快速挑战
        </h2>
        <div className="quick-list">
          {stocks.map((stock, index) => (
            <div
              key={stock.code}
              className={`quick-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => navigate(`/stock/${stock.code}`)}
            >
              <span className="quick-rank">{getRankIcon(index)}</span>
              <span className="quick-name">{stock.name}</span>
              <span className={`quick-change ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 新手导师入口卡片 */}
      <div className="mentor-card" onClick={() => document.querySelector<HTMLButtonElement>('.ai-chat-fab')?.click()}>
        <div className="mentor-icon">
          <Sparkles size={24} />
        </div>
        <div className="mentor-info">
          <h3>🎓 新手导师</h3>
          <p>有问题？AI导师在线答疑，随时帮你解惑！</p>
        </div>
        <div className="mentor-arrow">💬</div>
      </div>

      {/* AI Chat - 新手导师 */}
      <AIChat 
        stockName="股票投资"
        stockCode="general"
      />
    </div>
  );
}
