#!/bin/bash

# Node.js 自动安装助手

echo "🔧 Node.js 安装助手"
echo "═══════════════════════════════════════"
echo ""

# 检查是否已安装
if command -v node &> /dev/null; then
    echo "✅ Node.js 已安装: $(node --version)"
    echo "✅ npm 已安装: $(npm --version)"
    exit 0
fi

echo "📥 尝试安装 Node.js..."
echo ""

# 方法1: 尝试使用 nvm 安装
echo "方法1: 尝试安装 nvm (Node Version Manager)..."
if [ ! -d "$HOME/.nvm" ]; then
    echo "正在安装 nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # 加载 nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    if command -v nvm &> /dev/null || [ -s "$NVM_DIR/nvm.sh" ]; then
        echo "✅ nvm 安装成功"
        echo "正在安装 Node.js LTS 版本..."
        source "$NVM_DIR/nvm.sh"
        nvm install --lts
        nvm use --lts
        nvm alias default node
        
        if command -v node &> /dev/null; then
            echo ""
            echo "✅ Node.js 安装成功！"
            echo "   版本: $(node --version)"
            echo "   npm: $(npm --version)"
            echo ""
            echo "⚠️  注意: 请重新打开终端，或运行以下命令使 nvm 生效："
            echo "   source ~/.nvm/nvm.sh"
            echo ""
            exit 0
        fi
    else
        echo "❌ nvm 安装失败"
    fi
else
    echo "✅ nvm 已存在，尝试使用 nvm 安装 Node.js..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
    
    if command -v node &> /dev/null; then
        echo "✅ Node.js 安装成功！"
        exit 0
    fi
fi

echo ""
echo "═══════════════════════════════════════"
echo "自动安装未成功，请手动安装 Node.js"
echo "═══════════════════════════════════════"
echo ""
echo "推荐方式："
echo ""
echo "1. 访问 https://nodejs.org/"
echo "   下载并安装 LTS 版本（推荐）"
echo ""
echo "2. 或安装 Homebrew 后运行:"
echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
echo "   brew install node"
echo ""
echo "安装完成后，运行: ./check-and-run.sh"
echo ""





