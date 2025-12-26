import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './ChoiceQuestion.css';

interface ChoiceQuestionProps {
  task: any;
  onComplete: (score: number) => void;
}

function ChoiceQuestion({ task, onComplete }: ChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === task.content.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // 根据是否正确给予分数
    const score = correct ? task.points : Math.floor(task.points * 0.3);
    setTimeout(() => {
      onComplete(score);
    }, 1000);
  };

  return (
    <div className="choice-question">
      <h2>{task.title}</h2>
      <div className="question-content">
        <p className="question-text">{task.content.question}</p>
        <div className="options">
          {task.content.options.map((option: string, index: number) => (
            <div
              key={index}
              className={`option ${selectedAnswer === index ? 'selected' : ''} ${
                showResult
                  ? index === task.content.correctAnswer
                    ? 'correct'
                    : selectedAnswer === index && !isCorrect
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              onClick={() => handleSelect(index)}
            >
              <span className="option-label">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showResult && index === task.content.correctAnswer && (
                <CheckCircle className="result-icon" size={20} />
              )}
              {showResult && selectedAnswer === index && !isCorrect && (
                <XCircle className="result-icon" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>

      {showResult && (
        <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '🎉 回答正确！' : '❌ 回答错误，正确答案已标记'}
        </div>
      )}

      {!showResult && (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        >
          提交答案
        </button>
      )}
    </div>
  );
}

export default ChoiceQuestion;

