import React from 'react';
import { UserAccount, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles, Flame, User, Globe, Settings } from 'lucide-react';

interface HeaderProps {
  account: UserAccount;
  streak: number;
  level: number;
  language: Language;
  onToggleLanguage: () => void;
  onOpenAi: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenChallenges: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  streak,
  level,
  language,
  onToggleLanguage,
  onOpenAi,
  onOpenAuth,
  onOpenSettings,
  onOpenChallenges,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  return (
    <header className="glass-panel rounded-2xl p-3.5 sm:p-4.5 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-xl">
      {/* 1. Left Side: Dynamic Isometric PIXEL FIT Logo + Wordmark */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start" dir="ltr">
        <div className="flex items-center gap-3 select-none">
          {/* Dynamic Isometric Logo */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md hover:scale-105 transition-transform duration-300 shrink-0"
          >
            {/* Left Shape: Isometric P in primary theme color */}
            <path
              d="M18 38 L68 13 L68 42 L40 56 L40 94 L18 105 Z"
              fill="var(--brand-primary)"
              className="transition-colors duration-300"
            />
            {/* Right Shape: Isometric F in secondary theme color */}
            <path
              d="M46 58 L98 32 L98 52 L66 68 L66 77 L90 65 L90 83 L66 95 L66 112 L46 120 Z"
              fill="var(--brand-secondary)"
              className="transition-colors duration-300"
            />
          </svg>

          {/* Clean Brand Wordmark */}
          <div className="leading-none font-black tracking-wider text-left">
            <div
              className="text-xl sm:text-2xl font-black transition-colors duration-300"
              style={{ color: 'var(--brand-primary)' }}
            >
              PIXEL
            </div>
            <div
              className="text-xl sm:text-2xl font-black transition-colors duration-300"
              style={{ color: 'var(--brand-secondary)' }}
            >
              FIT
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="brand-gradient text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm font-mono">
              v1.1
            </span>
          </div>
        </div>

        {/* Small screen quick profile icon */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleLanguage}
            className="themed-input px-2.5 py-1 rounded-xl text-xs font-bold"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={account.isLoggedIn ? onOpenSettings : onOpenAuth}
            className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-sm shadow cursor-pointer"
          >
            {account.avatar || '🥊'}
          </button>
        </div>
      </div>

      {/* 2. Middle & Right Side: Subtitle, Streaks, Language, Profile & AI Button */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto no-print">
        {/* Tagline hidden on tiny screens */}
        <p className="text-xs text-slate-400 hidden lg:block mr-2 ml-2">
          {t.appTagline}
        </p>

        {/* Streak & Level Counter */}
        <button
          onClick={onOpenChallenges}
          title="عرض التحديات ومستوى اللياقة"
          className="themed-input hover:border-[var(--brand-primary)] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition hover:scale-102 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="font-mono tabular-nums">{streak}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 font-mono">L{level}</span>
        </button>

        {/* Language Switcher Button (Desktop) */}
        <button
          onClick={onToggleLanguage}
          title="Switch Language / تبديل اللغة"
          className="themed-input hover:border-[var(--brand-primary)] px-2.5 py-1.5 rounded-xl text-xs font-bold hidden md:flex items-center gap-1.5 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* User Account / Profile Button (Opens Auth or Settings) */}
        <button
          onClick={account.isLoggedIn ? onOpenSettings : onOpenAuth}
          className="themed-input hover:border-[var(--brand-primary)] px-3 py-1.5 rounded-xl text-xs font-bold hidden md:flex items-center gap-2 transition cursor-pointer shadow-sm group"
        >
          <span className="text-base">{account.avatar || '🥊'}</span>
          <span className="text-slate-200 group-hover:text-white max-w-[120px] truncate">
            {account.isLoggedIn ? account.name : t.signIn}
          </span>
        </button>

        {/* Settings Tab Shortcut Button */}
        <button
          onClick={onOpenSettings}
          title={t.profileAndSettings}
          className="themed-input hover:border-[var(--brand-primary)] p-2 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* AI Quick Button */}
        <button
          onClick={onOpenAi}
          className="brand-gradient text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer hover:scale-102"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{isEn ? 'AI Coach' : 'كابتن AI'}</span>
        </button>
      </div>
    </header>
  );
};
