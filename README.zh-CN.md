# AI Writing Ratio Reducer · 中文版

[English (primary)](README.md) · **简体中文（次要版本）**

基于大模型改写及英中回译的文本处理工具，提供流式输出和字数统计。项目以降低 AI 写作检测分数为目标；本简介不保证任何检测器的结果。

## 主要功能

- **Gemini 1.5 Flash 流式改写**：实时展示改写输出。
- **回译流程**：通过百度翻译 API 进行英语与中文之间的多阶段处理。
- **Vercel 部署**：使用 Serverless Functions 与路由配置。
- **实时统计**：展示单词数与字符数。

## 部署与配置

在 Vercel Dashboard 或本地 `.env` 文件中设置：

| 变量 | 用途 |
| --- | --- |
| `GOOGLE_API_KEY` | Google Gemini API 密钥 |
| `BAIDU_APP_ID` | 百度翻译应用 ID |
| `BAIDU_SECRET_KEY` | 百度翻译密钥 |
| `GEMINI_PROMPT_BASE` | 改写任务的基础系统提示词 |

### Vercel

将项目连接到 Vercel，或使用 Vercel CLI：

```bash
vercel --prod
```

### 本地开发

1. 安装 [Bun](https://bun.sh/)。
2. 运行 `bun install`。
3. 创建 `.env` 并填入所需变量。
4. 运行 `bun dev`。
5. 打开 `http://localhost:3000`。

## 技术栈

- 后端：Bun、Express、TypeScript。
- 前端：Tailwind CSS、原生 JavaScript。
- 基础设施：Vercel Serverless Functions。
- 外部 API：Google Gemini、百度翻译。
