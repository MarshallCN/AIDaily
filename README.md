# AI Daily

一个适合部署到 GitHub Pages 的静态 AI 新闻站点，当前聚焦 `AI Infra`、`AI 应用`、`AI 技术` 和 `行业动态`。

## 内容结构

每天新增一篇 Markdown 到 `_posts/`，文件名遵循 Jekyll 规范：

```text
_posts/YYYY-MM-DD-your-title.md
```

推荐 front matter：

```md
---
layout: post
title: 2026-03-14 AI Daily | 你的标题
summary: 这里写首页摘要。
signals:
  - AI Infra
  - Agent Security
tags:
  - AI 技术
  - OpenAI
  - Prompt Injection
sources:
  - label: OpenAI | Article Title
    url: "https://example.com"
---
```

说明：

- `signals` 用于首页 hero 的关键词，建议 2-3 个，越短越好。
- `tags` 会显示在首页 news 卡片和文章页，建议 4-6 个。
- `sources` 会同时显示在首页 reader 和独立文章页。

## GitHub Pages 配置

当前仓库是 Project Pages 形态，关键配置如下：

```yml
url: ""
baseurl: "/AIDaily"
repository_url: "https://github.com/MarshallCN/AIDaily"
```

只要仓库名仍然是 `AIDaily`，这个 `baseurl` 就应该保持不变。页面模板里所有静态资源都通过 `relative_url` 输出，适合直接部署到 GitHub Pages。

## 本地预览

Windows 推荐直接运行：

```powershell
.\serve-local.cmd
```

或：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

如果你手动运行构建命令，记得带上 DNS 补丁：

```powershell
$env:RUBYOPT='-r./scripts/bundler_dns_patch.rb'
bundle exec jekyll build
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

访问：

```text
http://127.0.0.1:4000/AIDaily/
```

## 发布检查

- `Settings > Pages` 选择 `GitHub Actions`
- 推送后确认 `.github/workflows/jekyll.yml` 构建成功
- 线上地址应为 `https://MarshallCN.github.io/AIDaily/`
- 如果页面只有基础 HTML，优先检查资源路径是否带了 `/AIDaily` 前缀
