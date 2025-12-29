import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Lightbulb, ChevronRight } from 'lucide-react';
import './AIChat.css';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  stockName: string;
  stockCode: string;
  aiKnowledge?: {
    basicInfo: string;
    investmentAdvice: string;
    riskWarning: string;
    hotTopics: string[];
    faq: { q: string; a: string }[];
  };
}

export default function AIChat({ stockName, stockCode, aiKnowledge }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 推荐问题
  const suggestedQuestions = [
    `${stockName}现在适合买入吗？`,
    `${stockName}的主要风险有哪些？`,
    `${stockName}的核心竞争力是什么？`,
    `${stockName}未来发展前景如何？`,
    `新手应该怎么看${stockName}？`,
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // 发送欢迎消息
      const welcomeMsg: Message = {
        id: 'welcome',
        type: 'ai',
        content: `👋 嗨！我是你的新手导师～\n\n关于 **${stockName}**，有任何问题都可以问我！点击下方的热门问题，或者直接输入你想了解的内容。`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, stockName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    // 基于知识库回答
    if (aiKnowledge) {
      // 买入/投资相关
      if (q.includes('买') || q.includes('入手') || q.includes('投资') || q.includes('适合')) {
        return `💡 关于${stockName}是否适合买入：\n\n${aiKnowledge.investmentAdvice}\n\n⚠️ **温馨提示**：投资有风险，建议根据自己的风险承受能力做决定，不要盲目追涨杀跌哦～`;
      }
      
      // 风险相关
      if (q.includes('风险') || q.includes('危险') || q.includes('亏') || q.includes('跌')) {
        return `⚠️ ${stockName}的主要风险：\n\n${aiKnowledge.riskWarning}\n\n🛡️ **建议**：控制好仓位，分批建仓，不要把鸡蛋放在一个篮子里！`;
      }
      
      // 基本面/竞争力相关
      if (q.includes('竞争') || q.includes('优势') || q.includes('核心') || q.includes('护城河')) {
        return `🏆 ${stockName}的核心竞争力：\n\n${aiKnowledge.basicInfo}\n\n这些优势让${stockName}在行业中保持领先地位。`;
      }
      
      // 前景/未来相关
      if (q.includes('前景') || q.includes('未来') || q.includes('发展') || q.includes('趋势')) {
        return `🔮 ${stockName}的发展前景：\n\n${aiKnowledge.basicInfo}\n\n${aiKnowledge.investmentAdvice}\n\n📈 长期来看，行业发展趋势是关键！`;
      }
      
      // 新手相关
      if (q.includes('新手') || q.includes('小白') || q.includes('入门') || q.includes('怎么看')) {
        return `📚 给新手的${stockName}分析指南：\n\n**1. 先了解公司基本面**\n${aiKnowledge.basicInfo}\n\n**2. 关注风险点**\n${aiKnowledge.riskWarning}\n\n**3. 投资建议**\n${aiKnowledge.investmentAdvice}\n\n💪 建议先用模拟盘练练手，熟悉后再实盘操作！`;
      }
      
      // 查找FAQ匹配
      const matchedFaq = aiKnowledge.faq.find(item => 
        q.includes(item.q.slice(0, 4)) || item.q.toLowerCase().includes(q.slice(0, 6))
      );
      if (matchedFaq) {
        return `📖 关于这个问题：\n\n${matchedFaq.a}`;
      }
    }
    
    // 通用回答
    if (q.includes('估值') || q.includes('贵不贵')) {
      return `📊 关于${stockName}的估值：\n\n估值是个复杂的话题，需要综合考虑PE、PB、PEG等多个指标。\n\n**简单判断方法**：\n• 对比历史PE分位\n• 对比同行业估值\n• 考虑未来增长预期\n\n建议结合「综合画像」里的估值安全指标来判断！`;
    }
    
    if (q.includes('业绩') || q.includes('财报') || q.includes('利润')) {
      return `📈 关于${stockName}的业绩：\n\n查看业绩要关注几个核心指标：\n• **营收增速**：反映公司成长性\n• **净利润增速**：反映盈利能力\n• **毛利率变化**：反映竞争力\n\n建议去看看最新的财报解读！`;
    }
    
    if (q.includes('机构') || q.includes('主力')) {
      return `🏦 关于${stockName}的机构动向：\n\n机构持仓是重要参考：\n• 北向资金流入/流出\n• 基金持仓变化\n• 研报评级\n\n可以参考页面上的「机构关注」指标！`;
    }
    
    // 默认回答
    return `🤔 关于"${question}"这个问题...\n\n这是个好问题！建议你：\n\n1. 📖 先看看上面的热门问答，里面有很多干货\n2. 📊 参考综合画像的各项指标\n3. 💬 也可以换个方式问我，比如问"${stockName}的风险"或"${stockName}能不能买"\n\n我会尽力帮你解答！`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const aiResponse = generateAIResponse(inputValue);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSend(), 100);
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button 
        className={`ai-chat-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="fab-glow"></div>
        <Sparkles size={24} />
        <span className="fab-label">新手导师</span>
      </button>

      {/* 聊天面板 */}
      <div className={`ai-chat-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <div className="ai-avatar">
              <Sparkles size={18} />
            </div>
            <div className="header-info">
              <h3>新手导师</h3>
              <span className="status">
                <span className="status-dot"></span>
                在线 · 有问必答
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.type === 'ai' && (
                <div className="message-avatar">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble" dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>') 
                }} />
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai">
              <div className="message-avatar">
                <Sparkles size={14} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="suggestions">
            <div className="suggestions-header">
              <Lightbulb size={14} />
              <span>热门问题</span>
            </div>
            <div className="suggestions-list">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(q)}
                >
                  <span>{q}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder={`问问关于${stockName}的问题...`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button 
            className="send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chat-backdrop" onClick={() => setIsOpen(false)} />}
    </>
  );
}

