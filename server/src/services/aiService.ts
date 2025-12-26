import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    // 如果配置了OpenAI API Key，则初始化
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async askQuestion(question: string, stockCode?: string, context?: any): Promise<string> {
    // 如果没有配置OpenAI，返回模拟回答
    if (!this.openai) {
      return this.getMockAnswer(question, stockCode);
    }

    try {
      const systemPrompt = stockCode 
        ? `你是一位专业的股票分析师，正在帮助用户学习股票代码为${stockCode}的公司。请用简洁、易懂的方式回答问题。`
        : '你是一位专业的股票分析师，请用简洁、易懂的方式回答用户关于股票的问题。';

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';
    } catch (error) {
      console.error('OpenAI API错误:', error);
      return this.getMockAnswer(question, stockCode);
    }
  }

  private getMockAnswer(question: string, stockCode?: string): string {
    // 模拟AI回答（实际项目中应该使用真实的AI API）
    const mockAnswers: Record<string, string> = {
      '什么是PE': 'PE（市盈率）是股价与每股收益的比值，用来衡量股票的估值水平。PE越低，通常表示股票越便宜。',
      '什么是PB': 'PB（市净率）是股价与每股净资产的比值，PB小于1表示股价低于净资产，可能被低估。',
      '什么是ROE': 'ROE（净资产收益率）反映公司使用股东资金创造利润的能力，ROE越高说明公司盈利能力越强。',
      '为什么这只股票会涨': '股票价格上涨通常受到多种因素影响，包括公司业绩改善、行业景气度提升、市场情绪好转等。',
    };

    const lowerQuestion = question.toLowerCase();
    for (const [key, answer] of Object.entries(mockAnswers)) {
      if (lowerQuestion.includes(key.toLowerCase())) {
        return answer;
      }
    }

    return `关于"${question}"这个问题，我需要更多信息来给出准确回答。${stockCode ? `针对股票${stockCode}，` : ''}建议您查看公司的财务报告、行业分析报告等资料，或者向我提出更具体的问题。`;
  }
}

