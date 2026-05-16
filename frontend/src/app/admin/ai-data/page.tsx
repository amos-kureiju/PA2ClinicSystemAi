'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    ThumbsUp, ThumbsDown, MessageSquare, BarChart3,
    RefreshCw, Loader2, Users, Star, Clock, AlertCircle,
    TrendingUp, Activity, Sparkles, CheckCircle2, XCircle,
    MessageCircleMore, Bot
} from 'lucide-react';

// ── Tipe data ─────────────────────────────────────────────────────────────
interface AiStats {
    total_interactions: number;
    total_sessions: number;
    likes: number;
    dislikes: number;
    rated: number;
    unrated: number;
    accuracy: number;
}

interface ChatHistoryItem {
    id: number;
    session_id: string | null;
    user_message: string;
    bot_response: string;
    feedback: boolean | null;
    feedback_label: string;
    created_at: string | null;
}

const DEFAULT_STATS: AiStats = {
    total_interactions: 0,
    total_sessions: 0,
    likes: 0,
    dislikes: 0,
    rated: 0,
    unrated: 0,
    accuracy: 0,
};

// ── Accuracy ring SVG ──────────────────────────────────────────────────────
function AccuracyRing({ value }: { value: number }) {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const fill = (value / 100) * circ;
    const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <svg width={128} height={128} className="-rotate-90">
            <circle cx={64} cy={64} r={r} stroke="#f1f5f9" strokeWidth={10} fill="none" />
            <circle
                cx={64} cy={64} r={r}
                stroke={color} strokeWidth={10} fill="none"
                strokeDasharray={`${fill} ${circ}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }}
            />
        </svg>
    );
}

export default function AdminAiDataPage() {
    const [stats, setStats] = useState<AiStats>(DEFAULT_STATS);
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'liked' | 'disliked' | 'unrated'>('all');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [countdown, setCountdown] = useState(30);

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchData = async (showSyncIndicator = false) => {
        if (showSyncIndicator) setIsSyncing(true);
        setError(null);
        try {
            const [resStats, resHistory] = await Promise.all([
                api.get('/chatbot/admin/stats'),
                api.get('/chatbot/admin/history?limit=30'),
            ]);
            setStats(resStats.data ?? DEFAULT_STATS);
            setHistory(resHistory.data ?? []);
            setLastSync(new Date().toLocaleTimeString('id-ID'));
        } catch (err: any) {
            console.error('Gagal sinkronisasi data AI:', err);
            setError('Gagal memuat data. Pastikan backend berjalan dan tabel chat_logs tersedia.');
        } finally {
            setIsLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (!autoRefresh) return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchData();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [autoRefresh]);

    // ── Filter history berdasarkan tab ────────────────────────────────────
    const filteredHistory = history.filter(item => {
        if (activeTab === 'liked') return item.feedback === true;
        if (activeTab === 'disliked') return item.feedback === false;
        if (activeTab === 'unrated') return item.feedback === null;
        return true;
    });

    const accuracyColor =
        stats.accuracy >= 80 ? 'text-emerald-600' :
            stats.accuracy >= 60 ? 'text-amber-500' : 'text-red-500';

    // ── Stat cards ────────────────────────────────────────────────────────
    const statCards = [
        {
            label: 'Total Interaksi',
            value: stats.total_interactions ?? 0,
            icon: MessageCircleMore,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            border: 'border-emerald-100',
            desc: 'Pesan masuk & keluar'
        },
        {
            label: 'Sesi Unik',
            value: stats.total_sessions ?? 0,
            icon: Users,
            iconBg: 'bg-teal-50',
            iconColor: 'text-teal-600',
            border: 'border-teal-100',
            desc: 'Pengguna berbeda'
        },
        {
            label: 'Dinilai Positif',
            value: stats.likes ?? 0,
            icon: ThumbsUp,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            border: 'border-emerald-100',
            desc: 'Jawaban disukai'
        },
        {
            label: 'Dinilai Negatif',
            value: stats.dislikes ?? 0,
            icon: ThumbsDown,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            border: 'border-red-100',
            desc: 'Perlu diperbaiki'
        },
    ];

    // ── Loading state ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                        <Bot size={28} className="text-emerald-500 animate-pulse" />
                    </div>
                    <Loader2 className="animate-spin text-emerald-500 mx-auto" size={24} />
                    <p className="text-sm text-slate-400 font-medium">Memuat data KlinikAI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                {/* Aksen bar kiri */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />

                <div className="relative z-10 pl-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                            <Sparkles size={11} className="text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                AI Intelligence Panel
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                            Data & Performa KlinikAI
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Statistik interaksi dan kualitas jawaban chatbot
                            {lastSync && (
                                <span className="ml-2 text-xs text-slate-400 font-medium">
                                    · Sinkron: {lastSync}
                                    {autoRefresh && (
                                        <span className="ml-1 text-emerald-400">· Auto-refresh aktif</span>
                                    )}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Live Indicator Animasi */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">

                        {/* Toggle LIVE / PAUSED */}
                        <button
                            onClick={() => {
                                setAutoRefresh(prev => !prev);
                                setCountdown(30);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold
                    border transition-all active:scale-95
                    ${autoRefresh
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {/* Dot pulse */}
                            <span className="relative flex items-center justify-center w-4 h-4">
                                {autoRefresh ? (
                                    <>
                                        <span className="animate-ping absolute inline-flex h-full w-full
                                     rounded-full bg-emerald-400 opacity-60" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                    </>
                                ) : (
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-300" />
                                )}
                            </span>
                            {autoRefresh ? `LIVE · ${countdown}s` : 'PAUSED'}
                        </button>

                        {/* Ring countdown SVG */}
                        {autoRefresh && (
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="absolute inset-0 -rotate-90" width="40" height="40">
                                    <circle cx="20" cy="20" r="16"
                                        stroke="#d1fae5" strokeWidth="3" fill="none" />
                                    <circle cx="20" cy="20" r="16"
                                        stroke="#10b981" strokeWidth="3" fill="none"
                                        strokeDasharray={`${2 * Math.PI * 16}`}
                                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - countdown / 30)}`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                                    />
                                </svg>
                                <RefreshCw
                                    size={14}
                                    className={`text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`}
                                    style={{
                                        transform: `rotate(${((30 - countdown) / 30) * 360}deg)`,
                                        transition: 'transform 0.9s linear'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Dekorasi ikon kanan */}
                <Activity
                    size={140}
                    className="absolute -right-6 -bottom-6 text-emerald-50 pointer-events-none"
                />
            </div>

            {/* ── Error banner ───────────────────────────────────────────── */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-xl"
                >
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                    <div>
                        <p className="font-semibold text-red-700">Gagal memuat data</p>
                        <p className="text-xs text-red-500 mt-0.5">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* ── Baris atas: Akurasi + Stat Cards ──────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Akurasi — card utama */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center
                               relative overflow-hidden shadow-lg"
                >
                    {/* Grid texture */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    <div className="relative z-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">
                            Akurasi Jawaban AI
                        </p>

                        {/* Ring SVG */}
                        <div className="relative inline-flex items-center justify-center mb-4">
                            <AccuracyRing value={stats.accuracy} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-black ${accuracyColor}`}>
                                    {stats.accuracy}%
                                </span>
                            </div>
                        </div>

                        {/* Like vs Dislike bar */}
                        <div className="w-full space-y-2">
                            <div className="flex items-center gap-2">
                                <ThumbsUp size={12} className="text-emerald-400 shrink-0" />
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                        style={{ width: stats.rated > 0 ? `${(stats.likes / stats.rated) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-xs text-white/60 w-6 text-right">{stats.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ThumbsDown size={12} className="text-red-400 shrink-0" />
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 rounded-full transition-all duration-700"
                                        style={{ width: stats.rated > 0 ? `${(stats.dislikes / stats.rated) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-xs text-white/60 w-6 text-right">{stats.dislikes}</span>
                            </div>
                        </div>

                        <p className="text-[10px] text-white/30 mt-3 font-medium">
                            Dari {stats.rated} jawaban yang dinilai
                        </p>
                    </div>
                </motion.div>

                {/* Stat Cards — 2x2 grid */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {statCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className={`bg-white rounded-2xl border ${card.border} shadow-sm p-5
                                            hover:shadow-md hover:border-emerald-200 transition-all group`}
                            >
                                <div className={`w-10 h-10 ${card.iconBg} ${card.iconColor} rounded-xl
                                                flex items-center justify-center mb-4
                                                group-hover:scale-110 transition-transform`}>
                                    <Icon size={18} />
                                </div>
                                <p className="text-3xl font-bold text-slate-800 leading-none">
                                    {(card.value ?? 0).toLocaleString()}
                                </p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                                    {card.label}
                                </p>
                                <p className="text-[10px] text-slate-300 mt-0.5">{card.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ── Riwayat Chat ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Header tabel */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                            <BarChart3 size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Riwayat Percakapan</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                {filteredHistory.length} dari {history.length} interaksi
                            </p>
                        </div>
                    </div>

                    {/* Tab filter */}
                    <div className="flex gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1">
                        {([
                            { key: 'all', label: 'Semua' },
                            { key: 'liked', label: '👍 Suka' },
                            { key: 'disliked', label: '👎 Tidak' },
                            { key: 'unrated', label: 'Belum' },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
                                    ${activeTab === tab.key
                                        ? 'bg-white shadow-sm text-emerald-700 border border-emerald-100'
                                        : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filteredHistory.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                            <MessageSquare size={24} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">Belum ada riwayat percakapan</p>
                        <p className="text-xs text-slate-300">Data akan muncul setelah pengguna berinteraksi dengan chatbot</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredHistory.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="px-6 py-4 hover:bg-[#F5FAF7] transition-colors"
                            >
                                {/* Baris atas: badge + waktu */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {/* Badge feedback */}
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold
                                            px-2.5 py-0.5 rounded-full
                                            ${item.feedback === true
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : item.feedback === false
                                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                            }`}>
                                            {item.feedback === true
                                                ? <><CheckCircle2 size={10} /> Membantu</>
                                                : item.feedback === false
                                                    ? <><XCircle size={10} /> Tidak Membantu</>
                                                    : <><Clock size={10} /> Belum Dinilai</>
                                            }
                                        </span>

                                        {/* Session ID kecil */}
                                        {item.session_id && (
                                            <span className="text-[9px] text-slate-300 font-mono">
                                                #{item.session_id.slice(-6)}
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-[10px] text-slate-300 font-medium">
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short',
                                                hour: '2-digit', minute: '2-digit',
                                            })
                                            : '—'}
                                    </span>
                                </div>

                                {/* Pertanyaan user */}
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <Users size={11} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                                        {item.user_message}
                                    </p>
                                </div>

                                {/* Jawaban bot */}
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot size={11} className="text-emerald-500" />
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        {item.bot_response}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {history.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
                        <p className="text-[10px] text-slate-300 font-medium text-center">
                            Menampilkan {filteredHistory.length} interaksi terbaru · Klik Sync Data untuk memperbarui
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}