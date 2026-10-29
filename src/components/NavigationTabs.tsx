import React from 'react';
import { LayoutDashboard, Utensils, Trophy, LineChart, Settings } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

export type TabId = 'dashboard' | 'foods' | 'challenges' | 'analytics' | 'settings';

interface NavigationTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  language: Language;
  unclaimedChallengesCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  language,
  unclaimedChallengesCount = 0,
}) => {
  const t = TRANSLATIONS[language];

  const tabs = [
    {
      id: 'dashboard' as TabId,
      label: t.tabDashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'foods' as TabId,
      label: t.tabFoods,
      icon: Utensils,
      badge: language === 'ar' ? '🇪🇬 مصري' : 'Foods',
    },
    {
      id: 'challenges' as TabId,
      label: t.tabChallenges,
      icon: Trophy,
      badge: unclaimedChallengesCount > 0 ? `${unclaimedChallengesCount}` : null,
      badgeHighlight: true,
    },
    {
      id: 'analytics' as TabId,
      label: t.tabAnalytics,
      icon: LineChart,
      badge: null,
    },
    {
      id: 'settings' as TabId,
      label: t.tabSettings,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="glass-panel rounded-2xl p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-md no-print">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[130px] md:min-w-0 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 relative ${
              isActive
                ? 'brand-gradient text-white shadow-md scale-[1.01]'
                : 'themed-input hover:border-[var(--brand-primary)] opacity-75 hover:opacity-100 text-slate-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>

            {tab.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  tab.badgeHighlight && !isActive
                    ? 'bg-amber-500 text-black animate-bounce'
                    : 'bg-black/30 text-white'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
