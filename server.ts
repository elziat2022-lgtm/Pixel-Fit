import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// Comprehensive AI Chat & Coach endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, imageBase64, userContext } = req.body;

    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        fallback: true,
      });
    }

    const userName = userContext?.userName?.trim() || 'يا بطل';
    const lang = userContext?.language || 'ar';
    const isEn = lang === 'en';

    const contextPrompt = userContext
      ? `User Profile:
- Name: ${userName}
- Daily Targets: ${userContext.dailyTarget?.cal || 2000} kcal | ${userContext.dailyTarget?.pro || 150}g protein | ${userContext.dailyTarget?.carb || 200}g carbs | ${userContext.dailyTarget?.fat || 65}g fats.
- Current Weight: ${userContext.currentWeight || 80} kg | Optimal Target Weight: ${userContext.optimalTargetWeight || 75} kg.
- Consumed Today: ${userContext.consumedToday?.cal || 0} kcal & ${userContext.consumedToday?.pro || 0}g protein.`
      : '';

    const systemInstruction = isEn
      ? `You are PIXEL FIT AI, a smart personal fitness coach, nutritionist, and supportive workout partner.
Always address the user warmly by their name (${userName}).
You are knowledgeable in all fitness domains: bodybuilding, gym routines, home workouts, cardio, hydration, sleep hygiene, muscle recovery, supplements (creatine, whey protein, vitamins), and calorie tracking.
${contextPrompt}

If the user describes a meal or provides an image of food:
1. Estimate the ingredients, portions, calories, protein, carbs, and fat accurately.
2. Provide brief, friendly advice tailored to their daily progress.
3. At the very end of your response, ALWAYS append this exact hidden JSON line so they can add it to their log with one click:
MEAL_JSON:{"title":"Short meal name","cal":000,"pro":00,"carb":00,"fat":00}

If the user asks general questions (workout plans, advice, motivation, lifestyle, life coaching), respond with encouraging, expert advice without appending MEAL_JSON.`
      : `أنت PIXEL FIT AI، كابتن التغذية واللياقة البدنية والمدرب الشخصي الذكي والصديق المحفز.
تحدث مع المستخدم دائماً بأسلوب ودي وحماسي وناديه باسمه دائماً (${userName}).
أنت خبير شامل في كل ما يخص الرياضة والصحة: تمارين الجيم، جداول التمارين (Push/Pull/Legs، تضخيم، تنشيف، تمارين منزلية، كارديو)، الاستشفاء، النوم الصحي، المكملات الغذائية (كرياتين، بروتين، أوميجا 3)، ونصائح الحياة اليومية، بالإضافة لموسوعة الأكل المصري وحساب السعرات.
${contextPrompt}

إذا وصف المستخدم وجبة تناولها أو أرفق صورة طبق:
1. قم بتقدير المكونات والحصص والسعرات والماكروز (بروتين، كارب، دهون) بدقة.
2. قدم نصيحة سريعة ملهمة تناسب هدفه اليومي.
3. في نهاية الرد تماماً، أضف هذا السطر المخفي بالضبط كـ JSON:
MEAL_JSON:{"title":"اسم مختصر للوجبة","cal":000,"pro":00,"carb":00,"fat":00}

إذا كان سؤالاً تدريبياً، نصيحة عامة، أو محادثة، أجب باحترافية وتشجيع ودون إضافة MEAL_JSON.`;

    const parts: any[] = [];
    if (imageBase64) {
      const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    parts.push({
      text: `${systemInstruction}\n\nUser Message: ${message || 'Please analyze this meal or give me fitness advice'}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
    });

    const replyText = response.text || '';
    let mealData = null;

    const jsonMatch = replyText.match(/MEAL_JSON:(\{.*?\})/);
    let cleanedText = replyText;
    if (jsonMatch) {
      try {
        mealData = JSON.parse(jsonMatch[1]);
        cleanedText = replyText.replace(/MEAL_JSON:\{.*?\}/, '').trim();
      } catch (e) {
        console.error('Failed to parse MEAL_JSON', e);
      }
    }

    return res.json({
      text: cleanedText,
      mealData,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.status(500).json({
      error: error.message || 'Error communicating with Gemini AI',
      fallback: true,
    });
  }
});

// Mount Vite or static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PIXEL FIT v1.1 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
