import React, { useState } from 'react';
import { UserAccount, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { X, Check, Sparkles, User, Mail, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (account: UserAccount) => void;
  currentAccount: UserAccount;
  language: Language;
}

const AVATARS = [
  '🥊', '⚡', '🏋️', '🏃', '🥋', '👑', '🔥', '🦁'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentAccount,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const [name, setName] = useState(
    currentAccount.name !== 'رياضي PIXEL' && currentAccount.name !== 'PIXEL Athlete'
      ? currentAccount.name
      : ''
  );
  const [email, setEmail] = useState(currentAccount.email || 'elziat2022@gmail.com');
  const [selectedAvatar, setSelectedAvatar] = useState(currentAccount.avatar || '🥊');
  const [activeProvider, setActiveProvider] = useState<'google' | 'facebook' | 'custom'>('google');

  if (!isOpen) return null;

  const handleQuickSocialLogin = (provider: 'google' | 'facebook') => {
    const finalName = name.trim() || (provider === 'google' ? 'أحمد الزيات' : 'Mohamed Ziat');
    const finalEmail = email.trim() || 'elziat2022@gmail.com';

    onLogin({
      name: finalName,
      email: finalEmail,
      avatar: selectedAvatar,
      provider,
      isLoggedIn: true,
      sendWeeklyEmail: true,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      name: name.trim(),
      email: email.trim(),
      avatar: selectedAvatar,
      provider: activeProvider === 'custom' ? 'guest' : activeProvider,
      isLoggedIn: true,
      sendWeeklyEmail: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-5 border-2 border-[var(--brand-primary)] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 text-slate-400 hover:text-white p-1 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-14 h-14 mx-auto rounded-2xl brand-gradient flex items-center justify-center text-3xl shadow-lg mb-2">
            {selectedAvatar}
          </div>
          <h3 className="text-lg font-black text-slate-100">
            {isEn ? 'Sign in to PIXEL FIT' : 'تسجيل الدخول إلى PIXEL FIT'}
          </h3>
          <p className="text-xs text-slate-400">
            {isEn
              ? 'Connect your account to sync goals, receive Gmail reports & talk with AI by name!'
              : 'اربط حسابك لمزامنة أهدافك واستلام تقرير الأسبوع على بريدك ومحادثة الـ AI باسمك!'}
          </p>
        </div>

        {/* Quick Social Auth Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Google Button */}
          <button
            onClick={() => handleQuickSocialLogin('google')}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 font-extrabold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-3 shadow-md cursor-pointer hover:scale-[1.01]"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xs sm:text-sm">
              {isEn ? 'Continue with Google Account' : 'المتابعة بحساب Google'}
            </span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={() => handleQuickSocialLogin('facebook')}
            className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-3 shadow-md cursor-pointer hover:scale-[1.01]"
          >
            {/* Facebook F Logo */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-xs sm:text-sm">
              {isEn ? 'Continue with Facebook' : 'المتابعة بحساب Facebook'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="h-[1px] bg-slate-700/40 flex-1"></div>
          <span className="text-[11px] text-slate-400 font-bold">
            {isEn ? 'or customize profile' : 'أو خصص بياناتك يدوياً'}
          </span>
          <div className="h-[1px] bg-slate-700/40 flex-1"></div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-bold">
              {isEn ? 'Choose Avatar' : 'اختر صورتك الرمزية:'}
            </label>
            <div className="flex justify-between gap-1 overflow-x-auto pb-1">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                    selectedAvatar === av
                      ? 'brand-gradient ring-2 ring-white scale-110 shadow'
                      : 'themed-input hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-bold">
              {isEn ? 'Your Name (Used by AI Coach)' : 'اسمك (سيناديك به كابتن AI):'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={isEn ? 'e.g. Alex or Ahmed' : 'مثلاً: أحمد الزيات أو كابتن محمد'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full themed-input rounded-xl pr-9 pl-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-bold">
              {isEn ? 'Gmail Address (For Weekly Reports)' : 'بريدك على الجيميل (لإرسال ملخص الأسبوع):'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full themed-input rounded-xl pr-9 pl-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full brand-gradient text-white text-xs font-extrabold py-3 rounded-2xl shadow-lg transition hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>{isEn ? 'Save & Start Training' : 'حفظ والدخول للتدريب'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
