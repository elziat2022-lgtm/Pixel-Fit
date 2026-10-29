import React, { useState } from 'react';
import { WeightLog, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { LineChart, Plus, Copy, Download, Calendar, Check, Scale, Send, Mail } from 'lucide-react';

interface AnalyticsViewProps {
  weightLogs: WeightLog[];
  onAddWeightLog: (weight: number, date: string) => void;
  targetWeight: number;
  weeklyStats: {
    avgCal: number;
    avgPro: number;
    avgWater: number;
    weightChange: string;
    days: Array<{
      date: string;
      cal: number;
      pro: number;
      water: number;
      mealCount: number;
    }>;
  };
  language: Language;
  userEmail: string;
  userName: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  weightLogs,
  onAddWeightLog,
  targetWeight,
  weeklyStats,
  language,
  userEmail,
  userName,
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!isNaN(w) && w > 30 && w < 300) {
      onAddWeightLog(w, newDate);
      setNewWeight('');
    }
  };

  const formattedWeeklyReport = `📊 ${isEn ? 'PIXEL FIT Weekly Report' : 'تقرير PIXEL FIT الأسبوعي'} (${userName})
📅 ${new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}
- ${t.avgCalories}: ${weeklyStats.avgCal} ${t.calories}
- ${t.avgProtein}: ${weeklyStats.avgPro} ${t.grams}
- ${t.avgWater}: ${weeklyStats.avgWater} ${isEn ? 'ml' : 'مل'}
- ${t.weightVariation}: ${weeklyStats.weightChange}
- ${isEn ? 'Target Weight:' : 'الوزن المستهدف:'} ${targetWeight} ${isEn ? 'kg' : 'كجم'}

${isEn ? 'Daily Details:' : 'تفاصيل الأيام:'}
${weeklyStats.days
  .map(
    (d) =>
      `• ${d.date}: ${d.cal} ${t.calories} | ${d.pro}${t.grams} ${t.protein} | ${d.water}${isEn ? 'ml' : 'مل'} (${d.mealCount} ${isEn ? 'meals' : 'وجبات'})`
  )
  .join('\n')}
`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(formattedWeeklyReport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([formattedWeeklyReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PIXEL-FIT-Report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendToGmail = () => {
    const subject = encodeURIComponent(`${isEn ? 'PIXEL FIT Weekly Report' : 'تقرير PIXEL FIT الأسبوعي'} - ${userName}`);
    const body = encodeURIComponent(formattedWeeklyReport);
    const to = encodeURIComponent(userEmail || 'elziat2022@gmail.com');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    setShowEmailModal(false);
  };

  // SVG Chart calculation
  const sortedLogs = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sortedLogs.map((l) => l.weight);
  const minW = Math.min(...weights, targetWeight) - 2;
  const maxW = Math.max(...weights, targetWeight) + 2;
  const rangeW = maxW - minW || 1;

  const chartHeight = 200;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 30;

  const points = sortedLogs.map((log, idx) => {
    const x =
      sortedLogs.length === 1
        ? chartWidth / 2
        : paddingX + (idx / (sortedLogs.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((log.weight - minW) / rangeW) * (chartHeight - paddingY * 2);
    return { x, y, ...log };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const targetY =
    chartHeight -
    paddingY -
    ((targetWeight - minW) / rangeW) * (chartHeight - paddingY * 2);

  return (
    <div className="space-y-6">
      {/* 1. Weight Chart & Tracker */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/30 pb-3">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-[var(--brand-primary)]" />
            <div>
              <h3 className="text-base font-extrabold text-slate-100">{t.analyticsTitle}</h3>
              <p className="text-xs text-slate-400">{t.analyticsSubtitle}</p>
            </div>
          </div>

          {/* Quick Add Weight Form */}
          <form onSubmit={handleWeightSubmit} className="flex gap-2 w-full sm:w-auto no-print">
            <input
              type="number"
              step="0.1"
              placeholder={t.logWeightToday}
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
              className="themed-input rounded-xl px-3 py-1.5 text-xs font-mono font-bold w-32 focus:outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="themed-input rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
            />
            <button
              type="submit"
              className="brand-gradient text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow transition hover:opacity-95 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.logWeightBtn}</span>
            </button>
          </form>
        </div>

        {/* SVG Interactive Chart */}
        <div className="themed-input p-4 rounded-2xl overflow-x-auto">
          <div className="min-w-[480px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
              {/* Background horizontal grid lines */}
              {[minW, (minW + maxW) / 2, maxW].map((val, idx) => {
                const y =
                  chartHeight -
                  paddingY -
                  ((val - minW) / rangeW) * (chartHeight - paddingY * 2);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.15)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="Cairo"
                      textAnchor="end"
                    >
                      {val.toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              {/* Target Line */}
              <line
                x1={paddingX}
                y1={targetY}
                x2={chartWidth - paddingX}
                y2={targetY}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={chartWidth - paddingX + 5}
                y={targetY + 4}
                fill="#f59e0b"
                fontSize="10"
                fontFamily="Cairo"
                fontWeight="bold"
              >
                {isEn ? 'Goal' : 'الهدف'}: {targetWeight}k
              </text>

              {/* Area gradient under path */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {points.length > 1 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${
                    points[0].x
                  } ${chartHeight - paddingY} Z`}
                  fill="url(#chartGradient)"
                />
              )}

              {/* Line path */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="var(--brand-primary)"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:r-7 transition-all"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Cairo"
                    className="opacity-90"
                  >
                    {pt.weight} {isEn ? 'kg' : 'كجم'}
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="Cairo"
                  >
                    {pt.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 2. 7-Day Performance Matrix */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/30 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              {t.weeklyPerformance}
            </h3>
            <p className="text-xs text-slate-400">
              {t.weeklyPerformanceSubtitle}
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={() => setShowEmailModal(true)}
              className="brand-gradient text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow transition hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.sendGmailReport}</span>
            </button>
            <button
              onClick={handleCopyReport}
              className="themed-input hover:border-[var(--brand-primary)] text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedSuccess : t.copyReport}</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="themed-input hover:border-[var(--brand-primary)] text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadTxt}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="themed-input p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block">{t.avgCalories}</span>
            <span
              className="text-base md:text-lg font-black font-mono tabular-nums block mt-1"
              style={{ color: 'var(--brand-primary)' }}
            >
              {weeklyStats.avgCal} {t.calories}
            </span>
          </div>
          <div className="themed-input p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block">{t.avgProtein}</span>
            <span className="text-base md:text-lg font-black font-mono tabular-nums text-sky-400 block mt-1">
              {weeklyStats.avgPro} {t.grams}
            </span>
          </div>
          <div className="themed-input p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block">{t.avgWater}</span>
            <span className="text-base md:text-lg font-black font-mono tabular-nums text-cyan-400 block mt-1">
              {weeklyStats.avgWater} {isEn ? 'ml' : 'مل'}
            </span>
          </div>
          <div className="themed-input p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block">{t.weightVariation}</span>
            <span className="text-base md:text-lg font-black font-mono tabular-nums text-amber-400 block mt-1 flex items-center justify-center gap-1">
              <Scale className="w-4 h-4" />
              <span>{weeklyStats.weightChange}</span>
            </span>
          </div>
        </div>

        {/* 7-Day History Table */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {weeklyStats.days.map((d) => (
            <div
              key={d.date}
              className="flex justify-between items-center themed-input px-3.5 py-2.5 rounded-xl text-xs hover:border-[var(--brand-primary)] transition"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold font-mono tabular-nums text-slate-200">{d.date}</span>
                <span className="text-[10px] text-slate-400">({d.mealCount} {isEn ? 'meals' : 'وجبات'})</span>
              </div>
              <div className="flex items-center gap-3 font-mono tabular-nums font-bold">
                <span style={{ color: 'var(--brand-primary)' }}>🔥 {d.cal}</span>
                <span className="text-sky-400">🥩 {d.pro}{t.grams}</span>
                <span className="text-cyan-400">💧 {d.water}{isEn ? 'ml' : 'مل'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gmail Preview Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 space-y-4 border-2 border-[var(--brand-primary)] shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
                <h4 className="text-sm font-black text-slate-100">{t.previewEmailTitle}</h4>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400">
                {isEn ? 'To:' : 'إلى:'}{' '}
                <strong className="text-slate-200 font-mono">{userEmail || 'elziat2022@gmail.com'}</strong>
              </div>
              <div className="text-slate-400">
                {isEn ? 'Subject:' : 'الموضوع:'}{' '}
                <strong className="text-slate-200">
                  {isEn ? 'PIXEL FIT Weekly Report' : 'تقرير PIXEL FIT الأسبوعي'} - {userName}
                </strong>
              </div>
            </div>

            <pre className="themed-input p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-slate-200">
              {formattedWeeklyReport}
            </pre>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleSendToGmail}
                className="flex-1 brand-gradient text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.openInGmail}</span>
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="themed-input text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
