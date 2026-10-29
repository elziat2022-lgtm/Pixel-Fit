import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

interface BmiWidgetProps {
  weight: number;
  height: number;
  language: Language;
}

export const BmiWidget: React.FC<BmiWidgetProps> = ({ weight, height, language }) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const heightM = height / 100;
  const bmi = heightM > 0 ? parseFloat((weight / (heightM * heightM)).toFixed(1)) : 22;

  let category = t.widgetBmiNormal;
  let color = 'text-emerald-400';
  let bgColor = 'bg-emerald-500/15 border-emerald-500/30';

  if (bmi < 18.5) {
    category = t.widgetBmiUnderweight;
    color = 'text-sky-400';
    bgColor = 'bg-sky-500/15 border-sky-500/30';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = t.widgetBmiNormal;
    color = 'text-emerald-400';
    bgColor = 'bg-emerald-500/15 border-emerald-500/30';
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = t.widgetBmiOverweight;
    color = 'text-amber-400';
    bgColor = 'bg-amber-500/15 border-amber-500/30';
  } else {
    category = t.widgetBmiObese;
    color = 'text-rose-400';
    bgColor = 'bg-rose-500/15 border-rose-500/30';
  }

  // Position on gauge (15 to 35 range)
  const clampedBmi = Math.max(15, Math.min(35, bmi));
  const percent = ((clampedBmi - 15) / 20) * 100;

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--brand-primary)]" />
          <h4 className="text-xs font-black text-slate-100">{t.widgetBmiTitle}</h4>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${bgColor} ${color}`}>
          {category}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-black font-mono tabular-nums text-slate-100">
            {bmi}
          </span>
          <span className="text-[11px] text-slate-400 mr-1.5 ml-1.5">kg/m²</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {isEn ? 'Healthy Range: 18.5 – 24.9' : 'النطاق الطبيعي: 18.5 – 24.9'}
        </span>
      </div>

      {/* Visual BMI Gauge Bar */}
      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-slate-700/40 relative overflow-hidden flex">
          <div className="w-[17.5%] bg-sky-400/80" title="Underweight" />
          <div className="w-[32%] bg-emerald-400" title="Normal" />
          <div className="w-[25%] bg-amber-400" title="Overweight" />
          <div className="w-[25.5%] bg-rose-500" title="Obese" />
        </div>
        <div className="relative w-full h-2">
          <div
            className="absolute top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-md border border-slate-900 transition-all duration-300"
            style={{ left: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
