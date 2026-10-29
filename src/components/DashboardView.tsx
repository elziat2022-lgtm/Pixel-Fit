import React, { useState } from 'react';
import { UserProfile, DailyTargets, MealEntry, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { BmiWidget } from './Widgets/BmiWidget';
import { StreakCalendarWidget } from './Widgets/StreakCalendarWidget';
import { NextMealSuggestionWidget } from './Widgets/NextMealSuggestionWidget';
import {
  Flame,
  Droplets,
  Plus,
  Trash2,
  Target,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  targets: DailyTargets;
  idealRange: { min: number; max: number; optimal: number };
  diff: number;
  timeEstimate: string;
  advice: string;
  consumed: { cal: number; pro: number; carb: number; fat: number };
  todayMeals: MealEntry[];
  onRemoveMeal: (id: string) => void;
  onClearMeals: () => void;
  waterConsumed: number;
  onAddWater: (ml: number) => void;
  onSetWaterCups: (cups: number) => void;
  onResetWater: () => void;
  onOpenFoods: () => void;
  onOpenAi: () => void;
  onAddMeal: (title: string, cal: number, pro: number, carb: number, fat: number) => void;
  streak: number;
  streakDays: string[];
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  setProfile,
  targets,
  idealRange,
  diff,
  timeEstimate,
  advice,
  consumed,
  todayMeals,
  onRemoveMeal,
  onClearMeals,
  waterConsumed,
  onAddWater,
  onSetWaterCups,
  onResetWater,
  onOpenFoods,
  onOpenAi,
  onAddMeal,
  streak,
  streakDays,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const calPct = Math.min(100, Math.round((consumed.cal / targets.cal) * 100)) || 0;
  const proPct = Math.min(100, Math.round((consumed.pro / targets.pro) * 100)) || 0;
  const carbPct = Math.min(100, Math.round((consumed.carb / targets.carb) * 100)) || 0;
  const fatPct = Math.min(100, Math.round((consumed.fat / targets.fat) * 100)) || 0;

  const remCal = Math.max(0, targets.cal - consumed.cal);
  const remPro = Math.max(0, targets.pro - consumed.pro);
  const remCarb = Math.max(0, targets.carb - consumed.carb);
  const remFat = Math.max(0, targets.fat - consumed.fat);

  const waterTarget = targets.water;
  const totalWaterCups = Math.ceil(waterTarget / 250);
  const filledWaterCups = Math.floor(waterConsumed / 250);
  const waterPct = Math.min(100, Math.round((waterConsumed / waterTarget) * 100)) || 0;
  const remWater = Math.max(0, waterTarget - waterConsumed);

  return (
    <div className="space-y-6">
      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right Section: Body Data, Roadmap & Widgets (5 cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Body Data Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/30 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--brand-primary)]" />
                <h2 className="text-base font-extrabold text-slate-100">{t.bodyDataTitle}</h2>
              </div>
              <button
                onClick={() => setShowProfileDetails(!showProfileDetails)}
                className="text-xs font-bold text-[var(--brand-primary)] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{showProfileDetails ? t.hideDetails : t.editData}</span>
                {showProfileDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Summary View */}
            {!showProfileDetails && (
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="themed-input p-2.5 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">{t.currentWeight}</span>
                  <span className="text-sm md:text-base font-black font-mono tabular-nums text-slate-100">
                    {profile.weight} {isEn ? 'kg' : 'كجم'}
                  </span>
                </div>
                <div className="themed-input p-2.5 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">{t.height}</span>
                  <span className="text-sm md:text-base font-black font-mono tabular-nums text-slate-100">
                    {profile.height} {isEn ? 'cm' : 'سم'}
                  </span>
                </div>
                <div className="themed-input p-2.5 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">{t.goal}</span>
                  <span className="text-xs font-black text-amber-400 block mt-0.5 truncate">
                    {profile.goal === -500
                      ? isEn ? 'Healthy Cut' : 'تنشيف صحي'
                      : profile.goal === -750
                      ? isEn ? 'Fast Cut' : 'تنشيف سريع'
                      : profile.goal === 0
                      ? isEn ? 'Maintain' : 'ثبات وزن'
                      : isEn ? 'Bulk' : 'تضخيم عضل'}
                  </span>
                </div>
              </div>
            )}

            {/* Collapsible Edit Form */}
            {showProfileDetails && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.gender}</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-bold"
                    >
                      <option value="male">{t.male}</option>
                      <option value="female">{t.female}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.age}</label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseFloat(e.target.value) || 20 })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.height} ({isEn ? 'cm' : 'سم'})</label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 170 })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.currentWeight} ({isEn ? 'kg' : 'كجم'})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 70 })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.activity}</label>
                    <select
                      value={profile.activity}
                      onChange={(e) => setProfile({ ...profile, activity: parseFloat(e.target.value) })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-bold"
                    >
                      <option value="1.2">{t.sedentary}</option>
                      <option value="1.375">{t.lightActivity}</option>
                      <option value="1.55">{t.moderateActivity}</option>
                      <option value="1.725">{t.highActivity}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{t.targetWeightInput}</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder={t.targetWeightPlaceholder}
                      value={profile.targetWeightInput}
                      onChange={(e) => setProfile({ ...profile, targetWeightInput: e.target.value })}
                      className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">{t.goal}</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: parseFloat(e.target.value) })}
                    className="w-full themed-input rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="-500">{t.goalHealthyDeficit}</option>
                    <option value="-750">{t.goalFastDeficit}</option>
                    <option value="0">{t.goalMaintain}</option>
                    <option value="400">{t.goalBulk}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Widgets: BMI & Weekly Streak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BmiWidget weight={profile.weight} height={profile.height} language={language} />
            <StreakCalendarWidget streak={streak} streakDays={streakDays} language={language} />
          </div>

          {/* Ideal Weight Roadmap Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-3.5 border-r-4 border-r-[var(--brand-primary)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-1.5" style={{ color: 'var(--brand-primary)' }}>
                <Target className="w-4 h-4" />
                <span>{t.idealWeightMap}</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-400 font-mono tabular-nums">
                {diff === 0
                  ? isEn ? 'Optimal Weight' : 'وزن مثالي'
                  : diff > 0
                  ? isEn ? `Cut ${diff} kg` : `نزول ${diff} كجم`
                  : isEn ? `Gain ${Math.abs(diff)} kg` : `زيادة ${Math.abs(diff)} كجم`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="themed-input p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block">{t.idealRange}</span>
                <span className="text-sm md:text-base font-black font-mono tabular-nums block mt-1 text-slate-100">
                  {idealRange.min} - {idealRange.max} {isEn ? 'kg' : 'كجم'}
                </span>
                <span className="text-[10px] font-bold block mt-0.5" style={{ color: 'var(--brand-primary)' }}>
                  {t.optimalBest}: {idealRange.optimal} {isEn ? 'kg' : 'كجم'}
                </span>
              </div>
              <div className="themed-input p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block">{t.timeEstimate}</span>
                <span className="text-xs md:text-sm font-black text-amber-400 block mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeEstimate}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{t.basedOnDeficit}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed themed-input p-3 rounded-xl">
              {advice}
            </p>
          </div>

          {/* Water Tracker Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">{t.waterTrackerTitle}</h3>
                  <p className="text-[11px] text-slate-400">
                    {t.dailyTarget}: <strong className="text-sky-400 font-mono tabular-nums">{waterTarget}</strong> {isEn ? 'ml' : 'مل'} ({totalWaterCups} {t.cups})
                  </p>
                </div>
              </div>
              <span className="brand-gradient text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm font-mono tabular-nums">
                {waterPct}%
              </span>
            </div>

            {/* Progress Bar & Indicators */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">
                  {t.consumedWater}: <strong className="text-sky-400 font-mono tabular-nums">{waterConsumed}</strong> {isEn ? 'ml' : 'مل'}
                </span>
                <span className="text-slate-400">
                  {t.remainingWater}: <strong className="text-amber-400 font-mono tabular-nums">{remWater}</strong> {isEn ? 'ml' : 'مل'}
                </span>
              </div>
              <div className="w-full themed-input h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="brand-gradient h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
            </div>

            {/* Cups Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {Array.from({ length: totalWaterCups }).map((_, idx) => {
                const isFull = idx < filledWaterCups;
                return (
                  <button
                    key={idx}
                    onClick={() => onSetWaterCups(idx + 1 === filledWaterCups ? idx : idx + 1)}
                    className={`p-2 rounded-xl text-center transition flex flex-col items-center cursor-pointer ${
                      isFull
                        ? 'brand-gradient text-white shadow-sm scale-102'
                        : 'themed-input opacity-60 hover:opacity-100 hover:border-sky-400'
                    }`}
                    title={`Cup ${idx + 1} (${(idx + 1) * 250} ml)`}
                  >
                    <span className="text-sm">{isFull ? '🥤' : '🥛'}</span>
                    <span className="text-[9px] font-bold font-mono tabular-nums mt-0.5">
                      {(idx + 1) * 250}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 pt-1 no-print">
              <button
                onClick={() => onAddWater(250)}
                className="flex-1 themed-input hover:border-sky-400 hover:text-sky-400 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addCup}</span>
              </button>
              <button
                onClick={() => onAddWater(500)}
                className="flex-1 brand-gradient text-white text-xs font-bold py-2 rounded-xl shadow transition hover:opacity-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addBottle}</span>
              </button>
              <button
                onClick={onResetWater}
                className="themed-input text-rose-400 hover:bg-rose-500/10 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                title={t.resetWater}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Left Section: Daily Macros, Next Meal Suggestion, & Meals Log (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2. Daily Macros Progress */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/30 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-extrabold text-slate-100">{t.dailyMacrosTitle}</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono tabular-nums">
                {new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-EG', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>

            {/* Macros Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Calories */}
              <div className="themed-input p-3 rounded-2xl relative overflow-hidden">
                <span className="text-xs text-slate-400 block">{t.calories}</span>
                <div className="text-lg font-black font-mono tabular-nums mt-1" style={{ color: 'var(--brand-primary)' }}>
                  {consumed.cal} <span className="text-xs font-normal text-slate-400">/ {targets.cal}</span>
                </div>
                <div className="w-full bg-slate-700/30 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="brand-gradient h-full rounded-full transition-all duration-300"
                    style={{ width: `${calPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1.5 font-mono tabular-nums">
                  {t.remaining}: <strong className="text-amber-400 font-bold">{remCal}</strong>
                </span>
              </div>

              {/* Protein */}
              <div className="themed-input p-3 rounded-2xl relative overflow-hidden">
                <span className="text-xs text-slate-400 block">{t.protein}</span>
                <div className="text-lg font-black text-sky-400 font-mono tabular-nums mt-1">
                  {consumed.pro} <span className="text-xs font-normal text-slate-400">/ {targets.pro}{t.grams}</span>
                </div>
                <div className="w-full bg-slate-700/30 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${proPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1.5 font-mono tabular-nums">
                  {t.remaining}: <strong className="text-sky-400 font-bold">{remPro}</strong>{t.grams}
                </span>
              </div>

              {/* Carbs */}
              <div className="themed-input p-3 rounded-2xl relative overflow-hidden">
                <span className="text-xs text-slate-400 block">{t.carbs}</span>
                <div className="text-lg font-black text-amber-400 font-mono tabular-nums mt-1">
                  {consumed.carb} <span className="text-xs font-normal text-slate-400">/ {targets.carb}{t.grams}</span>
                </div>
                <div className="w-full bg-slate-700/30 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${carbPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1.5 font-mono tabular-nums">
                  {t.remaining}: <strong className="text-amber-400 font-bold">{remCarb}</strong>{t.grams}
                </span>
              </div>

              {/* Fat */}
              <div className="themed-input p-3 rounded-2xl relative overflow-hidden">
                <span className="text-xs text-slate-400 block">{t.fat}</span>
                <div className="text-lg font-black text-rose-400 font-mono tabular-nums mt-1">
                  {consumed.fat} <span className="text-xs font-normal text-slate-400">/ {targets.fat}{t.grams}</span>
                </div>
                <div className="w-full bg-slate-700/30 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-rose-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${fatPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1.5 font-mono tabular-nums">
                  {t.remaining}: <strong className="text-rose-400 font-bold">{remFat}</strong>{t.grams}
                </span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="flex flex-wrap gap-2 pt-1 no-print">
              <button
                onClick={onOpenFoods}
                className="brand-gradient text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addMealQuick}</span>
              </button>
              <button
                onClick={onOpenAi}
                className="themed-input hover:border-[var(--brand-primary)] text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.askAiBtn}</span>
              </button>
            </div>
          </div>

          {/* Interactive Next Meal Suggestion Widget */}
          <NextMealSuggestionWidget
            remCal={remCal}
            remPro={remPro}
            language={language}
            onAddMeal={(title, c, p, cb, f) => onAddMeal(title, c, p, cb, f)}
          />

          {/* 3. Today's Logged Meals */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/30 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-100">{t.todaysMealsTitle}</h3>
                <span className="brand-gradient text-white text-xs font-bold px-2 py-0.5 rounded-full font-mono tabular-nums">
                  {todayMeals.length}
                </span>
              </div>
              {todayMeals.length > 0 && (
                <button
                  onClick={onClearMeals}
                  className="text-xs text-rose-400 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition font-bold cursor-pointer no-print"
                >
                  {t.clearToday}
                </button>
              )}
            </div>

            {/* Meals List */}
            {todayMeals.length === 0 ? (
              <div className="themed-input rounded-2xl p-6 text-center space-y-3">
                <div className="text-3xl">🍽️</div>
                <h4 className="text-sm font-bold text-slate-200">{t.noMealsYet}</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{t.noMealsHint}</p>
                <button
                  onClick={onOpenFoods}
                  className="brand-gradient text-white text-xs font-bold px-4 py-2 rounded-xl shadow inline-flex items-center gap-1.5 cursor-pointer hover:scale-102 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.exploreFoodsBtn}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex justify-between items-center themed-input p-3 rounded-xl hover:border-[var(--brand-primary)] transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-100">{meal.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">{meal.time}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-mono tabular-nums font-bold mt-1">
                        <span style={{ color: 'var(--brand-primary)' }}>{meal.cal} {t.calories}</span>
                        <span className="text-sky-400">P: {meal.pro}{t.grams}</span>
                        <span className="text-amber-400">C: {meal.carb}{t.grams}</span>
                        <span className="text-rose-400">F: {meal.fat}{t.grams}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveMeal(meal.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer no-print"
                      title="Delete Meal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
