import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const readConfigFile = (filename: string): string => {
  try {
    const filePath = path.join(process.cwd(), filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8').trim();
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
  return '';
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

const baiduTranslate = async (query: string, from: string, to: string) => {
  const baiduConfig = readConfigFile('BaiduTranslationApiKey.txt');
  const configLines = baiduConfig.split('\n');
  let appId = '';
  let secretKey = '';
  configLines.forEach(line => {
    if (line.startsWith('APP_ID=')) appId = line.split('=')[1] || '';
    if (line.startsWith('SECRET_KEY=')) secretKey = line.split('=')[1] || '';
  });

  if (!appId || !secretKey) {
    throw new Error('Baidu API credentials missing or malformed');
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
app.get('/api/rewrite-stream', async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).send('No text provided');

  // Try reading from .env first, fallback to file
  const promptBase = process.env.GEMINI_PROMPT_BASE || readConfigFile('GeminiPrompt.txt');
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

app.post('/api/translate-zh', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) throw new Error('No text provided');
    const result = await baiduTranslate(text, 'en', 'zh');
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error with Baidu Translation' });
  }
});

app.post('/api/translate-en', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) throw new Error('No text provided');
    const result = await baiduTranslate(text, 'zh', 'en');
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error with Baidu Translation' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
