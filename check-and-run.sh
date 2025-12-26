#!/bin/bash

# AI每日一股 - 检查环境并运行

# 加载 nvm 环境（如果存在）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

echo "🔍 检查运行环境..."
echo ""

# 检查 Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo "✅ Node.js: $NODE_VERSION"
    echo "✅ npm: $NPM_VERSION"
    echo ""
    
    # 检查依赖是否已安装
    if [ ! -d "node_modules" ]; then
        echo "📦 检测到依赖未安装，开始安装..."
        echo ""
        ./setup.sh
    fi
    
    if [ ! -d "server/node_modules" ]; then
        echo "📦 安装服务器依赖..."
        cd server && npm install && cd ..
    fi
    
    if [ ! -d "client/node_modules" ]; then
        echo "📦 安装客户端依赖..."
        cd client && npm install && cd ..
    fi
    
    echo ""
    echo "🚀 启动项目..."
    echo "前端: http://localhost:3000"
    echo "后端: http://localhost:3001"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 启动项目
    npm run dev
    
else
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "═══════════════════════════════════════"
    echo "   需要先安装 Node.js"
    echo "═══════════════════════════════════════"
    echo ""
    echo "📥 安装方式："
    echo ""
    echo "方式1: 官方安装包（最简单）"
    echo "  1. 访问: https://nodejs.org/"
    echo "  2. 下载 LTS 版本（推荐）"
    echo "  3. 运行安装包"
    echo ""
    echo "方式2: 使用 Homebrew"
    echo "  如果已安装 Homebrew，运行:"
    echo "  brew install node"
    echo ""
    echo "方式3: 使用 nvm（Node版本管理器）"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  nvm install --lts"
    echo ""
    echo "安装完成后，运行: ./check-and-run.sh"
    echo ""
    exit 1
fi

