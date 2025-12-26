import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Flame, Lock, Check } from 'lucide-react';
import './Collection.css';

interface StockCard {
  code: string;
  name: string;
  industry: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  questionsAnswered: number;
  correctCount: number;
  obtainedAt: string;
  theme: string;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredCards: string[];
  reward: string;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface UserProgress {
  totalCards: number;
  totalQuestions: number;
  totalCorrect: number;
  streak: number;
  level: number;
  exp: number;
  cards: StockCard[];
  achievements: Achievement[];
}

// 主题配置
const THEMES: Theme[] = [
  {
    id: 'new-energy',
    name: '新能源赛道',
    icon: '⚡',
    description: '集齐新能源产业链核心公司',
    requiredCards: ['002594', '300750'],
    reward: '「新能源研究员」称号'
  },
  {
    id: 'tech',
    name: '科技先锋',
    icon: '🚀',
    description: '集齐硬核科技公司',
    requiredCards: ['688666'],
    reward: '「科技猎手」称号'
  },
  {
    id: 'consumer',
    name: '消费龙头',
    icon: '🍷',
    description: '集齐消费行业龙头',
    requiredCards: ['600519'],
    reward: '「消费专家」称号'
  },
  {
    id: 'finance',
    name: '金融巨头',
    icon: '🏦',
    description: '集齐金融行业核心标的',
    requiredCards: ['000001'],
    reward: '「金融达人」称号'
  },
  {
    id: 'military',
    name: '军工力量',
    icon: '🛡️',
    description: '集齐军工国防概念股',
    requiredCards: ['600118'],
    reward: '「军工专家」称号'
  }
];

// 成就配置
const ACHIEVEMENTS_CONFIG: Achievement[] = [
  { id: 'first-card', name: '初入股海', icon: '🎯', description: '获得第一张公司卡片', condition: '完成任意股票3道题', progress: 0, target: 1, unlocked: false },
  { id: 'five-cards', name: '小有收获', icon: '📚', description: '收集5张公司卡片', condition: '学习5家不同公司', progress: 0, target: 5, unlocked: false },
  { id: 'first-sr', name: '稀有收藏', icon: '💎', description: '获得第一张SR卡片', condition: '答对率超过70%', progress: 0, target: 1, unlocked: false },
  { id: 'first-ssr', name: '传说降临', icon: '👑', description: '获得第一张SSR卡片', condition: '答对率超过90%', progress: 0, target: 1, unlocked: false },
  { id: 'streak-3', name: '小试牛刀', icon: '🔥', description: '连续答对3题', condition: '连续答对3题', progress: 0, target: 3, unlocked: false },
  { id: 'streak-7', name: '势如破竹', icon: '⚡', description: '连续答对7题', condition: '连续答对7题', progress: 0, target: 7, unlocked: false },
  { id: 'theme-complete', name: '主题大师', icon: '🏆', description: '点亮第一个主题', condition: '集齐一个主题的所有卡片', progress: 0, target: 1, unlocked: false },
  { id: 'questions-50', name: '求知若渴', icon: '📖', description: '累计回答50道题', condition: '回答50道题目', progress: 0, target: 50, unlocked: false },
  { id: 'questions-100', name: '学海无涯', icon: '🎓', description: '累计回答100道题', condition: '回答100道题目', progress: 0, target: 100, unlocked: false },
  { id: 'perfect-stock', name: '满分股神', icon: '💯', description: '某只股票全部答对', condition: '一只股票10题全对', progress: 0, target: 1, unlocked: false },
];

export default function Collection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cards' | 'achievements'>('cards');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = () => {
    // Load from localStorage
    const saved = localStorage.getItem('userProgress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    } else {
      // Initialize default progress
      const defaultProgress: UserProgress = {
        totalCards: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        streak: 0,
        level: 1,
        exp: 0,
        cards: [],
        achievements: ACHIEVEMENTS_CONFIG
      };
      setUserProgress(defaultProgress);
      localStorage.setItem('userProgress', JSON.stringify(defaultProgress));
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'linear-gradient(135deg, #ffd700, #ff8c00)';
      case 'SR': return 'linear-gradient(135deg, #a855f7, #ec4899)';
      case 'R': return 'linear-gradient(135deg, #3b82f6, #06b6d4)';
      default: return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return '0 0 20px rgba(255, 215, 0, 0.5)';
      case 'SR': return '0 0 15px rgba(168, 85, 247, 0.4)';
      case 'R': return '0 0 10px rgba(59, 130, 246, 0.3)';
      default: return 'none';
    }
  };

  const isThemeComplete = (theme: Theme) => {
    if (!userProgress) return false;
    return theme.requiredCards.every(code => 
      userProgress.cards.some(card => card.code === code)
    );
  };

  const getThemeProgress = (theme: Theme) => {
    if (!userProgress) return 0;
    const owned = theme.requiredCards.filter(code =>
      userProgress.cards.some(card => card.code === code)
    ).length;
    return owned / theme.requiredCards.length;
  };

  const getLevelInfo = (exp: number) => {
    const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
    let level = 1;
    for (let i = 0; i < levels.length; i++) {
      if (exp >= levels[i]) level = i + 1;
    }
    const currentLevelExp = levels[level - 1] || 0;
    const nextLevelExp = levels[level] || levels[levels.length - 1];
    const progress = (exp - currentLevelExp) / (nextLevelExp - currentLevelExp);
    return { level, progress, currentExp: exp - currentLevelExp, needExp: nextLevelExp - currentLevelExp };
  };

  if (!userProgress) {
    return (
      <div className="collection-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(userProgress.exp);
  const unlockedAchievements = userProgress.achievements.filter(a => a.unlocked).length;

  return (
    <div className="collection-container">
      {/* Header */}
      <header className="collection-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h1>学习档案</h1>
      </header>

      {/* User Stats */}
      <section className="user-stats">
        <div className="level-card">
          <div className="level-info">
            <span className="level-badge">Lv.{levelInfo.level}</span>
            <span className="level-title">
              {levelInfo.level >= 10 ? '股市大师' : 
               levelInfo.level >= 7 ? '资深股民' :
               levelInfo.level >= 4 ? '进阶学员' : '新手上路'}
            </span>
          </div>
          <div className="exp-bar">
            <div className="exp-fill" style={{ width: `${levelInfo.progress * 100}%` }} />
          </div>
          <span className="exp-text">{levelInfo.currentExp}/{levelInfo.needExp} EXP</span>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <Star size={18} className="stat-icon gold" />
            <div className="stat-info">
              <span className="stat-value">{userProgress.cards.length}</span>
              <span className="stat-label">卡片</span>
            </div>
          </div>
          <div className="stat-item">
            <Trophy size={18} className="stat-icon purple" />
            <div className="stat-info">
              <span className="stat-value">{unlockedAchievements}</span>
              <span className="stat-label">成就</span>
            </div>
          </div>
          <div className="stat-item">
            <Flame size={18} className="stat-icon pink" />
            <div className="stat-info">
              <span className="stat-value">{userProgress.streak}</span>
              <span className="stat-label">连胜</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          🃏 卡片图鉴
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 成就殿堂
        </button>
      </div>

      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <section className="cards-section">
          {/* Themes */}
          <div className="themes-grid">
            {THEMES.map(theme => {
              const complete = isThemeComplete(theme);
              const progress = getThemeProgress(theme);
              return (
                <div 
                  key={theme.id}
                  className={`theme-card ${complete ? 'complete' : ''} ${selectedTheme === theme.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
                >
                  <div className="theme-icon">{theme.icon}</div>
                  <div className="theme-info">
                    <h3>{theme.name}</h3>
                    <div className="theme-progress-bar">
                      <div className="theme-progress-fill" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <span className="theme-status">
                      {complete ? '✨ 已点亮' : `${Math.round(progress * 100)}%`}
                    </span>
                  </div>
                  {complete && <Check size={16} className="complete-icon" />}
                </div>
              );
            })}
          </div>

          {/* Selected Theme Details */}
          {selectedTheme && (
            <div className="theme-detail">
              <h3>{THEMES.find(t => t.id === selectedTheme)?.name} 所需卡片</h3>
              <p className="theme-reward">
                🎁 奖励：{THEMES.find(t => t.id === selectedTheme)?.reward}
              </p>
            </div>
          )}

          {/* Cards Grid */}
          <h3 className="section-subtitle">我的卡片 ({userProgress.cards.length})</h3>
          {userProgress.cards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🃏</div>
              <p>还没有收集到卡片</p>
              <span>完成3道题目即可获得公司卡片</span>
              <button className="start-btn" onClick={() => navigate('/')}>
                去学习 →
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {userProgress.cards.map(card => (
                <div 
                  key={card.code}
                  className="stock-card"
                  style={{ 
                    background: getRarityColor(card.rarity),
                    boxShadow: getRarityGlow(card.rarity)
                  }}
                  onClick={() => navigate(`/stock/${card.code}`)}
                >
                  <div className="card-rarity">{card.rarity}</div>
                  <div className="card-content">
                    <h4>{card.name}</h4>
                    <span className="card-industry">{card.industry}</span>
                    <div className="card-stats">
                      <span>答题 {card.questionsAnswered}</span>
                      <span>正确 {card.correctCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <section className="achievements-section">
          <div className="achievements-summary">
            <span>已解锁 {unlockedAchievements}/{userProgress.achievements.length}</span>
          </div>
          
          <div className="achievements-list">
            {userProgress.achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : <Lock size={20} />}
                </div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  {!achievement.unlocked && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        />
                      </div>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                  )}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="unlocked-date">
                      {new Date(achievement.unlockedAt).toLocaleDateString()} 解锁
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

