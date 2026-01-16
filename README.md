# AI Writing Ratio Reducer

A 3-stage tool to reduce AI writing detection through LLM rewriting and back-translation.

## Features
- **Stage 1**: Input original AI-generated text.
- **Stage 2**: Rewrite using Google Gemini 1.5 Flash.
- **Stage 3**: Humanize using Baidu Back-translation (English -> Chinese -> English).

## Prerequisites
- [Bun](https://bun.sh/) runtime installed.
- Google Gemini API Key.
- Baidu Translation API App ID and Secret Key.

## Configuration
1. **Gemini**: Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
2. **Gemini Prompt**: Edit `GeminiPrompt.txt` to set the system instructions for rewriting.
3. **Baidu**: Edit `BaiduTranslationApiKey.txt` with your credentials:
   ```text
   APP_ID=your_baidu_app_id
   SECRET_KEY=your_baidu_secret_key
   ```

## Setup & Running
1. Install dependencies:
   ```bash
   bun install
   ```
2. Start the server:
   ```bash
   bun src/server.ts
   ```
3. Access the web UI at `http://localhost:3000` (or `http://<wsl-ip>:3000` from Windows).

## Technologies
- **Backend**: Express.js, TypeScript, Bun.
- **Frontend**: Tailwind CSS, Vanilla JS.
- **APIs**: Google Generative AI, Baidu Translation API.
