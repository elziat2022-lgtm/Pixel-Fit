import React, { useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export interface ToastData {
  id: string;
  title: string;
  message: string;
  xp?: number;
  icon?: string;
}

interface CelebrationToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({
  toasts,
  onDismiss,
}) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass-panel border-2 border-amber-400/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 bg-[#070b28]/95"
        >
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-xl shadow text-white shrink-0">
            {toast.icon || '🏆'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black text-amber-300">{toast.title}</h4>
              {toast.xp && (
                <span className="text-[10px] font-black font-mono tabular-nums px-2 py-0.5 rounded-full bg-amber-400 text-black">
                  +{toast.xp} XP
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
