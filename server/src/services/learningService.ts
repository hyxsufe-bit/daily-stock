import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface LearningTask {
  id: string;
  type: 'choice' | 'puzzle' | 'fill' | 'reading';
  title: string;
  content: any;
  points: number;
  completed: boolean;
  score?: number;
}

interface LearningSession {
  id: string;
  userId: string;
  stockCode: string;
  startTime: string;
  endTime?: string;
  progress: number;
  totalScore: number;
  tasks: LearningTask[];
  achievements: string[];
  completed: boolean;
}

export class LearningService {
  private dataPath: string;

  constructor() {
    this.dataPath = join(__dirname, '../../data/learning.json');
  }

  private generateTasks(stockCode: string): LearningTask[] {
    // 根据股票代码生成学习任务
    return [
      {
        id: 'task-1',
        type: 'reading',
        title: '了解公司基本情况',
        content: {
          section: 'basicInfo',
          description: '阅读公司基本信息，了解其成立时间、总部位置、主营业务等。'
        },
        points: 10,
        completed: false
      },
      {
        id: 'task-2',
        type: 'choice',
        title: '公司基本情况测试',
        content: {
          question: '这家公司的主要业务是什么？',
          options: ['选项A', '选项B', '选项C', '选项D'],
          correctAnswer: 0
        },
        points: 20,
        completed: false
      },
      {
        id: 'task-3',
        type: 'reading',
        title: '了解公司经营情况',
        content: {
          section: 'financials',
          description: '学习公司的财务数据，包括营收、利润、增长率等关键指标。'
        },
        points: 10,
        completed: false
      },
      {
        id: 'task-4',
        type: 'puzzle',
        title: '财务数据拼图',
        content: {
          pieces: ['营收', '利润', 'ROE', '增长率'],
          description: '将财务指标与其数值进行匹配'
        },
        points: 25,
        completed: false
      },
      {
        id: 'task-5',
        type: 'reading',
        title: '了解公司估值情况',
        content: {
          section: 'valuation',
          description: '学习公司的估值指标和分析。'
        },
        points: 10,
        completed: false
      },
      {
        id: 'task-6',
        type: 'choice',
        title: '估值分析测试',
        content: {
          question: '当前估值水平如何？',
          options: ['高估', '合理', '低估', '无法判断'],
          correctAnswer: 1
        },
        points: 20,
        completed: false
      },
      {
        id: 'task-7',
        type: 'reading',
        title: '了解为什么热门',
        content: {
          section: 'whyHot',
          description: '了解该股票近期受到关注的原因。'
        },
        points: 10,
        completed: false
      },
      {
        id: 'task-8',
        type: 'reading',
        title: '未来分析',
        content: {
          section: 'futureAnalysis',
          description: '学习对该股票未来发展的分析。'
        },
        points: 10,
        completed: false
      }
    ];
  }

  async startLearning(userId: string, stockCode: string): Promise<LearningSession> {
    const session: LearningSession = {
      id: `session-${Date.now()}`,
      userId,
      stockCode,
      startTime: new Date().toISOString(),
      progress: 0,
      totalScore: 0,
      tasks: this.generateTasks(stockCode),
      achievements: [],
      completed: false
    };

    this.saveSession(session);
    return session;
  }

  async getProgress(sessionId: string): Promise<LearningSession | null> {
    const sessions = this.loadSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  async completeTask(sessionId: string, taskType: string, taskId: string, score: number): Promise<LearningSession> {
    const sessions = this.loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('学习会话不存在');
    }

    const task = session.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      task.score = score;
      session.totalScore += score;
    }

    // 更新进度
    const completedTasks = session.tasks.filter(t => t.completed).length;
    session.progress = Math.round((completedTasks / session.tasks.length) * 100);

    this.saveSessions(sessions);
    return session;
  }

  async completeLearning(sessionId: string): Promise<LearningSession> {
    const sessions = this.loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('学习会话不存在');
    }

    session.completed = true;
    session.endTime = new Date().toISOString();

    // 根据得分和表现给予成就
    const achievements: string[] = [];
    if (session.totalScore >= 100) {
      achievements.push('学习之星');
    }
    if (session.totalScore >= 80) {
      achievements.push('优秀学员');
    }
    if (session.progress === 100) {
      achievements.push('完美完成');
    }
    if (session.tasks.filter(t => t.score && t.score > 0).length === session.tasks.length) {
      achievements.push('全对达人');
    }

    session.achievements = achievements;
    this.saveSessions(sessions);
    return session;
  }

  private loadSessions(): LearningSession[] {
    if (!existsSync(this.dataPath)) {
      return [];
    }
    const data = readFileSync(this.dataPath, 'utf-8');
    return JSON.parse(data);
  }

  private saveSession(session: LearningSession) {
    const sessions = this.loadSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  }

  private saveSessions(sessions: LearningSession[]) {
    const dir = join(__dirname, '../../data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.dataPath, JSON.stringify(sessions, null, 2), 'utf-8');
  }
}

