# AI Writing Ratio Reducer

A specialized tool to reduce AI writing detection scores through advanced LLM rewriting and back-translation logic. Designed for easy deployment on Vercel or other cloud platforms.

## Features
- **Stream Mode Rewriting**: Real-time feedback using Gemini 3 Pro Preview.
- **Back-Translation**: Multi-stage humanization using Baidu Translation API (English <-> Chinese).
- **Live Metrics**: Real-time word and character counting with API limit warnings.

## Deployment & Configuration
This project is configured to use environment variables for all secrets.

### Required Environment Variables
Set these in your Vercel Dashboard or `.env` file:

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Your Google Gemini API Key |
| `BAIDU_APP_ID` | Your Baidu Translation App ID |
| `BAIDU_SECRET_KEY` | Your Baidu Translation Secret Key |
| `GEMINI_PROMPT_BASE` | The system prompt base for the rewriting task |

### Local Development
1. Install [Bun](https://bun.sh/).
2. `bun install`
3. Create a `.env` file with the variables above.
4. `bun src/server.ts`
5. Open `http://localhost:3000`.

## Technologies
- Backend: Bun, Express, TypeScript
- Frontend: Tailwind CSS, Vanilla JS
- APIs: Google Gemini API, Baidu Translation API
