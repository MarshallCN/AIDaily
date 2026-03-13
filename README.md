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
`- .github/workflows/deploy.yml
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

## 部署到 GitHub Pages

1. 把这个目录初始化成 git 仓库并推到 GitHub。
2. 打开仓库 `Settings > Pages`。
3. `Build and deployment` 里选择 `GitHub Actions`。
4. 推送到 `main` 或 `master` 分支后，工作流会自动构建并发布。

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
