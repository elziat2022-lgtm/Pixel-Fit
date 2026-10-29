import { UserProfile, DailyTargets } from '../types';
import { EGYPTIAN_FOODS } from '../data/egyptianFoods';

export const STORAGE_KEYS = {
  PROFILE: 'pixelfit_profile_v2',
  MEALS: 'pixelfit_meals_v2',
  WEIGHTS: 'pixelfit_weights_v2',
  WATER: 'pixelfit_water_v2',
  THEME: 'pixelfit_theme_v2',
  GAMIFICATION: 'pixelfit_gamification_v2',
  CHALLENGES: 'pixelfit_challenges_v2',
  CUSTOM_FOODS: 'pixelfit_custom_foods_v2',
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLast7DaysKeys(): string[] {
  const keys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    keys.push(`${year}-${month}-${day}`);
  }
  return keys;
}

export function calculateTargets(profile: UserProfile): {
  targets: DailyTargets;
  idealRange: { min: number; max: number; optimal: number };
  diff: number;
  timeEstimate: string;
  advice: string;
} {
  const { gender, age, height, weight, activity, goal, targetWeightInput } = profile;

  const hM = height / 100;
  const minIdeal = parseFloat((18.5 * hM * hM).toFixed(1));
  const maxIdeal = parseFloat((24.9 * hM * hM).toFixed(1));
  const optimalIdeal = Math.round(22 * hM * hM);

  const customTarget = parseFloat(targetWeightInput);
  const targetWeight = !isNaN(customTarget) && customTarget > 30 ? customTarget : optimalIdeal;

  const diff = parseFloat((weight - targetWeight).toFixed(1));

  let timeEstimate = '';
  let advice = '';

  if (Math.abs(diff) <= 0.8) {
    timeEstimate = 'أنت في النطاق المثالي!';
    advice = `وزنك الحالي (${weight} كجم) ممتاز ومتناسق تماماً مع طولك (${height} سم). ركز على تثبيت الوزن وبناء لياقة عضلية.`;
  } else if (diff > 0) {
    const rate = Math.abs(goal) > 0 ? (Math.abs(goal) * 7) / 7700 : 0.5;
    const weeks = Math.max(1, Math.ceil(diff / rate));
    const months = (weeks / 4.3).toFixed(1);
    timeEstimate = `في حوالي ${weeks} أسبوع (~${months} شهر)`;
    advice = `المستهدف الوصول لـ ${targetWeight} كجم بنزول تدريجي صحي. التزم بعجز سعرات منتظم وركز على البروتين لحماية عضلاتك.`;
  } else {
    const gain = Math.abs(diff);
    const weeks = Math.max(1, Math.ceil(gain / 0.35));
    timeEstimate = `في حوالي ${weeks} أسبوع`;
    advice = `المستهدف هو ${targetWeight} كجم مع تمرين مقاومة وزيادة تدريجية في السعرات لبناء كتلة عضلية صافية.`;
  }

  // Mifflin - St Jeor formula
  const bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
  const tdee = Math.round(bmr * activity);
  const targetCal = Math.max(1200, Math.round(tdee + goal));

  // Protein calculation: ~2g per kg of target weight
  const targetPro = Math.round(targetWeight * 2);
  // Fats: ~25% of calories
  const targetFat = Math.round((targetCal * 0.25) / 9);
  // Carbs: remaining calories
  const targetCarb = Math.max(50, Math.round((targetCal - targetPro * 4 - targetFat * 9) / 4));

  // Water: ~35ml per kg + activity bonus rounded to 250ml cup
  const baseWater = weight * 35;
  const activityBonus = activity > 1.5 ? 500 : 250;
  const targetWater = Math.ceil((baseWater + activityBonus) / 250) * 250;

  return {
    targets: {
      cal: targetCal,
      pro: targetPro,
      carb: targetCarb,
      fat: targetFat,
      water: targetWater,
    },
    idealRange: {
      min: minIdeal,
      max: maxIdeal,
      optimal: optimalIdeal,
    },
    diff,
    timeEstimate,
    advice,
  };
}

export function parseOfflineEgyptianFood(text: string): {
  items: Array<{ name: string; cal: number; pro: number; carb: number; fat: number }>;
  total: { cal: number; pro: number; carb: number; fat: number };
} {
  const normalized = text
    .replace(/بيضتين|اتنين بيض|2 بيض/g, '2 بيضة')
    .replace(/رغيفين/g, '2 رغيف')
    .replace(/نص رغيف|نصف رغيف/g, '0.5 رغيف')
    .replace(/ربع رغيف/g, '0.25 رغيف')
    .replace(/قرصين طعمية|اتنين طعمية/g, '2 طعمية');

  const matchedItems: Array<{ name: string; cal: number; pro: number; carb: number; fat: number }> = [];
  const total = { cal: 0, pro: 0, carb: 0, fat: 0 };

  EGYPTIAN_FOODS.forEach((food) => {
    const key = food.keys.find((k) => normalized.includes(k));
    if (key) {
      let qty = 1;
      const regexGram = new RegExp(`(\\d+)\\s*(?:جم|جرام)\\s*(?:من\\s*)?${key}`);
      const regexCount = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${key}`);

      if (regexGram.test(normalized)) {
        qty = parseFloat(normalized.match(regexGram)![1]) / 100;
      } else if (regexCount.test(normalized)) {
        qty = parseFloat(normalized.match(regexCount)![1]);
      }

      const c = Math.round(food.cal * qty);
      const p = parseFloat((food.pro * qty).toFixed(1));
      const cb = parseFloat((food.carb * qty).toFixed(1));
      const f = parseFloat((food.fat * qty).toFixed(1));

      matchedItems.push({
        name: `${food.name} (×${qty})`,
        cal: c,
        pro: p,
        carb: cb,
        fat: f,
      });

      total.cal += c;
      total.pro += p;
      total.carb += cb;
      total.fat += f;
    }
  });

  if (normalized.includes('أومليت') || normalized.includes('سمنة') || normalized.includes('مقلي')) {
    matchedItems.push({ name: 'دهون طهي / سمنة تقديرية', cal: 50, pro: 0, carb: 0, fat: 5.5 });
    total.cal += 50;
    total.fat += 5.5;
  }

  return { items: matchedItems, total };
}
