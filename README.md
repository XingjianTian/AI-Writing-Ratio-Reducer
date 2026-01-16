# AI Writing Ratio Reducer

A specialized tool to reduce AI writing detection scores through advanced LLM rewriting and back-translation logic.

## Features
- **Stream Mode Rewriting**: Real-time feedback using Gemini 3 Pro Preview.
- **Back-Translation**: Multi-stage humanization using Baidu Translation API (English <-> Chinese).
- **Live Metrics**: Real-time word and character counting with API limit warnings.

## Configuration
Before running, set up the following:
1. **Gemini API**: Add `GOOGLE_API_KEY` to `.env`.
2. **Baidu API**: Add `APP_ID` and `SECRET_KEY` to `BaiduTranslationApiKey.txt`.
3. **Prompt**: Customize your system prompt in `GeminiPrompt.txt`.

## How to Run
1. Install [Bun](https://bun.sh/).
2. `bun install`
3. `bun src/server.ts`
4. Open `http://localhost:3000`.
