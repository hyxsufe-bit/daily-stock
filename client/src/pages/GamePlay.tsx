import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronDown, ChevronUp, Home, HelpCircle, TrendingUp, TrendingDown, AlertTriangle, Target, Sparkles, Star } from 'lucide-react';
import stocksData from '../data/stocks.json';
import AIChat from '../components/AIChat';
import './GamePlay.css';

interface DetailSection {
  icon: string;
  title: string;
  content: string;
}

interface DetailAnalysis {
  title: string;
  sections: DetailSection[];
}

interface Question {
  id: string;
  type: 'slider' | 'trueFalse' | 'battle';
  category: string;
  question: string;
  correctAnswer?: boolean;
  bullRatio?: number;
  bearRatio?: number;
  bullArgument?: string;
  bearArgument?: string;
  minValue?: number;
  maxValue?: number;
  correctValue?: number;
  unit?: string;
  hints?: string[];
  explanation: string;
  detailAnalysis: DetailAnalysis;
}

interface Stock {
  code: string;
  name: string;
  industry?: string;
  questions: Question[];
}

interface StockProgress {
  questionsAnswered: number;
  correctCount: number;
  answeredIds: string[];
}

interface NewCard {
  code: string;
  name: string;
  industry: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  questionsAnswered: number;
  correctCount: number;
}

