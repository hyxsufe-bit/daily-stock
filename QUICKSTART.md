# 快速开始指南

## 安装步骤

1. **安装所有依赖**
```bash
npm run install:all
```

2. **（可选）配置AI功能**
在 `server` 目录下创建 `.env` 文件：
```env
OPENAI_API_KEY=your_api_key_here
```
如果不配置，系统会使用模拟回答。

3. **启动开发服务器**
```bash
npm run dev
```

这将同时启动：
- 后端服务器：http://localhost:3001
- 前端应用：http://localhost:3000

## 使用流程

1. 打开浏览器访问 http://localhost:3000
2. 在首页浏览今日推荐的股票
3. 点击"开始学习"进入学习页面
4. 完成各种学习任务（阅读、选择题、拼图等）
5. 使用AI助手提问
6. 完成学习后参与猜涨跌游戏

## 常见问题

**Q: 端口被占用怎么办？**
A: 可以在 `server/.env` 中修改 `PORT`，或在 `client/vite.config.ts` 中修改前端端口。

**Q: AI功能不工作？**
A: 检查是否配置了 `OPENAI_API_KEY`，如果没有配置，系统会使用模拟回答。

**Q: 数据存储在哪里？**
A: 数据存储在 `server/data/` 目录下的JSON文件中。

