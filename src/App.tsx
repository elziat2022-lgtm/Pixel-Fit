import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  UserAccount,
  MealEntry,
  WeightLog,
  ThemeName,
  DisplayMode,
  Language,
  EgyptianFood,
  Challenge,
  Badge,
} from './types';
import {
  STORAGE_KEYS,
  getTodayKey,
  getLast7DaysKeys,
  calculateTargets,
} from './utils/calculator';
import { INITIAL_CHALLENGES, ALL_BADGES, LEVELS } from './data/challengesAndBadges';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { NavigationTabs, TabId } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { FoodsGalleryView } from './components/FoodsGalleryView';
import { ChallengesView } from './components/ChallengesView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { CelebrationToast, ToastData } from './components/CelebrationToast';

const STORAGE_KEYS_EXTRA = {
  LANGUAGE: 'pixelfit_lang_v2',
  ACCOUNT: 'pixelfit_account_v2',
  STREAK_DAYS: 'pixelfit_streak_days_v2',
};

export default function App() {
  // 1. Language State
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS_EXTRA.LANGUAGE);
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {}
    return 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS_EXTRA.LANGUAGE, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  // 2. Theme and Display Mode
  const [theme, setThemeState] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return JSON.parse(saved).theme || 'pixel';
    } catch {}
    return 'pixel';
  });

  const [mode, setModeState] = useState<DisplayMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return JSON.parse(saved).mode || 'dark';
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(
      STORAGE_KEYS.THEME,
      JSON.stringify({ theme, mode })
    );
  }, [theme, mode]);

  const setTheme = (nth: ThemeName) => setThemeState(nth);
  const toggleMode = () => setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // 3. User Account (Google / Facebook / Custom)
  const [account, setAccount] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS_EXTRA.ACCOUNT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'أحمد الزيات',
      email: 'elziat2022@gmail.com',
      avatar: '🥊',
      provider: 'google',
      isLoggedIn: true,
      sendWeeklyEmail: true,
    };
  });

  const handleUpdateAccount = (acc: UserAccount) => {
    setAccount(acc);
    localStorage.setItem(STORAGE_KEYS_EXTRA.ACCOUNT, JSON.stringify(acc));
    addToast({
      title: isEn ? 'Welcome back! 👋' : 'أهلاً بك يا بطل! 👋',
      message: isEn ? `Logged in as ${acc.name}` : `تم تسجيل الدخول باسم ${acc.name}`,
      icon: acc.avatar || '🥊',
    });
  };

  const handleLogout = () => {
    const guestAcc: UserAccount = {
      name: isEn ? 'PIXEL Athlete' : 'رياضي PIXEL',
      email: '',
      avatar: '🥊',
      provider: 'guest',
      isLoggedIn: false,
      sendWeeklyEmail: false,
    };
    setAccount(guestAcc);
    localStorage.setItem(STORAGE_KEYS_EXTRA.ACCOUNT, JSON.stringify(guestAcc));
  };

  // 4. Active Tab
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // 5. User Profile (Body Data)
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const p = JSON.parse(saved);
        return {
          ...p,
          account: p.account || account,
        };
      }
    } catch {}
    return {
      account,
      gender: 'male',
      age: 21,
      height: 175,
      weight: 85,
      activity: 1.55,
      targetWeightInput: '',
      goal: -500,
    };
  });

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
  };

  // 6. Meals State
  const [allMeals, setAllMeals] = useState<Record<string, MealEntry[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const todayKey = getTodayKey();
  const todayMeals = allMeals[todayKey] || [];

  // 7. Water State
  const [allWater, setAllWater] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const todayWater = allWater[todayKey] || 0;

  // 8. Weight Logs
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [{ date: todayKey, weight: 85 }];
  });

  // 9. Custom Foods
  const [customFoods, setCustomFoods] = useState<EgyptianFood[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // 10. Daily Streak & Activity Days tracking
  const [streakDays, setStreakDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS_EXTRA.STREAK_DAYS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [todayKey];
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.streak === 'number') return parsed.streak;
      }
    } catch {}
    return 3;
  });

  // Auto streak check on today's visit
  useEffect(() => {
    const today = getTodayKey();
    if (!streakDays.includes(today)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().split('T')[0];

      if (streakDays.includes(yKey)) {
        setStreak((prev) => prev + 1);
      } else if (streakDays.length > 0) {
        setStreak(1);
      }
      const newStreakDays = [...streakDays, today];
      setStreakDays(newStreakDays);
      localStorage.setItem(STORAGE_KEYS_EXTRA.STREAK_DAYS, JSON.stringify(newStreakDays));
    }
  }, [streakDays]);

  // 11. XP, Level & Badges
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.xp === 'number') return parsed.xp;
      }
    } catch {}
    return 240;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.badges) {
          return ALL_BADGES.map((b) => {
            const found = parsed.badges.find((sb: any) => sb.id === b.id);
            return found ? { ...b, isUnlocked: found.isUnlocked, unlockedAt: found.unlockedAt } : b;
          });
        }
      }
    } catch {}
    return ALL_BADGES;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHALLENGES;
  });

  // 12. Modals & Toasts
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const newToast: ToastData = { ...toast, id: `toast-${Date.now()}` };
    setToasts((prev) => [newToast, ...prev].slice(0, 3));
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculate Level from XP
  const level = useMemo(() => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXp) {
        return LEVELS[i].level;
      }
    }
    return 1;
  }, [xp]);

  // Save Gamification
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.GAMIFICATION,
      JSON.stringify({ xp, streak, badges, lastActiveDate: todayKey })
    );
  }, [xp, streak, badges, todayKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  // Derived Targets
  const targetCalculations = useMemo(() => {
    return calculateTargets(profile);
  }, [profile]);

  const { targets, idealRange, diff, timeEstimate, advice } = targetCalculations;

  // Consumed today
  const consumed = useMemo(() => {
    const acc = { cal: 0, pro: 0, carb: 0, fat: 0 };
    todayMeals.forEach((m) => {
      acc.cal += m.cal;
      acc.pro += m.pro;
      acc.carb += m.carb;
      acc.fat += m.fat;
    });
    return acc;
  }, [todayMeals]);

  // Check Badges & Challenges dynamically
  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (target && !target.isUnlocked) {
        const badgeTitle = isEn ? (target.titleEn || target.title) : target.title;
        addToast({
          title: isEn ? 'New Badge Unlocked! 🏆' : 'شارة جديدة مفتوحة! 🏆',
          message: isEn ? `Congratulations! You earned "${badgeTitle}"` : `مبروك! حصلت على شارة "${badgeTitle}"`,
          icon: target.icon,
          xp: 100,
        });
        setXp((x) => x + 100);
        return prev.map((b) =>
          b.id === badgeId
            ? { ...b, isUnlocked: true, unlockedAt: new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-EG') }
            : b
        );
      }
      return prev;
    });
  };

  // Meal Handlers
  const handleAddMeal = (
    title: string,
    cal: number,
    pro: number,
    carb: number,
    fat: number
  ) => {
    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      title,
      cal,
      pro,
      carb,
      fat,
      time: new Date().toLocaleTimeString(isEn ? 'en-US' : 'ar-EG', { hour: '2-digit', minute: '2-digit' }),
      date: todayKey,
    };

    const updated = [...todayMeals, newMeal];
    const newAllMeals = { ...allMeals, [todayKey]: updated };
    setAllMeals(newAllMeals);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(newAllMeals));

    // Gamification XP
    setXp((x) => x + 20);
    addToast({
      title: isEn ? 'Meal logged successfully! 🥗' : 'تم تسجيل الوجبة بنجاح! 🥗',
      message: `${title} (${cal} ${t.calories})`,
      xp: 20,
      icon: '✨',
    });

    // Check first meal badge
    unlockBadge('first_meal');

    // Check protein badge
    if (consumed.pro + pro >= targets.pro) {
      unlockBadge('protein_king');
    }

    // Check 3 meals challenge
    if (updated.length >= 3) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === 'ch-log-3-meals' && !c.isCompleted
            ? { ...c, isCompleted: true }
            : c
        )
      );
    }
  };

  const handleRemoveMeal = (id: string) => {
    const updated = todayMeals.filter((m) => m.id !== id);
    const newAllMeals = { ...allMeals, [todayKey]: updated };
    setAllMeals(newAllMeals);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(newAllMeals));
  };

  const handleClearMeals = () => {
    if (window.confirm(isEn ? 'Are you sure you want to clear today meals?' : 'هل أنت متأكد من تصفير وجبات اليوم؟')) {
      const newAllMeals = { ...allMeals, [todayKey]: [] };
      setAllMeals(newAllMeals);
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(newAllMeals));
    }
  };

  // Water Handlers
  const handleAddWater = (ml: number) => {
    const updated = todayWater + ml;
    const newAllWater = { ...allWater, [todayKey]: updated };
    setAllWater(newAllWater);
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(newAllWater));

    setXp((x) => x + 5);

    if (updated >= targets.water) {
      unlockBadge('water_master');
    }
    if (updated >= 2500) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === 'ch-water-2500' && !c.isCompleted
            ? { ...c, isCompleted: true }
            : c
        )
      );
    }
  };

  const handleSetWaterCups = (cups: number) => {
    const updated = Math.max(0, cups * 250);
    const newAllWater = { ...allWater, [todayKey]: updated };
    setAllWater(newAllWater);
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(newAllWater));
    if (updated >= targets.water) {
      unlockBadge('water_master');
    }
  };

  const handleResetWater = () => {
    const newAllWater = { ...allWater, [todayKey]: 0 };
    setAllWater(newAllWater);
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(newAllWater));
  };

  // Weight Handlers
  const handleAddWeightLog = (weight: number, date: string) => {
    let logs = [...weightLogs];
    const idx = logs.findIndex((l) => l.date === date);
    if (idx >= 0) {
      logs[idx].weight = weight;
    } else {
      logs.push({ date, weight });
    }
    logs.sort((a, b) => a.date.localeCompare(b.date));
    setWeightLogs(logs);
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(logs));

    // Update current profile weight
    setProfile({ ...profile, weight });

    setXp((x) => x + 30);
    addToast({
      title: isEn ? 'Weight recorded! 📈' : 'تم تسجيل الوزن بنجاح! 📈',
      message: `${weight} ${isEn ? 'kg' : 'كجم'}`,
      xp: 30,
      icon: '⚖️',
    });
    unlockBadge('weigh_in');
  };

  // Custom Foods Handler
  const handleAddCustomFood = (food: EgyptianFood) => {
    const updated = [food, ...customFoods];
    setCustomFoods(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(updated));
    addToast({
      title: isEn ? 'Custom food added! 🍲' : 'أكلة مخصصة جديدة! 🍲',
      message: `${food.name}`,
      xp: 15,
      icon: '⭐',
    });
  };

  // Challenges Handler
  const handleCompleteChallenge = (id: string, xpReward: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isCompleted: true } : c))
    );
    setXp((x) => x + xpReward);
    addToast({
      title: isEn ? 'Challenge Completed! 🎯' : 'تحدي مكتمل! 🎯',
      message: isEn ? `Earned +${xpReward} XP reward!` : `استلمت مكافأة التحدي بنجاح!`,
      xp: xpReward,
      icon: '🔥',
    });
  };

  // 7-day Analytics stats
  const weeklyStats = useMemo(() => {
    const daysKeys = getLast7DaysKeys();
    let totalCal = 0;
    let totalPro = 0;
    let totalWater = 0;
    let activeDays = 0;

    const days = daysKeys.map((k) => {
      const meals = allMeals[k] || [];
      const water = allWater[k] || 0;
      const dayCal = meals.reduce((acc, m) => acc + m.cal, 0);
      const dayPro = meals.reduce((acc, m) => acc + m.pro, 0);

      if (meals.length > 0 || water > 0) {
        activeDays++;
        totalCal += dayCal;
        totalPro += dayPro;
        totalWater += water;
      }

      return {
        date: k,
        cal: Math.round(dayCal),
        pro: Math.round(dayPro),
        water,
        mealCount: meals.length,
      };
    });

    const divisor = Math.max(1, activeDays);
    let weightChange = isEn ? 'Stable' : 'ثابت';
    if (weightLogs.length >= 2) {
      const diffW = (weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight).toFixed(1);
      const unit = isEn ? 'kg' : 'كجم';
      weightChange = parseFloat(diffW) > 0 ? `+${diffW} ${unit}` : `${diffW} ${unit}`;
    }

    return {
      avgCal: Math.round(totalCal / divisor),
      avgPro: Math.round(totalPro / divisor),
      avgWater: Math.round(totalWater / divisor),
      weightChange,
      days: days.reverse(),
    };
  }, [allMeals, allWater, weightLogs, isEn]);

  // Formatted weekly summary string for email
  const weeklySummaryText = useMemo(() => {
    return `📊 ${isEn ? 'PIXEL FIT Weekly Report' : 'تقرير PIXEL FIT الأسبوعي'} (${account.name})
📅 ${new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}
- ${t.avgCalories}: ${weeklyStats.avgCal} ${t.calories}
- ${t.avgProtein}: ${weeklyStats.avgPro} ${t.grams}
- ${t.avgWater}: ${weeklyStats.avgWater} ${isEn ? 'ml' : 'مل'}
- ${t.weightVariation}: ${weeklyStats.weightChange}
- ${isEn ? 'Target Weight:' : 'الوزن المستهدف:'} ${idealRange.optimal} ${isEn ? 'kg' : 'كجم'}`;
  }, [weeklyStats, account, idealRange, t, isEn]);

  // Reset all application data
  const handleResetData = () => {
    if (window.confirm(t.resetConfirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const unclaimedChallengesCount = challenges.filter((c) => !c.isCompleted).length;

  return (
    <div className="min-h-screen p-3 sm:p-5 md:p-6 pb-36 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Celebration Floating Toast */}
        <CelebrationToast toasts={toasts} onDismiss={dismissToast} />

        {/* Social Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleUpdateAccount}
          currentAccount={account}
          language={language}
        />

        {/* 1. Top Header with Logo on the Left, v1.1, Profile, Language, AI */}
        <Header
          account={account}
          streak={streak}
          level={level}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          onOpenAi={() => setIsAiOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenChallenges={() => setActiveTab('challenges')}
        />

        {/* 2. Navigation Tabs (5 Tabs with Settings) */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          unclaimedChallengesCount={unclaimedChallengesCount}
        />

        {/* 3. Main Views */}
        <main className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              setProfile={setProfile}
              targets={targets}
              idealRange={idealRange}
              diff={diff}
              timeEstimate={timeEstimate}
              advice={advice}
              consumed={consumed}
              todayMeals={todayMeals}
              onRemoveMeal={handleRemoveMeal}
              onClearMeals={handleClearMeals}
              waterConsumed={todayWater}
              onAddWater={handleAddWater}
              onSetWaterCups={handleSetWaterCups}
              onResetWater={handleResetWater}
              onOpenFoods={() => setActiveTab('foods')}
              onOpenAi={() => setIsAiOpen(true)}
              onAddMeal={handleAddMeal}
              streak={streak}
              streakDays={streakDays}
              language={language}
            />
          )}

          {activeTab === 'foods' && (
            <FoodsGalleryView
              onAddMeal={handleAddMeal}
              customFoods={customFoods}
              onAddCustomFood={handleAddCustomFood}
              language={language}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesView
              xp={xp}
              level={level}
              streak={streak}
              challenges={challenges}
              badges={badges}
              onCompleteChallenge={handleCompleteChallenge}
              language={language}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              weightLogs={weightLogs}
              onAddWeightLog={handleAddWeightLog}
              targetWeight={idealRange.optimal}
              weeklyStats={weeklyStats}
              language={language}
              userEmail={account.email}
              userName={account.name}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              setProfile={setProfile}
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
              mode={mode}
              toggleMode={toggleMode}
              onOpenAuthModal={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onResetData={handleResetData}
              weeklySummaryText={weeklySummaryText}
            />
          )}
        </main>
      </div>

      {/* 4. Floating AI Coach Omni-Bar & Chat Drawer */}
      <AiCoachDrawer
        isOpen={isAiOpen}
        onToggle={(open) => setIsAiOpen(typeof open === 'boolean' ? open : !isAiOpen)}
        onAddMeal={handleAddMeal}
        userContext={{
          userName: account.name,
          language,
          dailyTarget: targets,
          currentWeight: profile.weight,
          optimalTargetWeight: idealRange.optimal,
          consumedToday: consumed,
        }}
        onTriggerAiBadge={() => unlockBadge('ai_visionary')}
      />
    </div>
  );
}
