# AI Daily

一个适合部署到 GitHub Pages 的静态 AI 新闻站点。

## 现在的结构

```text
.
|- _config.yml
|- _layouts/
|- _posts/
|- assets/
|  |- css/styles.css
|  `- js/app.js
`- .github/workflows/jekyll.yml
```

## 内容怎么维护

每天新增一篇 Markdown 到 `_posts/`，文件名用 Jekyll 规范：

```text
_posts/YYYY-MM-DD-你的标题.md
```

示例：

```text
_posts/2026-03-14-open-source-ai-roundup.md
```

建议每篇文件都带这些 front matter：

```md
---
layout: post
title: 2026-03-14 AI Daily
summary: 这里写当天摘要，首页会直接展示这段。
tags:
  - OpenAI
  - Agent
  - Open Source
---
```

后面的正文就正常写 Markdown。首页会自动把所有文章按日期倒序列出来。

## GitHub Pages 正确配置（重点）

### 1) `_config.yml` 怎么配

**Project Pages（你的仓库名是 `AIDaily`）**：

```yml
url: ""
baseurl: "/AIDaily"
```

> `url` 留空不影响资源路径，关键是 `baseurl` 必须和仓库名一致。

**User/Org Pages（仓库名是 `your-username.github.io`）**：

```yml
url: ""
baseurl: ""
```

---

### 2) `.github/workflows/jekyll.yml` 怎么配

仓库里已经给了可直接用的标准配置：

```yml
name: Deploy GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 3) 仓库 Settings 要对应

1. 进入 `Settings > Pages`
2. `Build and deployment` 选择 `GitHub Actions`
3. 推送后到 `Actions` 确认工作流成功
4. 访问地址：`https://your-username.github.io/AIDaily/`

## 常见问题：为什么只有基础 HTML

最常见原因是：页面 HTML 出来了，但 CSS/JS 请求 404（路径少了 `/AIDaily` 前缀）。

你可以打开浏览器开发者工具 `Network` 看：
- 错误示例：`/assets/css/styles.css`（Project Pages 下会 404）
- 正确示例：`/AIDaily/assets/css/styles.css`

## 本地预览

当前仓库已经带了 Windows 启动脚本，推荐直接运行：

```powershell
.\serve-local.cmd
```

或者：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

脚本会自动：

- 补上 Ruby 路径
- 注入 Windows DNS 补丁
- 读取系统代理配置
- 缺依赖时自动执行 `bundle install`
- 启动本地 Jekyll 服务

启动后访问：

```text
http://127.0.0.1:4000/
```

如果本机环境已经完整，也可以手动执行：

```bash
bundle install
bundle exec jekyll serve
```

然后访问 `http://127.0.0.1:4000/`。

## 按你 GitHub 用户名一键替换后的最终 `_config.yml` + 访问 URL 对照表

假设：
- GitHub 用户名：`octocat`
- 仓库名：`AIDaily`

你可以一键替换 `_config.yml`（Project Pages）：

```bash
GITHUB_USER="octocat"
REPO_NAME="AIDaily"
python - <<'PYCODE'
from pathlib import Path
import os, re

p = Path('_config.yml')
t = p.read_text(encoding='utf-8')

user = os.environ['GITHUB_USER']
repo = os.environ['REPO_NAME']

t = re.sub(r'^url:\s*.*$', f'url: "https://{user}.github.io"', t, flags=re.M)
t = re.sub(r'^baseurl:\s*.*$', f'baseurl: "/{repo}"', t, flags=re.M)

p.write_text(t, encoding='utf-8')
print('updated _config.yml')
PYCODE
```

替换后的最终配置（示例）应为：

```yml
url: "https://octocat.github.io"
baseurl: "/AIDaily"
```

| 部署类型 | `_config.yml` 配置 | 首页 URL | 静态资源 URL 示例 |
|---|---|---|---|
| Project Pages（仓库 `AIDaily`） | `url: "https://<用户名>.github.io"` + `baseurl: "/AIDaily"` | `https://<用户名>.github.io/AIDaily/` | `https://<用户名>.github.io/AIDaily/assets/css/styles.css` |
| User/Org Pages（仓库 `<用户名>.github.io`） | `url: "https://<用户名>.github.io"` + `baseurl: ""` | `https://<用户名>.github.io/` | `https://<用户名>.github.io/assets/css/styles.css` |
