import React, { useState } from 'react';
import { Challenge, Badge, Language } from '../types';
import { LEVELS, LevelInfo } from '../data/challengesAndBadges';
import { TRANSLATIONS } from '../i18n/translations';
import { Trophy, Flame, CheckCircle2, Lock, Sparkles, Award, Star } from 'lucide-react';

interface ChallengesViewProps {
  xp: number;
  level: number;
  streak: number;
  challenges: Challenge[];
  badges: Badge[];
  onCompleteChallenge: (id: string, xpReward: number) => void;
  language: Language;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  xp,
  level,
  streak,
  challenges,
  badges,
  onCompleteChallenge,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const currentLevelInfo: LevelInfo =
    LEVELS.find((l) => l.level === level) || LEVELS[0];
  const nextLevelInfo: LevelInfo | undefined = LEVELS.find((l) => l.level === level + 1);

  const prevMinXp = currentLevelInfo.minXp;
  const nextMinXp = nextLevelInfo ? nextLevelInfo.minXp : prevMinXp + 1000;
  const xpInCurrentLevel = Math.max(0, xp - prevMinXp);
  const xpNeededForLevel = nextMinXp - prevMinXp;
  const levelProgressPct = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)
  );

  const completedChallengesCount = challenges.filter((c) => c.isCompleted).length;
  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === 'unlocked') return b.isUnlocked;
    if (badgeFilter === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Gamification Hero Card: Level & Streak */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-xl border-2 border-[var(--brand-primary)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Level Info */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-3xl shadow-lg shrink-0">
                {currentLevelInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="brand-gradient text-white text-[11px] font-black px-2.5 py-0.5 rounded-full font-mono tabular-nums">
                    {t.levelLabel} {level}
                  </span>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEn ? currentLevelInfo.perkEn : currentLevelInfo.perk}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-100 mt-1">
                  {isEn ? currentLevelInfo.titleEn : currentLevelInfo.title}
                </h2>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold font-mono tabular-nums">
                <span className="text-slate-300">
                  {isEn ? 'Total Experience:' : 'إجمالي الخبرة:'}{' '}
                  <strong className="text-[var(--brand-primary)]">{xp} XP</strong>
                </span>
                <span className="text-slate-400">
                  {nextLevelInfo ? (
                    isEn ? `${nextMinXp - xp} XP to next level` : `متبقي ${nextMinXp - xp} XP للمستوى التالي`
                  ) : (
                    isEn ? 'Max Level Achieved! 👑' : 'أعلى مستوى حالياً! 👑'
                  )}
                </span>
              </div>
              <div className="w-full themed-input h-3.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="brand-gradient h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Counter & Daily Summary */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3 text-center">
            {/* Streak Box */}
            <div className="themed-input p-4 rounded-2xl border border-amber-500/30 flex flex-col justify-center items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-1 text-amber-400">
                <Flame className="w-6 h-6 fill-amber-400" />
              </div>
              <span className="text-2xl font-black font-mono tabular-nums text-amber-400 mt-1">
                {streak}
              </span>
              <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                {t.streakLabel} 🔥
              </span>
            </div>

            {/* Unlocked Badges Count */}
            <div className="themed-input p-4 rounded-2xl border border-purple-500/30 flex flex-col justify-center items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-1 text-purple-400">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-mono tabular-nums text-purple-400 mt-1">
                {unlockedBadgesCount} / {badges.length}
              </span>
              <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                {isEn ? 'Badges Unlocked 🏆' : 'شارات مفتوحة 🏆'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Daily Challenges Section */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-700/30 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-base font-extrabold text-slate-100">{t.challengesTitle}</h3>
              <span className="text-xs brand-gradient text-white font-bold px-2.5 py-0.5 rounded-full font-mono tabular-nums">
                {completedChallengesCount} / {challenges.length} {t.completedCount}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.challengesSubtitle}</p>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">
            {isEn ? 'Refreshes Daily 🔄' : 'تتجدد المهام يومياً 🔄'}
          </span>
        </div>

        <div className="space-y-3">
          {challenges.map((ch) => {
            const chTitle = isEn ? (ch.titleEn || ch.title) : ch.title;
            const chDesc = isEn ? (ch.descEn || ch.desc) : ch.desc;

            return (
              <div
                key={ch.id}
                className={`p-4 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                  ch.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-90'
                    : 'themed-input hover:border-[var(--brand-primary)]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      ch.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'themed-input'
                    }`}
                  >
                    {ch.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-100">{chTitle}</h4>
                      <span className="text-[10px] font-black font-mono tabular-nums px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        +{ch.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{chDesc}</p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {ch.isCompleted ? (
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.challengeCompleted} (+{ch.xp} XP)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onCompleteChallenge(ch.id, ch.xp)}
                      className="brand-gradient text-white text-xs font-black px-4 py-2 rounded-xl shadow transition hover:opacity-95 hover:scale-102 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t.claimReward} (+{ch.xp} XP)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Badges Trophy Showcase */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/30 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--brand-primary)]" />
            <div>
              <h3 className="text-base font-extrabold text-slate-100">{t.trophiesTitle}</h3>
              <p className="text-xs text-slate-400">
                {isEn ? 'Honors of consistency & nutritional discipline' : 'أوسمة الشرف لمتابعتك وانضباطك الرياضي'}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 themed-input p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                badgeFilter === 'all' ? 'brand-gradient text-white shadow' : 'text-slate-400'
              }`}
            >
              {t.allBadges} ({badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter('unlocked')}
              className={`px-3 py-1 rounded-lg transition ${
                badgeFilter === 'unlocked' ? 'brand-gradient text-white shadow' : 'text-slate-400'
              }`}
            >
              {t.unlockedBadges} ({unlockedBadgesCount})
            </button>
            <button
              onClick={() => setBadgeFilter('locked')}
              className={`px-3 py-1 rounded-lg transition ${
                badgeFilter === 'locked' ? 'brand-gradient text-white shadow' : 'text-slate-400'
              }`}
            >
              {t.lockedBadges} ({badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredBadges.map((badge) => {
            const bTitle = isEn ? (badge.titleEn || badge.title) : badge.title;
            const bDesc = isEn ? (badge.descEn || badge.desc) : badge.desc;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl text-center space-y-2 border transition relative overflow-hidden ${
                  badge.isUnlocked
                    ? 'glass-panel border-amber-500/40 shadow-lg'
                    : 'themed-input opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                {!badge.isUnlocked && (
                  <div className="absolute top-2.5 left-2.5 text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                    badge.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500/20 to-amber-400/30 ring-2 ring-amber-400/50'
                      : 'bg-slate-800/60'
                  }`}
                >
                  {badge.icon}
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-100 line-clamp-1">{bTitle}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {bDesc}
                  </p>
                </div>

                {badge.isUnlocked ? (
                  <span className="inline-block text-[9px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {t.badgeUnlocked}
                  </span>
                ) : (
                  <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {t.badgeLocked}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
