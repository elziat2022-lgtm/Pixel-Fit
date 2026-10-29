import React, { useState } from 'react';
import {
  UserProfile,
  UserAccount,
  Language,
  ThemeName,
  DisplayMode,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  User,
  Mail,
  Palette,
  Globe,
  Database,
  Send,
  LogOut,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  mode: DisplayMode;
  toggleMode: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onResetData: () => void;
  weeklySummaryText: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  setProfile,
  language,
  setLanguage,
  theme,
  setTheme,
  mode,
  toggleMode,
  onOpenAuthModal,
  onLogout,
  onResetData,
  weeklySummaryText,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const [name, setName] = useState(profile.account.name);
  const [email, setEmail] = useState(profile.account.email);
  const [sendWeeklyEmail, setSendWeeklyEmail] = useState(profile.account.sendWeeklyEmail);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAccount: UserAccount = {
      ...profile.account,
      name: name.trim() || profile.account.name,
      email: email.trim(),
      sendWeeklyEmail,
    };
    setProfile({ ...profile, account: updatedAccount });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOpenGmailReport = () => {
    const subject = encodeURIComponent(`📊 تقرير PIXEL FIT الأسبوعي - ${profile.account.name}`);
    const body = encodeURIComponent(weeklySummaryText);
    const to = encodeURIComponent(profile.account.email || 'elziat2022@gmail.com');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleExportBackup = () => {
    const data = {
      profile,
      theme,
      mode,
      language,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PIXEL-FIT-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 space-y-1">
        <h2 className="text-xl font-black text-slate-100">{t.settingsTitle}</h2>
        <p className="text-xs text-slate-400">{t.settingsSubtitle}</p>
      </div>

      {/* 1. Account & Identity */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-2xl shadow">
              {profile.account.avatar || '🥊'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-100">{profile.account.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {profile.account.provider === 'google'
                    ? 'Google Connected'
                    : profile.account.provider === 'facebook'
                    ? 'Facebook Connected'
                    : 'Guest'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {profile.account.email || 'elziat2022@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!profile.account.isLoggedIn ? (
              <button
                onClick={onOpenAuthModal}
                className="brand-gradient text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer hover:opacity-95"
              >
                {t.signIn}
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="themed-input text-rose-400 hover:bg-rose-500/10 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut}</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Account Form */}
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-bold">
                {t.fullName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full themed-input rounded-xl pr-9 pl-3 py-2.5 text-xs font-bold"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-bold">
                {t.emailAddress}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full themed-input rounded-xl pr-9 pl-3 py-2.5 text-xs font-mono font-bold"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* Email Reports Checkbox & Quick Sender */}
          <div className="themed-input p-4 rounded-xl space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={sendWeeklyEmail}
                onChange={(e) => setSendWeeklyEmail(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--brand-primary)]"
              />
              <span>{t.receiveWeeklyReport}</span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/30">
              <span className="text-[11px] text-slate-400">
                {isEn
                  ? 'Send your current week calories, protein, water and weight progress to your Gmail inbox now:'
                  : 'أرسل ملخص الأسبوع الحالي بالسعرات والبروتين والمياه وتغير الوزن مباشرة إلى بريدك:'}
              </span>
              <button
                type="button"
                onClick={handleOpenGmailReport}
                className="brand-gradient text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 hover:opacity-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendGmailReport}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="brand-gradient text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition hover:opacity-95 cursor-pointer"
            >
              {isEn ? 'Save Account Profile' : 'حفظ تعديلات الحساب'}
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>{isEn ? 'Saved successfully!' : 'تم الحفظ بنجاح!'}</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. Visual Appearance & Language */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-700/30 pb-3">
          <Palette className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="text-base font-black text-slate-100">{t.appearanceTitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Theme Color Dots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">{t.themeColor}</label>
            <div className="flex items-center gap-2 themed-input p-2.5 rounded-xl">
              <button
                onClick={() => setTheme('pixel')}
                title="Pixel Blue"
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#3355FF] to-[#1BA8F0] ring-2 transition ${
                  theme === 'pixel' ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'
                }`}
              />
              <button
                onClick={() => setTheme('emerald')}
                title="Emerald Green"
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#059669] to-[#10b981] ring-2 transition ${
                  theme === 'emerald' ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'
                }`}
              />
              <button
                onClick={() => setTheme('sunset')}
                title="Sunset Orange"
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#f97316] ring-2 transition ${
                  theme === 'sunset' ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'
                }`}
              />
              <button
                onClick={() => setTheme('royal')}
                title="Royal Purple"
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] ring-2 transition ${
                  theme === 'royal' ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'
                }`}
              />
              <button
                onClick={() => setTheme('gold')}
                title="Gold"
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#ca8a04] to-[#eab308] ring-2 transition ${
                  theme === 'gold' ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'
                }`}
              />
            </div>
          </div>

          {/* Display Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">{t.displayMode}</label>
            <div className="flex gap-2">
              <button
                onClick={() => mode !== 'dark' && toggleMode()}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'dark' ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t.darkMode}</span>
              </button>
              <button
                onClick={() => mode !== 'light' && toggleMode()}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'light' ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.lightMode}</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">{t.languageSection}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('ar')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  language === 'ar' ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                <span>🇪🇬 {t.arabic}</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  language === 'en' ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                <span>🇬🇧 {t.english}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Management */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-700/30 pb-3">
          <Database className="w-5 h-5 text-slate-400" />
          <h3 className="text-base font-black text-slate-100">{t.dataManagementTitle}</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportBackup}
            className="themed-input hover:border-[var(--brand-primary)] text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <span>{t.exportData}</span>
          </button>
          <button
            onClick={onResetData}
            className="themed-input text-rose-400 hover:bg-rose-500/10 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetAllData}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
