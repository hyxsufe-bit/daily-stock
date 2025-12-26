#!/bin/bash

# AI每日一股 - 自动安装脚本

echo "🚀 AI每日一股 - 项目设置脚本"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "1. 访问 https://nodejs.org/ 下载安装"
    echo "2. 或使用 Homebrew: brew install node"
    echo ""
    echo "安装完成后，请重新运行此脚本"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 安装依赖
echo "📦 开始安装依赖..."
echo ""

echo "1. 安装根目录依赖..."
npm install

echo ""
echo "2. 安装服务器依赖..."
cd server
npm install
cd ..

echo ""
echo "3. 安装客户端依赖..."
cd client
npm install
cd ..

echo ""
echo "✅ 所有依赖安装完成！"
echo ""
echo "🎉 现在可以运行项目了："
echo "   npm run dev"
echo ""

