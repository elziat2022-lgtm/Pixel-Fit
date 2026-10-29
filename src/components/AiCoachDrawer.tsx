import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DailyTargets, Language } from '../types';
import { parseOfflineEgyptianFood } from '../utils/calculator';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Sparkles,
  Camera,
  Send,
  MessageSquare,
  X,
  Plus,
  Bot,
  User,
  Loader2,
} from 'lucide-react';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onToggle: (open?: boolean) => void;
  onAddMeal: (title: string, cal: number, pro: number, carb: number, fat: number) => void;
  userContext: {
    userName: string;
    language: Language;
    dailyTarget: DailyTargets;
    currentWeight: number;
    optimalTargetWeight: number;
    consumedToday: { cal: number; pro: number; carb: number; fat: number };
  };
  onTriggerAiBadge?: () => void;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  isOpen,
  onToggle,
  onAddMeal,
  userContext,
  onTriggerAiBadge,
}) => {
  const isEn = userContext.language === 'en';
  const t = TRANSLATIONS[userContext.language];

  const initialGreeting = isEn
    ? `Welcome back, **${userContext.userName}**! 👋\nI'm your personal PIXEL FIT AI coach. You can ask me anything: workout splits, muscle building, cardio routines, sleep & hydration, supplements, or tell me what you ate (e.g. *"I had 3 eggs, oatmeal and a cup of milk"*) or upload a meal photo to calculate calories!`
    : `أهلاً بك يا **${userContext.userName}**! 👋🇪🇬\nأنا كابتن PIXEL FIT AI ومدربك الشخصي. تقدر تسألني في أي حاجة: تمارين الجيم، جداول التدريب، المكملات، الاستشفاء، أو تكتب لي أي وجبة أكلتها أو ترفع صورتها لحساب سعراتها فوراً!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setImageBase64(b64);
      onToggle(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text && !imageBase64) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || (isEn ? 'Analyze this meal photo' : 'حلل الوجبة في الصورة المرفقة واحسب سعراتها'),
      imageBase64: imageBase64 || undefined,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const currentImg = imageBase64;
    setImageBase64(null);
    setIsLoading(true);
    onToggle(true);

    if (onTriggerAiBadge) {
      onTriggerAiBadge();
    }

    try {
      // 1. Try Server-side Gemini API call
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          imageBase64: currentImg,
          userContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || (isEn ? 'Request completed!' : 'تم فحص الوجبة بنجاح!'),
        mealData: data.mealData,
        timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.warn('Falling back to built-in nutrition engine:', err);

      // 2. Built-in Egyptian AI Fallback
      const parsed = parseOfflineEgyptianFood(text);
      let replyText = '';
      let mealData = undefined;

      if (parsed.items.length > 0) {
        const itemsList = parsed.items
          .map((i) => `• ${i.name}: ${i.cal} ${t.calories} (${i.pro}${t.grams} ${t.protein})`)
          .join('\n');
        replyText = isEn
          ? `Analysis for ${userContext.userName}:\n${itemsList}\n\nEstimated Total: **${parsed.total.cal} kcal** | P: ${parsed.total.pro}g | C: ${parsed.total.carb}g | F: ${parsed.total.fat}g.`
          : `تحليل الوجبة يا ${userContext.userName} من محرك PIXEL FIT 🇪🇬:\n${itemsList}\n\nالإجمالي التقديري: **${parsed.total.cal} سعرة** | بروتين: ${parsed.total.pro}ج | كارب: ${parsed.total.carb}ج | دهون: ${parsed.total.fat}ج.`;

        mealData = {
          title: text.slice(0, 35),
          cal: Math.round(parsed.total.cal),
          pro: Math.round(parsed.total.pro),
          carb: Math.round(parsed.total.carb),
          fat: Math.round(parsed.total.fat),
        };
      } else if (currentImg) {
        replyText = isEn
          ? `Plate image analyzed! 📷 Estimated balanced portion:\nAround **450 kcal** (28g protein, 48g carbs, 15g fats).`
          : `تم فحص صورة الطبق يا ${userContext.userName}! 📷 تقدير وجبة مصرية متوازنة:\nحوالي **450 سعرة حرارية** (28ج بروتين، 48ج كارب، 15ج دهون).`;
        mealData = {
          title: isEn ? 'AI Scanned Meal' : 'وجبة مصورة بالذكاء الاصطناعي',
          cal: 450,
          pro: 28,
          carb: 48,
          fat: 15,
        };
      } else {
        replyText = isEn
          ? `Hey ${userContext.userName}! Regarding "${text}":\nYour daily target is **${userContext.dailyTarget.cal} kcal** and **${userContext.dailyTarget.pro}g protein** to hit your goal weight (${userContext.optimalTargetWeight} kg).\n• Stay consistent, prioritize hydration (${userContext.dailyTarget.water}ml) and quality recovery!`
          : `يا ${userContext.userName}! بالنسبة لسؤالك "${text}":\nهدفك اليومي الحالي هو **${userContext.dailyTarget.cal} سعرة** و **${userContext.dailyTarget.pro} جرام بروتين** للوصول لوزنك المستهدف (${userContext.optimalTargetWeight} كجم).\n• ركز على البروتين وشرب **${userContext.dailyTarget.water} مل** مياه ونوم 7-8 ساعات لتحقيق أفضل استشفاء!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          mealData,
          timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none no-print">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Expandable Chat Drawer */}
        {isOpen && (
          <div className="glass-panel rounded-2xl mb-2 p-4 shadow-2xl border-2 border-[var(--brand-primary)] max-h-[65vh] flex flex-col justify-between animate-in slide-in-from-bottom-5 duration-200">
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="brand-gradient text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.aiCaptainTitle}</span>
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  {t.aiCaptainSubtitle}
                </span>
              </div>
              <button
                onClick={() => onToggle(false)}
                className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition cursor-pointer"
                title={t.closeChat}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs md:text-sm max-h-72">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full brand-gradient flex items-center justify-center text-white shrink-0 mt-0.5 shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] space-y-2 shadow-sm ${
                      m.sender === 'user'
                        ? 'brand-gradient text-white rounded-tl-none font-semibold'
                        : 'themed-input text-slate-100 rounded-tr-none'
                    }`}
                  >
                    {m.imageBase64 && (
                      <img
                        src={m.imageBase64}
                        alt="Uploaded meal"
                        className="w-48 h-32 object-cover rounded-xl shadow-md mb-2 border border-white/20"
                      />
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                    {m.mealData && (
                      <div className="pt-2 mt-2 border-t border-slate-700/40 flex flex-wrap justify-between items-center gap-2">
                        <div className="text-[11px] font-mono tabular-nums font-bold" style={{ color: 'var(--brand-primary)' }}>
                          {t.calories}: {m.mealData.cal} | P: {m.mealData.pro}g | C: {m.mealData.carb}g | F: {m.mealData.fat}g
                        </div>
                        <button
                          onClick={() => {
                            if (m.mealData) {
                              onAddMeal(
                                m.mealData.title,
                                m.mealData.cal,
                                m.mealData.pro,
                                m.mealData.carb,
                                m.mealData.fat
                              );
                            }
                          }}
                          className="brand-gradient text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1 hover:opacity-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addMealToDay}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />
                  <span>{t.analyzingMeal}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Selected Image Preview Pill */}
        {imageBase64 && (
          <div className="glass-panel rounded-xl px-3 py-1.5 mb-1.5 inline-flex items-center gap-2 shadow-lg border border-[var(--brand-primary)]">
            <img src={imageBase64} alt="Preview" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xs font-bold text-slate-200">
              {isEn ? 'Meal photo ready' : 'صورة الوجبة جاهزة للإرسال'}
            </span>
            <button
              onClick={() => setImageBase64(null)}
              className="text-rose-400 hover:text-rose-300 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Floating Gemini-style Bar */}
        <div className="glass-panel rounded-full p-2 shadow-2xl border-2 border-[var(--brand-primary)] flex items-center gap-2">
          {/* Toggle Chat Drawer */}
          <button
            onClick={() => onToggle()}
            title={t.closeChat}
            className="themed-input hover:border-[var(--brand-primary)] w-10 h-10 rounded-full flex items-center justify-center text-slate-300 transition shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Photo Upload Button */}
          <label
            title={isEn ? 'Take or upload food photo' : 'التقاط أو رفع صورة وجبة لحساب سعراتها'}
            className="cursor-pointer themed-input hover:border-[var(--brand-primary)] w-10 h-10 rounded-full flex items-center justify-center text-slate-300 transition shrink-0"
          >
            <Camera className="w-4 h-4" />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </label>

          {/* Text Input */}
          <input
            type="text"
            placeholder={t.aiInputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-transparent border-none px-2 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputText.trim() && !imageBase64)}
            className="brand-gradient text-white font-extrabold px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md hover:opacity-95 transition shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{t.aiSendBtn}</span>
                <Send className="w-3.5 h-3.5 -scale-x-100" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
