import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory using an absolute path
// In Vercel, process.cwd() is usually the root of the project
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
// Use a more standard model name if 1.5-pro fails, but pro is generally safe
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const baiduTranslate = async (query: string, from: string, to: string) => {
  const appId = process.env.BAIDU_APP_ID;
  const secretKey = process.env.BAIDU_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error('Baidu API credentials missing in environment variables');
  }

  const salt = Date.now().toString();
  const sign = crypto.createHash('md5').update(appId + query + salt + secretKey).digest('hex');
  const response = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
    params: { q: query, from, to, appid: appId, salt, sign }
  });
  
  if (response.data.error_code) {
    throw new Error(`Baidu API Error: ${response.data.error_msg}`);
  }
  
  if (!response.data.trans_result || response.data.trans_result.length === 0) {
    throw new Error('Baidu API returned no translation results');
  }

  return response.data.trans_result.map((item: any) => item.dst).join('\n');
};

// Gemini Stream Endpoint
app.get('/api/rewrite-stream', async (req: any, res: any) => {
  const { text } = req.query;
  if (!text) return res.status(400).send('No text provided');

  const promptBase = process.env.GEMINI_PROMPT_BASE || '';
  const fullPrompt = promptBase + text;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const result = await model.generateContentStream(fullPrompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

app.post('/api/translate-zh', async (req: any, res: any) => {
  try {
    const { text } = req.body;
    if (!text) throw new Error('No text provided');
    const result = await baiduTranslate(text, 'en', 'zh');
    res.json({ result });
  } catch (error: any) {
    console.error('Translate-zh error:', error);
    res.status(500).json({ error: error.message || 'Error with Baidu Translation' });
  }
});

app.post('/api/translate-en', async (req: any, res: any) => {
  try {
    const { text } = req.body;
    if (!text) throw new Error('No text provided');
    const result = await baiduTranslate(text, 'zh', 'en');
    res.json({ result });
  } catch (error: any) {
    console.error('Translate-en error:', error);
    res.status(500).json({ error: error.message || 'Error with Baidu Translation' });
  }
});

// Root path handler
app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Fallback - ONLY for non-API routes
app.get(/^(?!\/api).+/, (req: any, res: any) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
