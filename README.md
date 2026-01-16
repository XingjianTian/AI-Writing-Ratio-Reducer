# AI Writing Ratio Reducer

A specialized tool to reduce AI writing detection scores through advanced LLM rewriting and back-translation logic. Optimized for high-speed streaming and human-like output.

## Key Features

-   **Gemini 1.5 Flash Stream**: Real-time rewriting with high-speed streaming feedback.
-   **Back-Translation Logic**: English <-> Chinese multi-stage humanization using Baidu Translation API.
-   **Vercel Optimized**: Ready-to-deploy serverless architecture with robust routing.
-   **Real-time Metrics**: Word and character counts for precise API management.

## Deployment & Configuration

### Required Environment Variables

Set these in your Vercel Dashboard or local `.env` file:

| Variable | Description |
| :--- | :--- |
| `GOOGLE_API_KEY` | Your Google Gemini API Key |
| `BAIDU_APP_ID` | Your Baidu Translation App ID |
| `BAIDU_SECRET_KEY` | Your Baidu Translation Secret Key |
| `GEMINI_PROMPT_BASE` | The system prompt base for the rewriting task |

### Vercel Deployment

This project is configured for Vercel Serverless Functions. Simply push to GitHub and link your project, or use the Vercel CLI:

```bash
vercel --prod
```

### Local Development

1. Install [Bun](https://bun.sh/).
2. `bun install`
3. Create a `.env` file with the required variables.
4. `bun dev`
5. Open `http://localhost:3000`.

## Tech Stack

-   **Backend**: Bun, Express, TypeScript
-   **Frontend**: Tailwind CSS, Vanilla JS
-   **Infrastructure**: Vercel Serverless Functions
-   **APIs**: Google Gemini AI, Baidu Translation
