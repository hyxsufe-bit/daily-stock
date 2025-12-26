import { useState } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import './AIAssistant.css';

interface AIAssistantProps {
  stockCode: string;
  stockName: string;
  onClose: () => void;
}

interface Message {
  type: 'user' | 'ai';
  content: string;
}

function AIAssistant({ stockCode, stockName, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: `你好！我是AI助手，可以帮你解答关于${stockName}(${stockCode})的任何问题。`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/ask', {
        question: input,
        stockCode,
        context: {}
      });

      if (response.data.success) {
        const aiMessage: Message = {
          type: 'ai',
          content: response.data.data.answer
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI回答失败:', error);
      const errorMessage: Message = {
        type: 'ai',
        content: '抱歉，我暂时无法回答这个问题，请稍后再试。'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>AI助手</h3>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="ai-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message ai">
            <div className="message-content">思考中...</div>
          </div>
        )}
      </div>

      <div className="ai-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题..."
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;

