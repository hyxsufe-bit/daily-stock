// API 配置
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export const api = {
  stocks: {
    today: () => `${API_BASE_URL}/api/stocks/today`,
    detail: (code: string) => `${API_BASE_URL}/api/stocks/${code}`,
    userData: () => `${API_BASE_URL}/api/stocks/user-data`,
  }
};

