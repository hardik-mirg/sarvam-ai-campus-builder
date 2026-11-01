import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SarvamAIClient } from 'sarvamai';
import fs from 'fs';

// Load .env
if (fs.existsSync('.env')) {
  process.loadEnvFile();
}

const sarvamApiKey = process.env.SARVAM_API_KEY || '';
const sarvamClient = sarvamApiKey ? new SarvamAIClient({ apiSubscriptionKey: sarvamApiKey }) : null;

function sarvamApiPlugin() {
  return {
    name: 'sarvam-live-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/sarvam-live/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-subscription-key');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        if (!sarvamClient) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'SARVAM_API_KEY is not set in .env' }));
        }

        const endpoint = req.url.replace('/api/sarvam-live/', '').split('?')[0];

        let bodyStr = '';
        req.on('data', (chunk: any) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};

            if (endpoint === 'status') {
              return res.end(
                JSON.stringify({
                  status: 'online',
                  hasApiKey: Boolean(sarvamApiKey),
                  models: ['sarvam-105b-conversations', 'bulbul:v1', 'saaras:v1', 'mayura:ocr'],
                })
              );
            }

            if (endpoint === 'chat') {
              const response = await sarvamClient.chat.completions({
                model: 'sarvam-105b-conversations',
                messages: body.messages || [
                  {
                    role: 'system',
                    content:
                      'You are an audit AI for government DBT payouts in India. Return strictly structured JSON for beneficiary receipts.',
                  },
                  { role: 'user', content: body.prompt || 'Extract receipt fields.' },
                ],
                max_tokens: body.max_tokens || 800,
                temperature: body.temperature || 0.1,
              });
              return res.end(JSON.stringify(response));
            }

            if (endpoint === 'tts') {
              const response = await sarvamClient.textToSpeech.convert({
                text: body.text || 'नमस्ते, यह सर्वम एआई का प्रत्यक्ष ऑडियो है।',
                language_code: body.language_code || 'hi-IN',
              });
              return res.end(JSON.stringify(response));
            }

            if (endpoint === 'translate') {
              const response = await sarvamClient.text.translate({
                input: body.input || body.text,
                source_language_code: body.source_language_code || 'hi-IN',
                target_language_code: body.target_language_code || 'en-IN',
              });
              return res.end(JSON.stringify(response));
            }

            res.statusCode = 404;
            return res.end(JSON.stringify({ error: `Unknown endpoint: ${endpoint}` }));
          } catch (err: any) {
            console.error('Sarvam API call error:', err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Sarvam API call failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), sarvamApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
