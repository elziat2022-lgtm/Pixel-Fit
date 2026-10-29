import React, { useMemo } from 'react';
import { Language, EgyptianFood } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { EGYPTIAN_FOODS } from '../../data/egyptianFoods';
import { Utensils, Plus } from 'lucide-react';

interface NextMealSuggestionWidgetProps {
  remCal: number;
  remPro: number;
  language: Language;
  onAddMeal: (title: string, cal: number, pro: number, carb: number, fat: number) => void;
}

export const NextMealSuggestionWidget: React.FC<NextMealSuggestionWidgetProps> = ({
  remCal,
  remPro,
  language,
  onAddMeal,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const suggestion = useMemo(() => {
    // If protein is low, prioritize high protein foods
    if (remPro > 30) {
      const highPro = EGYPTIAN_FOODS.filter((f) => f.pro >= 20);
      return highPro[Math.floor(Math.random() * highPro.length)] || EGYPTIAN_FOODS[0];
    }
    // If calories are low (< 300), suggest light snack/traditional
    if (remCal < 300) {
      const light = EGYPTIAN_FOODS.filter((f) => f.cal <= 200);
      return light[Math.floor(Math.random() * light.length)] || EGYPTIAN_FOODS[0];
    }
    // General balanced dish
    const balanced = EGYPTIAN_FOODS.filter((f) => f.cal <= remCal);
    return balanced[Math.floor(Math.random() * balanced.length)] || EGYPTIAN_FOODS[0];
  }, [remCal, remPro]);

  if (!suggestion) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3 shadow-md border-r-4 border-r-amber-400">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-black text-slate-100">{t.widgetNextMeal}</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400 font-mono tabular-nums">
          {suggestion.cal} {t.calories}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{suggestion.emoji}</span>
          <div>
            <h5 className="text-xs font-bold text-slate-100 line-clamp-1">
              {isEn ? suggestion.nameEn : suggestion.name}
            </h5>
            <span className="text-[10px] text-slate-400">
              {isEn ? suggestion.portionEn : suggestion.portion} ·{' '}
              <strong className="text-sky-400 font-mono tabular-nums">+{suggestion.pro}{t.grams} {t.protein}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            onAddMeal(
              isEn ? suggestion.nameEn : suggestion.name,
              suggestion.cal,
              suggestion.pro,
              suggestion.carb,
              suggestion.fat
            )
          }
          className="brand-gradient text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow hover:opacity-95 transition flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isEn ? 'Add' : 'إضافة'}</span>
        </button>
      </div>
    </div>
  );
};
