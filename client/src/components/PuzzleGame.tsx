import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import './PuzzleGame.css';

interface PuzzleGameProps {
  task: any;
  stock: any;
  onComplete: (score: number) => void;
}

function PuzzleGame({ task, stock, onComplete }: PuzzleGameProps) {
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // 生成拼图数据（财务指标匹配）
  const getPuzzleData = () => {
    const financials = stock.financials;
    return {
      labels: ['营收', '利润', 'ROE', '增长率'],
      values: [
        `${financials.revenue}亿元`,
        `${financials.profit}亿元`,
        `${financials.roe}%`,
        `${financials.growthRate}%`
      ]
    };
  };

  const puzzleData = getPuzzleData();
  const [availableLabels, setAvailableLabels] = useState([...puzzleData.labels]);
  const [availableValues, setAvailableValues] = useState([...puzzleData.values]);

  const handleLabelClick = (label: string) => {
    if (completed) return;
    if (selectedPieces.length === 0) {
      setSelectedPieces([label]);
    }
  };

  const handleValueClick = (value: string) => {
    if (completed || selectedPieces.length === 0) return;

    const label = selectedPieces[0];
    const labelIndex = puzzleData.labels.indexOf(label);
    const correctValue = puzzleData.values[labelIndex];

    if (value === correctValue) {
      // 匹配正确
      const newLabels = availableLabels.filter(l => l !== label);
      const newValues = availableValues.filter(v => v !== value);
      
      setAvailableLabels(newLabels);
      setAvailableValues(newValues);
      
      if (newLabels.length === 0) {
        // 全部匹配完成
        setCompleted(true);
        onComplete(task.points);
      } else {
        setSelectedPieces([]);
      }
    } else {
      // 匹配错误，重置选择
      setSelectedPieces([]);
    }
  };

  return (
    <div className="puzzle-game">
      <h2>{task.title}</h2>
      <p className="task-description">{task.content.description}</p>

      <div className="puzzle-container">
        <div className="puzzle-section">
          <h3>财务指标</h3>
          <div className="puzzle-pieces">
            {availableLabels.map((label, index) => (
              <div
                key={index}
                className={`puzzle-piece label ${selectedPieces.includes(label) ? 'selected' : ''}`}
                onClick={() => handleLabelClick(label)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="puzzle-section">
          <h3>数值</h3>
          <div className="puzzle-pieces">
            {availableValues.map((value, index) => (
              <div
                key={index}
                className="puzzle-piece value"
                onClick={() => handleValueClick(value)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPieces.length > 0 && (
        <div className="instruction">
          已选择: {selectedPieces[0]}，请点击对应的数值进行匹配
        </div>
      )}

      {completed && (
        <div className="completion-message">
          <CheckCircle size={32} />
          <p>🎉 拼图完成！所有指标匹配正确！</p>
        </div>
      )}
    </div>
  );
}

export default PuzzleGame;

