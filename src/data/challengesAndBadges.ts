import { Challenge, Badge } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  titleEn: string;
  minXp: number;
  icon: string;
  perk: string;
  perkEn: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'بطل مبتدئ 🥊', titleEn: 'Novice Athlete 🥊', minXp: 0, icon: '🌱', perk: 'بداية مشوار اللياقة', perkEn: 'Fitness Journey Kickoff' },
  { level: 2, title: 'رياضي نشيط ⚡', titleEn: 'Active Mover ⚡', minXp: 200, icon: '🔥', perk: 'زيادة طاقة الحرق', perkEn: 'Boosted Calorie Burn' },
  { level: 3, title: 'مقاتل السعرات 🎯', titleEn: 'Calorie Crusher 🎯', minXp: 500, icon: '⚔️', perk: 'تحكم دقيق في الماكروز', perkEn: 'Precise Macro Control' },
  { level: 4, title: 'سيد البروتين 🥩', titleEn: 'Protein Master 🥩', minXp: 900, icon: '🛡️', perk: 'حماية الكتلة العضلية', perkEn: 'Muscle Preservation' },
  { level: 5, title: 'وحش الانضباط 💪', titleEn: 'Discipline Beast 💪', minXp: 1500, icon: '👑', perk: 'عادة يومية لا تنكسر', perkEn: 'Unbreakable Daily Habit' },
  { level: 6, title: 'أسطورة PIXEL FIT 🌟', titleEn: 'PIXEL FIT Legend 🌟', minXp: 2300, icon: '🏆', perk: 'نمط حياة صحي متكامل', perkEn: 'Total Fitness Mastery' },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-water-2500',
    title: 'نقاء وتوازن 💧',
    titleEn: 'Purity & Balance 💧',
    desc: 'اشرب 2500 مل أو أكثر من المياه خلال اليوم',
    descEn: 'Drink 2,500 ml or more water throughout the day',
    xp: 50,
    isCompleted: false,
    category: 'water',
    icon: '💧',
  },
  {
    id: 'ch-protein-goal',
    title: 'قناص البروتين 🥩',
    titleEn: 'Protein Hunter 🥩',
    desc: 'حقق 80% على الأقل من هدفك اليومي للبروتين',
    descEn: 'Reach at least 80% of your daily protein target',
    xp: 75,
    isCompleted: false,
    category: 'protein',
    icon: '🍗',
  },
  {
    id: 'ch-log-3-meals',
    title: 'سجل الانضباط 📋',
    titleEn: 'Consistency Log 📋',
    desc: 'سجل 3 وجبات اليوم في دفتر يومياتك',
    descEn: 'Log at least 3 meals in today’s food diary',
    xp: 60,
    isCompleted: false,
    category: 'log',
    icon: '✍️',
  },
  {
    id: 'ch-egyptian-healthy',
    title: 'بلدي وأصيل 🇪🇬',
    titleEn: 'Authentic Fuel 🇪🇬',
    desc: 'أضف وجبة مصرية صحية (قريش، تونة، سمك، فول، صدور فراخ) ليومك',
    descEn: 'Log a nutritious staple (cottage cheese, tuna, fish, foul, chicken)',
    xp: 45,
    isCompleted: false,
    category: 'egyptian',
    icon: '🫘',
  },
  {
    id: 'ch-calorie-control',
    title: 'الميزان الحاسم 🎯',
    titleEn: 'Calorie Precision 🎯',
    desc: 'حافظ على استهلاك السعرات ضمن النطاق المستهدف بدون تجاوز',
    descEn: 'Stay strictly within your planned daily calorie target',
    xp: 70,
    isCompleted: false,
    category: 'calorie',
    icon: '⚖️',
  },
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_meal',
    title: 'الضربة الأولى',
    titleEn: 'First Strike',
    desc: 'سجلت أول وجبة بنجاح في تطبيق PIXEL FIT',
    descEn: 'Successfully logged your first meal in PIXEL FIT',
    icon: '🥗',
    isUnlocked: false,
    category: 'nutrition',
  },
  {
    id: 'water_master',
    title: 'نبع الحيوية',
    titleEn: 'Hydration Spring',
    desc: 'حققت 100% من هدف شرب المياه اليومي',
    descEn: 'Reached 100% of your daily water intake target',
    icon: '💧',
    isUnlocked: false,
    category: 'water',
  },
  {
    id: 'protein_king',
    title: 'وحش البروتين',
    titleEn: 'Protein Titan',
    desc: 'تجاوزت هدف البروتين المحدد لنمو العضلات',
    descEn: 'Hit your daily protein target for muscle growth',
    icon: '💪',
    isUnlocked: false,
    category: 'nutrition',
  },
  {
    id: 'streak_3',
    title: 'شعلة الالتزام',
    titleEn: 'Commitment Flame',
    desc: 'حافظت على الالتزام والتسجيل لمدة 3 أيام متتالية',
    descEn: 'Maintained a consecutive 3-day logging streak',
    icon: '🔥',
    isUnlocked: false,
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'أسبوع ذهبي',
    titleEn: 'Golden Week',
    desc: 'أكملت 7 أيام متتالية من التسجيل والمتابعة اليومية',
    descEn: 'Completed 7 uninterrupted days of healthy tracking',
    icon: '⭐',
    isUnlocked: false,
    category: 'streak',
  },
  {
    id: 'egyptian_foodie',
    title: 'عاشق الأكل المصري',
    titleEn: 'Egyptian Cuisine Fan',
    desc: 'جربت وسجلت 5 أكلات مصرية مختلفة من الموسوعة',
    descEn: 'Logged 5 distinct authentic Egyptian dishes',
    icon: '🇪🇬',
    isUnlocked: false,
    category: 'nutrition',
  },
  {
    id: 'ai_visionary',
    title: 'عين الذكاء الاصطناعي',
    titleEn: 'AI Visionary',
    desc: 'استخدمت كابتن AI أو مسح وجبة بصورة لحساب سعراتها',
    descEn: 'Consulted the AI coach or scanned a meal image',
    icon: '✨',
    isUnlocked: false,
    category: 'ai',
  },
  {
    id: 'weigh_in',
    title: 'صديق الميزان',
    titleEn: 'Scale Ally',
    desc: 'سجلت وزنك لمتابعة خطتك والوصول للوزن المثالي',
    descEn: 'Recorded a body weigh-in to track progress',
    icon: '📈',
    isUnlocked: false,
    category: 'milestone',
  },
];
