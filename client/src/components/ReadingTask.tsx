import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import './ReadingTask.css';

interface ReadingTaskProps {
  task: any;
  stock: any;
  onComplete: (score: number) => void;
}

function ReadingTask({ task, stock, onComplete }: ReadingTaskProps) {
  const [completed, setCompleted] = useState(false);
  const [readTime, setReadTime] = useState(0);

  const getContent = () => {
    const section = task.content.section;
    switch (section) {
      case 'basicInfo':
        return {
          title: '公司基本情况',
          data: stock.basicInfo
        };
      case 'financials':
        return {
          title: '公司经营情况',
          data: stock.financials
        };
      case 'valuation':
        return {
          title: '公司估值情况',
          data: stock.valuation
        };
      case 'whyHot':
        return {
          title: '为什么热门',
          content: stock.whyHot
        };
      case 'futureAnalysis':
        return {
          title: '后续分析',
          content: stock.futureAnalysis
        };
      default:
        return null;
    }
  };

  const content = getContent();

  const handleMarkComplete = () => {
    if (!completed) {
      setCompleted(true);
      // 根据阅读时间给予分数（至少10秒阅读）
      const score = readTime >= 10 ? task.points : Math.floor(task.points * 0.5);
      onComplete(score);
    }
  };

  // 模拟阅读时间追踪
  useEffect(() => {
    if (!completed) {
      const interval = setInterval(() => {
        setReadTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  if (!content) {
    return <div>内容加载中...</div>;
  }

  return (
    <div className="reading-task">
      <h2>{content.title}</h2>
      <p className="task-description">{task.content.description}</p>

      <div className="reading-content">
        {content.data ? (
          <div className="data-grid">
            {Object.entries(content.data).map(([key, value]) => (
              <div key={key} className="data-item">
                <span className="data-label">{key}:</span>
                <span className="data-value">{String(value)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-content">
            <p>{content.content}</p>
          </div>
        )}
      </div>

      <div className="reading-footer">
        <span className="read-time">阅读时间: {readTime}秒</span>
        {!completed && (
          <button className="btn btn-primary" onClick={handleMarkComplete}>
            我已阅读完成
          </button>
        )}
        {completed && (
          <div className="completed-badge">
            <CheckCircle size={20} /> 已完成
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingTask;

