import React, { useState } from 'react';
import { EgyptianFood, Language } from '../types';
import { EGYPTIAN_FOODS } from '../data/egyptianFoods';
import { TRANSLATIONS } from '../i18n/translations';
import { Search, Plus, Sliders, Check, Sparkles, X } from 'lucide-react';

interface FoodsGalleryViewProps {
  onAddMeal: (title: string, cal: number, pro: number, carb: number, fat: number) => void;
  customFoods: EgyptianFood[];
  onAddCustomFood: (food: EgyptianFood) => void;
  language: Language;
}

export const FoodsGalleryView: React.FC<FoodsGalleryViewProps> = ({
  onAddMeal,
  customFoods,
  onAddCustomFood,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<EgyptianFood | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [customGrams, setCustomGrams] = useState<number>(100);
  const [useGrams, setUseGrams] = useState<boolean>(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // New custom food form state
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCal, setNewFoodCal] = useState('');
  const [newFoodPro, setNewFoodPro] = useState('');
  const [newFoodCarb, setNewFoodCarb] = useState('');
  const [newFoodFat, setNewFoodFat] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<EgyptianFood['category']>('غداء مصري');

  const categories = [
    { id: 'all', label: isEn ? 'All Foods' : 'الكل' },
    { id: 'فطار وشعبي', label: isEn ? 'Breakfast & Traditional 🫘' : 'فطار وشعبي 🫘' },
    { id: 'غداء مصري', label: isEn ? 'Lunch & Casseroles 🍲' : 'غداء وطواجن 🍲' },
    { id: 'مشويات وبروتين', label: isEn ? 'Grills & Protein 🍗' : 'مشويات وبروتين 🍗' },
    { id: 'سناكس ومشروبات', label: isEn ? 'Snacks & Drinks 🥤' : 'سناكس وحلويات 🥤' },
  ];

  const allFoods = [...customFoods, ...EGYPTIAN_FOODS];

  const filteredFoods = allFoods.filter((f) => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.nameEn && f.nameEn.toLowerCase().includes(q)) ||
      f.keys.some((k) => k.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const handleOpenPortionModal = (food: EgyptianFood) => {
    setSelectedFood(food);
    setPortionMultiplier(1);
    setCustomGrams(food.standardGrams || 100);
    setUseGrams(false);
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;

    let cal: number;
    let pro: number;
    let carb: number;
    let fat: number;
    let label: string;

    const baseName = isEn ? (selectedFood.nameEn || selectedFood.name) : selectedFood.name;

    if (useGrams) {
      const ratio = customGrams / selectedFood.standardGrams;
      cal = Math.round(selectedFood.cal * ratio);
      pro = Math.round(selectedFood.pro * ratio);
      carb = Math.round(selectedFood.carb * ratio);
      fat = Math.round(selectedFood.fat * ratio);
      label = `${baseName} (${customGrams} ${t.grams})`;
    } else {
      cal = Math.round(selectedFood.cal * portionMultiplier);
      pro = Math.round(selectedFood.pro * portionMultiplier);
      carb = Math.round(selectedFood.carb * portionMultiplier);
      fat = Math.round(selectedFood.fat * portionMultiplier);
      label =
        portionMultiplier === 1
          ? baseName
          : `${baseName} (×${portionMultiplier})`;
    }

    onAddMeal(label, cal, pro, carb, fat);
    setSelectedFood(null);
  };

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodCal) return;

    const newFood: EgyptianFood = {
      id: `custom-${Date.now()}`,
      name: newFoodName,
      nameEn: newFoodName,
      portion: isEn ? 'Custom Serving' : 'حصة مخصصة',
      portionEn: 'Custom Serving',
      standardGrams: 150,
      category: newFoodCategory,
      categoryEn: 'Lunch & Casseroles',
      cal: parseFloat(newFoodCal) || 0,
      pro: parseFloat(newFoodPro) || 0,
      carb: parseFloat(newFoodCarb) || 0,
      fat: parseFloat(newFoodFat) || 0,
      emoji: '🥗',
      keys: [newFoodName],
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    };

    onAddCustomFood(newFood);
    setShowAddCustomModal(false);
    setNewFoodName('');
    setNewFoodCal('');
    setNewFoodPro('');
    setNewFoodCarb('');
    setNewFoodFat('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍲</span>
              <h2 className="text-lg font-extrabold text-slate-100">{t.foodsTitle}</h2>
              <span className="brand-gradient text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                {isEn ? 'Accurate Macros' : 'محسوبة الماكروز'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{t.foodsSubtitle}</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className={`w-4 h-4 text-slate-400 absolute ${isEn ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full themed-input rounded-xl ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} py-2 text-xs font-bold focus:outline-none focus:border-[var(--brand-primary)]`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${isEn ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Add Custom Food Button */}
            <button
              onClick={() => setShowAddCustomModal(true)}
              className="brand-gradient text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition hover:opacity-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.customFoodBtn}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeCategory === c.id
                  ? 'brand-gradient text-white shadow-md'
                  : 'themed-input text-slate-300 hover:border-[var(--brand-primary)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFoods.map((food) => {
          const displayName = isEn ? (food.nameEn || food.name) : food.name;
          const displayPortion = isEn ? (food.portionEn || food.portion) : food.portion;

          return (
            <div
              key={food.id}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-primary)] transition group shadow-md"
            >
              {/* Card Header with Image */}
              <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                <img
                  src={food.img}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050720]/90 via-transparent to-black/30" />
                <span className={`absolute top-2.5 ${isEn ? 'left-2.5' : 'right-2.5'} bg-black/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-black font-mono tabular-nums shadow`}>
                  {food.emoji} {food.cal} {t.calories}
                </span>
                <span className={`absolute bottom-2 ${isEn ? 'left-2.5' : 'right-2.5'} text-[10px] text-slate-300 font-bold bg-black/50 px-2 py-0.5 rounded-md`}>
                  {displayPortion}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100 leading-snug line-clamp-1">
                    {displayName}
                  </h3>

                  {/* Macro Strip */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold font-mono tabular-nums mt-2.5 pt-2 border-t border-slate-700/30">
                    <div className="themed-input p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">{t.protein}</span>
                      <span className="text-sky-400 font-black">{food.pro}{t.grams}</span>
                    </div>
                    <div className="themed-input p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">{t.carbs}</span>
                      <span className="text-amber-400 font-black">{food.carb}{t.grams}</span>
                    </div>
                    <div className="themed-input p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">{t.fat}</span>
                      <span className="text-rose-400 font-black">{food.fat}{t.grams}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onAddMeal(displayName, food.cal, food.pro, food.carb, food.fat)}
                    className="flex-1 brand-gradient text-white text-xs font-bold py-2 rounded-xl shadow transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addPortion}</span>
                  </button>
                  <button
                    onClick={() => handleOpenPortionModal(food)}
                    title={t.portionCalculator}
                    className="themed-input hover:border-[var(--brand-primary)] text-slate-300 hover:text-white px-2.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="glass-panel rounded-2xl p-10 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="text-base font-bold text-slate-200">
            {isEn ? `No foods matching "${searchQuery}"` : `لا توجد نتائج مطابقة لـ "${searchQuery}"`}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isEn
              ? 'You can create a custom dish using the button above!'
              : 'يمكنك إضافة الأكلة التي تبحث عنها كوجبة مخصصة بالضغط على زر "أكلة مخصصة" بالأعلى!'}
          </p>
        </div>
      )}

      {/* Portion Customizer Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 border-2 border-[var(--brand-primary)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedFood.emoji}</span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">
                    {isEn ? (selectedFood.nameEn || selectedFood.name) : selectedFood.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">{t.portionCalculator}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-slate-400 hover:text-rose-400 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Modes */}
            <div className="flex gap-2">
              <button
                onClick={() => setUseGrams(false)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  !useGrams ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                {t.byMultiplier}
              </button>
              <button
                onClick={() => setUseGrams(true)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  useGrams ? 'brand-gradient text-white shadow' : 'themed-input text-slate-400'
                }`}
              >
                {t.byGrams}
              </button>
            </div>

            {/* Multiplier / Grams inputs */}
            {!useGrams ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1, 1.5, 2].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPortionMultiplier(m)}
                      className={`py-2 rounded-xl text-xs font-black transition cursor-pointer font-mono tabular-nums ${
                        portionMultiplier === m
                          ? 'brand-gradient text-white shadow-md'
                          : 'themed-input text-slate-300 hover:border-[var(--brand-primary)]'
                      }`}
                    >
                      {m === 0.5 ? '0.5x' : m === 1 ? '1x' : `×${m}`}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{isEn ? 'Scale:' : 'مضاعف حر:'}</span>
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.25"
                    value={portionMultiplier}
                    onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--brand-primary)]"
                  />
                  <span className="text-xs font-black font-mono tabular-nums text-amber-400 w-12 text-left">
                    ×{portionMultiplier}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-300 font-bold">{t.exactGrams}:</label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    step="10"
                    value={customGrams}
                    onChange={(e) => setCustomGrams(Math.max(1, parseFloat(e.target.value) || 100))}
                    className="flex-1 themed-input rounded-xl p-2.5 text-sm font-mono font-black"
                  />
                  <span className="text-xs text-slate-400">{t.grams}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 150, 200].map((g) => (
                    <button
                      key={g}
                      onClick={() => setCustomGrams(g)}
                      className="themed-input hover:border-[var(--brand-primary)] text-slate-300 text-xs font-bold py-1.5 rounded-xl font-mono tabular-nums"
                    >
                      {g} {t.grams}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculated Preview */}
            <div className="themed-input p-3.5 rounded-xl space-y-2">
              <span className="text-[11px] text-slate-400 block">{t.calculatedValues}</span>
              <div className="grid grid-cols-4 gap-2 text-center font-mono tabular-nums">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.calories}</span>
                  <span className="text-sm font-black text-slate-100" style={{ color: 'var(--brand-primary)' }}>
                    {useGrams
                      ? Math.round(selectedFood.cal * (customGrams / selectedFood.standardGrams))
                      : Math.round(selectedFood.cal * portionMultiplier)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.protein}</span>
                  <span className="text-sm font-black text-sky-400">
                    {useGrams
                      ? Math.round(selectedFood.pro * (customGrams / selectedFood.standardGrams))
                      : Math.round(selectedFood.pro * portionMultiplier)}
                    {t.grams}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.carbs}</span>
                  <span className="text-sm font-black text-amber-400">
                    {useGrams
                      ? Math.round(selectedFood.carb * (customGrams / selectedFood.standardGrams))
                      : Math.round(selectedFood.carb * portionMultiplier)}
                    {t.grams}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.fat}</span>
                  <span className="text-sm font-black text-rose-400">
                    {useGrams
                      ? Math.round(selectedFood.fat * (customGrams / selectedFood.standardGrams))
                      : Math.round(selectedFood.fat * portionMultiplier)}
                    {t.grams}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={handleConfirmAdd}
                className="flex-1 brand-gradient text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.addToLog}</span>
              </button>
              <button
                onClick={() => setSelectedFood(null)}
                className="themed-input text-slate-400 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Food Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveCustomFood}
            className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-2 border-[var(--brand-primary)] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-slate-100">{t.addCustomFoodTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-bold">{t.foodName}</label>
              <input
                type="text"
                placeholder={isEn ? 'e.g. Healthy Chicken Bowl' : 'مثال: شاورما بيتية صحية'}
                value={newFoodName}
                onChange={(e) => setNewFoodName(e.target.value)}
                required
                className="w-full themed-input rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">{t.calories}</label>
                <input
                  type="number"
                  placeholder="350"
                  value={newFoodCal}
                  onChange={(e) => setNewFoodCal(e.target.value)}
                  required
                  className="w-full themed-input rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">{t.category}</label>
                <select
                  value={newFoodCategory}
                  onChange={(e) => setNewFoodCategory(e.target.value as any)}
                  className="w-full themed-input rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="غداء مصري">{isEn ? 'Lunch & Casseroles' : 'غداء وطواجن'}</option>
                  <option value="فطار وشعبي">{isEn ? 'Breakfast & Traditional' : 'فطار وشعبي'}</option>
                  <option value="مشويات وبروتين">{isEn ? 'Grills & Protein' : 'مشويات وبروتين'}</option>
                  <option value="سناكس ومشروبات">{isEn ? 'Snacks & Drinks' : 'سناكس ومشروبات'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-sky-400 block mb-1 font-bold">{t.protein} ({t.grams})</label>
                <input
                  type="number"
                  placeholder="30"
                  value={newFoodPro}
                  onChange={(e) => setNewFoodPro(e.target.value)}
                  className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-amber-400 block mb-1 font-bold">{t.carbs} ({t.grams})</label>
                <input
                  type="number"
                  placeholder="25"
                  value={newFoodCarb}
                  onChange={(e) => setNewFoodCarb(e.target.value)}
                  className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-rose-400 block mb-1 font-bold">{t.fat} ({t.grams})</label>
                <input
                  type="number"
                  placeholder="8"
                  value={newFoodFat}
                  onChange={(e) => setNewFoodFat(e.target.value)}
                  className="w-full themed-input rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 brand-gradient text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition hover:opacity-95 cursor-pointer"
              >
                {t.saveInCatalog}
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="themed-input text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
