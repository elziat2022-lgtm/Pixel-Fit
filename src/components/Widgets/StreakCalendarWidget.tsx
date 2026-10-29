import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { Flame, Check } from 'lucide-react';

interface StreakCalendarWidgetProps {
  streak: number;
  streakDays: string[];
  language: Language;
}

export const StreakCalendarWidget: React.FC<StreakCalendarWidgetProps> = ({
  streak,
  streakDays,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const dayNamesAr = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const dayNamesEn = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dayNames = isEn ? dayNamesEn : dayNamesAr;

  // Generate 7 days ending today
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const key = d.toISOString().split('T')[0];
    const dayOfWeek = (d.getDay() + 1) % 7; // align with Sat=0
    const name = dayNames[dayOfWeek];
    const isCompleted = streakDays.includes(key);
    const isToday = idx === 6;

    return { key, name, isCompleted, isToday };
  });

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h4 className="text-xs font-black text-slate-100">{t.widgetStreakCalendar}</h4>
        </div>
        <span className="text-xs font-black font-mono tabular-nums text-amber-400">
          {streak} {t.streakLabel} 🔥
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {last7Days.map((d, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">{d.name}</span>
            <div
              className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all ${
                d.isCompleted
                  ? 'bg-amber-500 text-slate-900 font-black shadow-sm scale-102'
                  : d.isToday
                  ? 'border-2 border-dashed border-amber-400 text-amber-400'
                  : 'themed-input text-slate-500 opacity-60'
              }`}
            >
              {d.isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : d.isToday ? '•' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
