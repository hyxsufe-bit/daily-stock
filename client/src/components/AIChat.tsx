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

  const isGeneral = stockCode === 'general';

  // 推荐问题 - 根据场景不同
  const suggestedQuestions = isGeneral ? [
    '新手炒股应该怎么入门？',
    '买股票最少需要多少钱？',
    '什么是PE、PB？怎么看估值？',
    '怎么判断一只股票值不值得买？',
    '股票亏了应该割肉还是死扛？',
  ] : [
    `${stockName}现在适合买入吗？`,
    `${stockName}的主要风险有哪些？`,
    `${stockName}的核心竞争力是什么？`,
    `${stockName}未来发展前景如何？`,
    `新手应该怎么看${stockName}？`,
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // 发送欢迎消息
      const welcomeContent = isGeneral 
        ? `👋 嗨！我是你的**新手导师**～\n\n有任何关于股票投资的问题都可以问我！无论是基础概念、选股方法还是投资心态，我都会尽力帮你解答。\n\n点击下方的热门问题开始吧！`
        : `👋 嗨！我是你的新手导师～\n\n关于 **${stockName}**，有任何问题都可以问我！点击下方的热门问题，或者直接输入你想了解的内容。`;
      
      const welcomeMsg: Message = {
        id: 'welcome',
        type: 'ai',
        content: welcomeContent,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, stockName, isGeneral]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    // 通用投资问题（首页场景）
    if (isGeneral) {
      if (q.includes('入门') || q.includes('新手') || q.includes('开始')) {
        return `📚 **新手炒股入门指南**\n\n**第一步：开户**\n选择一家正规券商（如华泰、中信、招商），手机APP就能开户，0费用。\n\n**第二步：入金**\n银行卡转钱到证券账户，建议新手先投入1-2万练手。\n\n**第三步：学习基础**\n• 了解什么是PE、PB、ROE\n• 学会看K线和成交量\n• 理解涨停、跌停规则\n\n**第四步：模拟交易**\n先用模拟盘练习1-3个月，熟悉操作再实盘。\n\n💡 **最重要的一点**：用闲钱投资，亏了不影响生活！`;
      }
      
      if (q.includes('多少钱') || q.includes('最少') || q.includes('门槛')) {
        return `💰 **炒股最低门槛**\n\n**理论上**：1手=100股，最便宜的股票几百元就能买。\n\n**实际建议**：\n• 最低准备 **5000-10000元**\n• 这样可以分散买2-3只股票\n• 降低单只股票的风险\n\n**注意事项**：\n• 创业板需要10万+2年经验\n• 科创板需要50万+2年经验\n• 北交所需要50万+2年经验\n\n新手建议从主板股票开始！`;
      }
      
      if (q.includes('pe') || q.includes('pb') || q.includes('估值') || q.includes('指标')) {
        return `📊 **核心估值指标详解**\n\n**PE（市盈率）**\n公式：股价 ÷ 每股收益\n含义：投资多少年回本\n• PE<15：便宜\n• PE 15-25：合理\n• PE>30：偏贵\n\n**PB（市净率）**\n公式：股价 ÷ 每股净资产\n含义：花多少钱买1元资产\n• PB<1：破净，可能被低估\n• PB>3：偏贵\n\n**ROE（净资产收益率）**\n含义：公司赚钱能力\n• ROE>15%：优秀\n• ROE>20%：非常优秀\n\n💡 **记住**：估值要结合行业对比，不能单看数字！`;
      }
      
      if (q.includes('判断') || q.includes('值得买') || q.includes('怎么选') || q.includes('选股')) {
        return `🎯 **选股四步法**\n\n**第一步：看行业**\n选择有发展前景的行业，避免夕阳行业\n\n**第二步：看龙头**\n优先选行业龙头，竞争力强、抗风险能力好\n\n**第三步：看估值**\n对比历史估值和同行，避免买在高位\n\n**第四步：看资金**\n关注北向资金、机构持仓变化\n\n**简单口诀**：\n✅ 好行业 + 好公司 + 好价格 = 好股票\n\n⚠️ **避坑指南**：\n• 不买ST股票\n• 不买业绩亏损的\n• 不追涨停板\n• 不听小道消息`;
      }
      
      if (q.includes('亏') || q.includes('割肉') || q.includes('死扛') || q.includes('套牢')) {
        return `😰 **被套牢了怎么办？**\n\n**先问自己三个问题**：\n1. 公司基本面变了吗？\n2. 买入逻辑还成立吗？\n3. 资金是急用钱吗？\n\n**决策建议**：\n\n**该割肉的情况**：\n• 公司业绩暴雷、财务造假\n• 行业逻辑彻底改变\n• 需要急用钱\n• 亏损超过30%且看不到希望\n\n**可以扛的情况**：\n• 只是大盘整体回调\n• 公司基本面没变\n• 用的是闲钱\n• 有信心长期持有\n\n💡 **最重要的是**：不要情绪化决策，冷静分析后再行动！`;
      }
      
      if (q.includes('k线') || q.includes('技术') || q.includes('图')) {
        return `📈 **K线入门知识**\n\n**K线基础**：\n• 红色（阳线）：收盘价>开盘价，上涨\n• 绿色（阴线）：收盘价<开盘价，下跌\n\n**常见形态**：\n• 大阳线：强烈看涨信号\n• 大阴线：强烈看跌信号\n• 十字星：多空平衡，可能变盘\n\n**重要均线**：\n• 5日线：短期趋势\n• 20日线：中期趋势\n• 60日线：中长期趋势\n• 250日线（年线）：长期趋势\n\n⚠️ **提醒**：技术分析只是辅助，不能单独依赖！`;
      }
      
      // 通用默认回答
      return `🤔 关于"${question}"...\n\n这是个好问题！作为新手导师，我建议你：\n\n1. 📖 点击上方的热门问题了解基础知识\n2. 🎯 选一只感兴趣的股票深入学习\n3. 💬 有具体问题可以继续问我\n\n**推荐学习路径**：\n先了解基础指标（PE、PB）→ 再学选股方法 → 最后实战练习\n\n有什么想了解的，尽管问！`;
    }
    
    // 基于知识库回答（个股场景）
    if (aiKnowledge) {
      if (q.includes('买') || q.includes('入手') || q.includes('投资') || q.includes('适合')) {
        return `💡 关于${stockName}是否适合买入：\n\n${aiKnowledge.investmentAdvice}\n\n⚠️ **温馨提示**：投资有风险，建议根据自己的风险承受能力做决定，不要盲目追涨杀跌哦～`;
      }
      
      if (q.includes('风险') || q.includes('危险') || q.includes('亏') || q.includes('跌')) {
        return `⚠️ ${stockName}的主要风险：\n\n${aiKnowledge.riskWarning}\n\n🛡️ **建议**：控制好仓位，分批建仓，不要把鸡蛋放在一个篮子里！`;
      }
      
      if (q.includes('竞争') || q.includes('优势') || q.includes('核心') || q.includes('护城河')) {
        return `🏆 ${stockName}的核心竞争力：\n\n${aiKnowledge.basicInfo}\n\n这些优势让${stockName}在行业中保持领先地位。`;
      }
      
      if (q.includes('前景') || q.includes('未来') || q.includes('发展') || q.includes('趋势')) {
        return `🔮 ${stockName}的发展前景：\n\n${aiKnowledge.basicInfo}\n\n${aiKnowledge.investmentAdvice}\n\n📈 长期来看，行业发展趋势是关键！`;
      }
      
      if (q.includes('新手') || q.includes('小白') || q.includes('入门') || q.includes('怎么看')) {
        return `📚 给新手的${stockName}分析指南：\n\n**1. 先了解公司基本面**\n${aiKnowledge.basicInfo}\n\n**2. 关注风险点**\n${aiKnowledge.riskWarning}\n\n**3. 投资建议**\n${aiKnowledge.investmentAdvice}\n\n💪 建议先用模拟盘练练手，熟悉后再实盘操作！`;
      }
      
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
            placeholder={isGeneral ? '问问投资相关的问题...' : `问问关于${stockName}的问题...`}
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