export default function GamePlay() {
  const { stockCode, questionId } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [showHints, setShowHints] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCardReward, setShowCardReward] = useState(false);
  const [newCard, setNewCard] = useState<NewCard | null>(null);

  useEffect(() => {
    fetchData();
    // Get streak from localStorage
    const savedStreak = localStorage.getItem('answerStreak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, [stockCode, questionId]);

  useEffect(() => {
    if (question && answered) {
      setExpandedSections(question.detailAnalysis.sections.map((_, i) => i));
    }
  }, [question, answered]);

  const fetchData = async () => {
    try {
      // 使用本地数据
      const foundStock = (stocksData as any[]).find(s => s.code === stockCode);
      if (foundStock) {
        setStock(foundStock);
        const q = foundStock.questions.find((q: Question) => q.id === questionId);
        setQuestion(q || null);
        if (q && q.type === 'slider') {
          setSliderValue((q.minValue + q.maxValue) / 2);
        }
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrueFalseAnswer = (answer: boolean) => {
    if (answered) return;
    setUserAnswer(answer);
    const correct = answer === question?.correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);
    handleAnswerResult(correct);
  };

  const handleBattleAnswer = (side: 'bull' | 'bear') => {
    if (answered) return;
    setUserAnswer(side);
    setAnswered(true);
    // Battle has no correct answer, treat as correct for engagement
    handleAnswerResult(true);
  };

  const handleSliderSubmit = () => {
    if (answered || !question) return;
    setUserAnswer(sliderValue);
    const diff = Math.abs(sliderValue - (question.correctValue || 0));
    const range = (question.maxValue || 100) - (question.minValue || 0);
    const correct = diff <= range * 0.15;
    setIsCorrect(correct);
    setAnswered(true);
    handleAnswerResult(correct);
  };

  const handleAnswerResult = (correct: boolean) => {
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('answerStreak', newStreak.toString());
      if (newStreak >= 3) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }
    } else {
      setStreak(0);
      localStorage.setItem('answerStreak', '0');
    }
    
    // Update stock progress and check for card reward
    updateStockProgress(correct);
  };

  const updateStockProgress = (correct: boolean) => {
    if (!stock || !stockCode || !questionId) return;
    
    // Get current progress for this stock
    const progressKey = `stockProgress_${stockCode}`;
    const savedProgress = localStorage.getItem(progressKey);
    let progress: StockProgress = savedProgress 
      ? JSON.parse(savedProgress) 
      : { questionsAnswered: 0, correctCount: 0, answeredIds: [] };
    
    // Check if already answered this question
    if (progress.answeredIds.includes(questionId)) return;
    
    // Update progress
    progress.questionsAnswered += 1;
    if (correct) progress.correctCount += 1;
    progress.answeredIds.push(questionId);
    
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Update total stats
    updateTotalStats(correct);
    
    // Check if earned a card (3+ questions answered)
    if (progress.questionsAnswered === 3) {
      earnCard(progress);
    }
  };

  const updateTotalStats = (correct: boolean) => {
    const savedProgress = localStorage.getItem('userProgress');
    if (!savedProgress) return;
    
    const userProgress = JSON.parse(savedProgress);
    userProgress.totalQuestions += 1;
    if (correct) userProgress.totalCorrect += 1;
    userProgress.exp += correct ? 15 : 5; // Earn EXP
    
    // Update streak in user progress
    userProgress.streak = parseInt(localStorage.getItem('answerStreak') || '0');
    
    // Check and update achievements
    updateAchievements(userProgress);
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  };

  const updateAchievements = (userProgress: any) => {
    userProgress.achievements = userProgress.achievements.map((achievement: any) => {
      if (achievement.unlocked) return achievement;
      
      switch (achievement.id) {
        case 'first-card':
          achievement.progress = userProgress.cards?.length || 0;
          break;
        case 'five-cards':
          achievement.progress = userProgress.cards?.length || 0;
          break;
        case 'streak-3':
          achievement.progress = Math.max(achievement.progress, userProgress.streak);
          break;
        case 'streak-7':
          achievement.progress = Math.max(achievement.progress, userProgress.streak);
          break;
        case 'questions-50':
        case 'questions-100':
          achievement.progress = userProgress.totalQuestions;
          break;
      }
      
      if (achievement.progress >= achievement.target) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
      }
      
      return achievement;
    });
  };

  const earnCard = (progress: StockProgress) => {
    if (!stock || !stockCode) return;
    
    // Calculate accuracy rate
    const accuracy = progress.correctCount / progress.questionsAnswered;
    
    // Determine rarity based on accuracy
    let rarity: 'N' | 'R' | 'SR' | 'SSR' = 'N';
    if (accuracy >= 0.9) rarity = 'SSR';
    else if (accuracy >= 0.7) rarity = 'SR';
    else if (accuracy >= 0.5) rarity = 'R';
    
    const card: NewCard = {
      code: stockCode,
      name: stock.name,
      industry: stock.industry || '未知行业',
      rarity,
      questionsAnswered: progress.questionsAnswered,
      correctCount: progress.correctCount
    };
    
    // Save card to user progress
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      const userProgress = JSON.parse(savedProgress);
      
      // Check if already has this card
      if (!userProgress.cards.some((c: any) => c.code === stockCode)) {
        userProgress.cards.push({
          ...card,
          obtainedAt: new Date().toISOString(),
          theme: getThemeForStock(stockCode)
        });
        userProgress.totalCards = userProgress.cards.length;
        userProgress.exp += rarity === 'SSR' ? 100 : rarity === 'SR' ? 50 : rarity === 'R' ? 25 : 10;
        
        // Update first-card achievement
        const firstCardAchievement = userProgress.achievements.find((a: any) => a.id === 'first-card');
        if (firstCardAchievement && !firstCardAchievement.unlocked) {
          firstCardAchievement.progress = 1;
          firstCardAchievement.unlocked = true;
          firstCardAchievement.unlockedAt = new Date().toISOString();
        }
        
        // Check SR/SSR achievements
        if (rarity === 'SR' || rarity === 'SSR') {
          const srAchievement = userProgress.achievements.find((a: any) => a.id === 'first-sr');
          if (srAchievement && !srAchievement.unlocked) {
            srAchievement.progress = 1;
            srAchievement.unlocked = true;
            srAchievement.unlockedAt = new Date().toISOString();
          }
        }
        if (rarity === 'SSR') {
          const ssrAchievement = userProgress.achievements.find((a: any) => a.id === 'first-ssr');
          if (ssrAchievement && !ssrAchievement.unlocked) {
            ssrAchievement.progress = 1;
            ssrAchievement.unlocked = true;
            ssrAchievement.unlockedAt = new Date().toISOString();
          }
        }
        
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // Show card reward animation
        setNewCard(card);
        setShowCardReward(true);
      }
    }
  };

  const getThemeForStock = (code: string): string => {
    const themeMap: { [key: string]: string } = {
      '002594': 'new-energy',
      '300750': 'new-energy',
      '688666': 'tech',
      '600519': 'consumer',
      '000001': 'finance',
      '600118': 'military'
    };
    return themeMap[code] || 'other';
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
  };

  const getIconComponent = (icon: string) => {
    switch(icon) {
      case '📈': return <TrendingUp size={18} className="section-icon-svg bull" />;
      case '📉': return <TrendingDown size={18} className="section-icon-svg bear" />;
      case '⚠️': return <AlertTriangle size={18} className="section-icon-svg warning" />;
      case '🎯': return <Target size={18} className="section-icon-svg target" />;
      default: return <span className="section-emoji">{icon}</span>;
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="content-line">
            {parts.map((part, j) => 
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      }
      if (line.startsWith('•') || line.startsWith('- ')) {
        return <p key={i} className="list-item">{line}</p>;
      }
      if (/^\d+[\.\、\)]/.test(line)) {
        return <p key={i} className="list-item numbered">{line}</p>;
      }
      if (line.trim() === '') {
        return <div key={i} className="spacer" />;
      }
      return <p key={i} className="content-line">{line}</p>;
    });
  };

  const getSliderAccuracy = () => {
    if (!question || question.type !== 'slider') return 0;
    const diff = Math.abs((userAnswer as number) - (question.correctValue || 0));
    const range = (question.maxValue || 100) - (question.minValue || 0);
    return Math.max(0, 100 - (diff / range) * 100);
  };

  const getInvestmentAdvice = () => {
    if (!stock || !question) return null;
    
    const advices = {
      battle: {
        bull: `基于当前市场情绪，${Math.round((question.bullRatio || 0.5) * 100)}%的投资者持看多观点。建议关注基本面变化，设置好止损位后可适量参与。`,
        bear: `市场存在分歧，${Math.round((question.bearRatio || 0.5) * 100)}%的投资者持谨慎态度。建议观望为主，等待更好的入场时机。`
      },
      trueFalse: {
        correct: '你的判断正确！说明你对这方面已有一定了解，可以继续深入研究该公司的投资价值。',
        wrong: '这个知识点很重要！建议收藏本题，后续关注相关信息，完善你的投资认知体系。'
      },
      slider: {
        accurate: '你的估算相当准确！说明你对市场数据有较好的敏感度，继续保持。',
        close: '估算结果接近正确答案，对基本面已有初步认识，建议深入研究具体财务数据。',
        far: '估算偏差较大，建议多关注公司定期报告和行业数据，提升对数据的敏感度。'
      }
    };

    if (question.type === 'battle') {
      return userAnswer === 'bull' ? advices.battle.bull : advices.battle.bear;
    }
    if (question.type === 'trueFalse') {
      return isCorrect ? advices.trueFalse.correct : advices.trueFalse.wrong;
    }
    if (question.type === 'slider') {
      const accuracy = getSliderAccuracy();
      if (accuracy >= 85) return advices.slider.accurate;
      if (accuracy >= 50) return advices.slider.close;
      return advices.slider.far;
    }
    return null;
  };

  // Reaction buttons config
  const reactions = question?.type === 'battle' 
    ? [
        { id: 'agree', emoji: '🤝', label: '有道理' },
        { id: 'think', emoji: '🤔', label: '再想想' },
        { id: 'share', emoji: '📤', label: '分享观点' },
      ]
    : isCorrect 
    ? [
        { id: 'learned', emoji: '💡', label: '学到了' },
        { id: 'easy', emoji: '😎', label: '太简单' },
        { id: 'more', emoji: '🔥', label: '继续学' },
      ]
    : [
        { id: 'confused', emoji: '😵', label: '看不懂' },
        { id: 'clown', emoji: '🤡', label: '我是韭菜' },
        { id: 'review', emoji: '📖', label: '再看一遍' },
      ];

  // Encouragement messages
  const getEncouragement = () => {
    if (isCorrect) {
      if (streak >= 5) return { emoji: '🏆', text: `太强了！连续${streak}题正确！`, sub: '你已经超过90%的用户了' };
      if (streak >= 3) return { emoji: '🔥', text: `连续${streak}题正确！`, sub: '继续保持这个势头' };
      return { emoji: '✅', text: '回答正确！', sub: '又学到新知识了' };
    } else {
      const messages = [
        { emoji: '💪', text: '没关系，下次一定！', sub: '投资路上，错误是最好的老师' },
        { emoji: '🌱', text: '知道答案了吧~', sub: '记住这个知识点，下次就不会错了' },
        { emoji: '📚', text: '学习机会来了！', sub: '看看下面的解析，涨涨知识' },
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  if (loading) {
    return (
      <div className="game-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!stock || !question) {
    return (
      <div className="game-container">
        <div className="error-state">问题不存在</div>
      </div>
    );
  }

  const encouragement = answered ? getEncouragement() : null;

  return (
    <div className="game-container">
      {/* Streak Reward Animation */}
      {showReward && (
        <div className="reward-overlay">
          <div className="reward-content">
            <Sparkles size={48} className="reward-icon" />
            <h2>🎉 连续答对{streak}题！</h2>
            <p>你真的太厉害了！</p>
          </div>
        </div>
      )}

      {/* Card Reward Animation */}
      {showCardReward && newCard && (
        <div className="card-reward-overlay" onClick={() => setShowCardReward(false)}>
          <div className="card-reward-content">
            <div className="card-reveal">
              <div className={`earned-card rarity-${newCard.rarity.toLowerCase()}`}>
                <div className="card-rarity-badge">{newCard.rarity}</div>
                <div className="card-glow"></div>
                <Star size={32} className="card-star" />
                <h3>{newCard.name}</h3>
                <span className="card-industry">{newCard.industry}</span>
                <div className="card-accuracy">
                  正确率 {Math.round((newCard.correctCount / newCard.questionsAnswered) * 100)}%
                </div>
              </div>
            </div>
            <h2 className="reward-title">🎉 获得新卡片！</h2>
            <p className="reward-desc">
              {newCard.rarity === 'SSR' ? '太强了！传说级卡片！' :
               newCard.rarity === 'SR' ? '不错哦！稀有卡片！' :
               newCard.rarity === 'R' ? '继续努力，下次更好！' :
               '收集成功！多答题提升稀有度'}
            </p>
            <button className="close-btn" onClick={() => setShowCardReward(false)}>
              收下卡片
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="game-header">
        <button className="back-btn" onClick={() => navigate(`/stock/${stockCode}`)}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-info">
          <span className="stock-name">{stock.name}</span>
          <span className="question-category">{question.category}</span>
        </div>
        {streak > 0 && (
          <div className="streak-badge">
            🔥 {streak}连对
          </div>
        )}
      </header>

      {/* Question */}
      <section className="question-section">
        <h1 className="question-text">{question.question}</h1>
      </section>

      {/* Game Area */}
      {!answered ? (
        <section className="game-area">
          {question.type === 'trueFalse' && (
            <div className="trueFalse-game">
              <p className="game-hint">判断这个说法是真是假</p>
              <div className="answer-buttons">
                <button className="answer-btn true-btn" onClick={() => handleTrueFalseAnswer(true)}>
                  <Check size={24} />
                  <span>真的！</span>
                </button>
                <button className="answer-btn false-btn" onClick={() => handleTrueFalseAnswer(false)}>
                  <X size={24} />
                  <span>假的！</span>
                </button>
              </div>
            </div>
          )}

          {question.type === 'battle' && (
            <div className="battle-game">
              <p className="game-hint">你站哪边？</p>
              <div className="battle-options">
                <button className="battle-btn bull-btn" onClick={() => handleBattleAnswer('bull')}>
                  <span className="battle-emoji">🔴</span>
                  <span className="battle-text">{question.bullArgument}</span>
                </button>
                <button className="battle-btn bear-btn" onClick={() => handleBattleAnswer('bear')}>
                  <span className="battle-emoji">🟢</span>
                  <span className="battle-text">{question.bearArgument}</span>
                </button>
              </div>
            </div>
          )}

          {question.type === 'slider' && (
            <div className="slider-game">
              <p className="game-hint">拖动滑块选择你的答案</p>
              <div className="slider-display">
                <span className="slider-value">{sliderValue.toFixed(1)}</span>
                <span className="slider-unit">{question.unit}</span>
              </div>
              <div className="slider-container">
                <span className="slider-min">{question.minValue}{question.unit}</span>
                <input
                  type="range"
                  min={question.minValue}
                  max={question.maxValue}
                  step={(question.maxValue! - question.minValue!) / 100}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                  className="game-slider"
                />
                <span className="slider-max">{question.maxValue}{question.unit}</span>
              </div>
              {question.hints && question.hints.length > 0 && (
                <div className="hints-section">
                  <button className="hints-toggle" onClick={() => setShowHints(!showHints)}>
                    <HelpCircle size={16} />
                    {showHints ? '隐藏提示' : '需要提示？'}
                  </button>
                  {showHints && (
                    <div className="hints-list">
                      {question.hints.map((hint, i) => (
                        <p key={i} className="hint-item">💡 {hint}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button className="submit-btn" onClick={handleSliderSubmit}>确认答案</button>
            </div>
          )}
        </section>
      ) : (
        <section className="result-section">
          {/* Encouragement Header */}
          {encouragement && question.type !== 'battle' && (
            <div className={`encouragement-card ${isCorrect ? 'correct' : 'wrong'}`}>
              <span className="encouragement-emoji">{encouragement.emoji}</span>
              <div className="encouragement-text">
                <h3>{encouragement.text}</h3>
                <p>{encouragement.sub}</p>
              </div>
            </div>
          )}

          {/* Slider Result */}
          {question.type === 'slider' && (
            <div className="slider-result">
              <div className="result-comparison">
                <div className="result-item your-answer">
                  <span className="result-label">你的答案</span>
                  <span className="result-number">{(userAnswer as number).toFixed(1)}{question.unit}</span>
                </div>
                <div className="result-vs">VS</div>
                <div className="result-item correct-answer">
                  <span className="result-label">正确答案</span>
                  <span className="result-number">{question.correctValue}{question.unit}</span>
                </div>
              </div>
              <div className="accuracy-bar">
                <div className="accuracy-label">准确度</div>
                <div className="accuracy-track">
                  <div className="accuracy-fill" style={{ width: `${getSliderAccuracy()}%` }} />
                </div>
                <div className="accuracy-value">{getSliderAccuracy().toFixed(0)}%</div>
              </div>
            </div>
          )}

          {/* Battle Result */}
          {question.type === 'battle' && (
            <div className="battle-result">
              <div className="battle-bar">
                <div className="bull-side" style={{ width: `${(question.bullRatio || 0.5) * 100}%` }}>
                  🔴 {Math.round((question.bullRatio || 0.5) * 100)}%
                </div>
                <div className="bear-side" style={{ width: `${(question.bearRatio || 0.5) * 100}%` }}>
                  {Math.round((question.bearRatio || 0.5) * 100)}% 🟢
                </div>
              </div>
              <p className="battle-summary">
                {userAnswer === 'bull' 
                  ? (question.bullRatio || 0.5) > 0.5 ? '👏 英雄所见略同！' : '💪 真理掌握在少数人手中'
                  : (question.bearRatio || 0.5) > 0.5 ? '👏 英雄所见略同！' : '💪 真理掌握在少数人手中'}
              </p>
            </div>
          )}

          {/* Deep Analysis - 放在最上面 */}
          <div className="analysis-section">
            <h2 className="analysis-main-title">📚 深度解读：{question.detailAnalysis.title}</h2>
            
            <div className="analysis-cards">
              {question.detailAnalysis.sections.map((section, index) => (
                <div key={index} className={`analysis-card ${expandedSections.includes(index) ? 'expanded' : ''}`}>
                  <button className="card-header" onClick={() => toggleSection(index)}>
                    {getIconComponent(section.icon)}
                    <span className="card-title">{section.title}</span>
                    {expandedSections.includes(index) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.includes(index) && (
                    <div className="card-content">
                      {renderContent(section.content)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core Conclusion */}
          <div className="conclusion-card">
            <div className="conclusion-header">
              <span className="conclusion-icon">💡</span>
              <span className="conclusion-label">核心结论</span>
            </div>
            <p className="conclusion-text">{question.explanation}</p>
          </div>

          {/* Investment Advice */}
          <div className="advice-card">
            <div className="advice-header">
              <span className="advice-icon">🎯</span>
              <span className="advice-label">投资建议</span>
            </div>
            <p className="advice-text">{getInvestmentAdvice()}</p>
          </div>

          {/* Reaction Buttons */}
          <div className="reaction-section">
            <div className="reaction-header">
              <p className="reaction-label">你的感受：</p>
              <span className="reaction-count">👥 {Math.floor(Math.random() * 500 + 200)}人已互动</span>
            </div>
            <div className="reaction-buttons">
              {reactions.map(r => (
                <button
                  key={r.id}
                  className={`reaction-btn ${selectedReaction === r.id ? 'active' : ''}`}
                  onClick={() => handleReaction(r.id)}
                >
                  <span className="reaction-emoji">{r.emoji}</span>
                  <span className="reaction-text">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="nav-buttons">
            <button className="nav-btn primary" onClick={() => navigate(`/stock/${stockCode}`)}>
              继续学习其他问题 →
            </button>
            <button className="nav-btn secondary" onClick={() => navigate('/')}>
              <Home size={16} /> 返回首页
            </button>
          </div>
        </section>
      )}

      {/* AI Chat - 新手导师 */}
      <AIChat 
        stockName={stock.name}
        stockCode={stock.code}
      />
    </div>
  );
}
