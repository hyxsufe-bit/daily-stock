#!/bin/bash

# 加载 nvm 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 切换到项目目录
cd /Users/westhu/cursor

# 执行传入的命令
"$@"





