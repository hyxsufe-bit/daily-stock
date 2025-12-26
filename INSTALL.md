# 安装和运行指南

## 前置要求

本项目需要 Node.js 环境。如果您的系统还没有安装 Node.js，请先安装。

### 安装 Node.js

#### macOS 系统

**方法1：使用官方安装包（推荐）**
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 v18 或更高版本）
3. 运行安装包，按照提示完成安装

**方法2：使用 Homebrew**
```bash
# 如果还没有安装 Homebrew，先安装它
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node
```

#### 验证安装
安装完成后，在终端运行以下命令验证：
```bash
node --version  # 应该显示 v18.x.x 或更高版本
npm --version   # 应该显示 9.x.x 或更高版本
```

## 安装项目依赖

安装完 Node.js 后，在项目根目录运行：

```bash
# 方法1：使用脚本一键安装所有依赖（推荐）
npm run install:all

# 方法2：分别安装
npm install                    # 安装根目录依赖
cd server && npm install       # 安装服务器依赖
cd ../client && npm install   # 安装客户端依赖
```

## 启动项目

### 方式1：同时启动前后端（推荐）
```bash
npm run dev
```

这将同时启动：
- 后端服务器：http://localhost:3001
- 前端应用：http://localhost:3000

### 方式2：分别启动
```bash
# 终端1：启动后端
npm run dev:server

# 终端2：启动前端
npm run dev:client
```

## 访问应用

启动成功后，在浏览器中打开：
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001/api/health

## 常见问题

### 1. 端口被占用
如果 3000 或 3001 端口被占用，可以：
- 修改 `server/.env` 中的 `PORT` 值
- 修改 `client/vite.config.ts` 中的 `server.port` 值

### 2. 依赖安装失败
- 确保网络连接正常
- 尝试清除缓存：`npm cache clean --force`
- 删除 `node_modules` 和 `package-lock.json` 后重新安装

### 3. 权限问题（macOS/Linux）
如果遇到权限问题，可以使用：
```bash
sudo npm install
```

## 下一步

安装完成后，请查看 [README.md](./README.md) 了解项目功能和使用方法。

