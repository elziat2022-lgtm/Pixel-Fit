export type Gender = 'male' | 'female';
export type Language = 'ar' | 'en';
export type AuthProvider = 'guest' | 'google' | 'facebook';

export interface UserAccount {
  name: string;
  email: string;
  avatar: string;
  provider: AuthProvider;
  isLoggedIn: boolean;
  sendWeeklyEmail: boolean;
}

export interface UserProfile {
  account: UserAccount;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  activity: number;
  targetWeightInput: string;
  goal: number; // calorie deficit/surplus, e.g. -500, -750, 0, 400
}

export interface DailyTargets {
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  water: number;
}

export interface MealEntry {
  id: string;
  title: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  time: string;
  date: string;
  category?: string;
}

export interface EgyptianFood {
  id: string;
  name: string;
  nameEn: string;
  portion: string;
  portionEn: string;
  standardGrams: number;
  category: 'فطار وشعبي' | 'غداء مصري' | 'مشويات وبروتين' | 'سناكس ومشروبات';
  categoryEn: 'Breakfast & Traditional' | 'Lunch & Casseroles' | 'Grills & Protein' | 'Snacks & Drinks';
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  emoji: string;
  keys: string[];
  img: string;
}

export interface Challenge {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  xp: number;
  isCompleted: boolean;
  category: 'water' | 'protein' | 'calorie' | 'log' | 'egyptian';
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'nutrition' | 'water' | 'ai' | 'milestone';
}

export interface WeightLog {
  date: string;
  weight: number;
  notes?: string;
}

export type ThemeName = 'pixel' | 'emerald' | 'sunset' | 'royal' | 'gold';
export type DisplayMode = 'dark' | 'light';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageBase64?: string;
  timestamp: string;
  mealData?: {
    title: string;
    cal: number;
    pro: number;
    carb: number;
    fat: number;
  };
}
