'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, ArrowUp, X, User,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2, Menu,
    ThumbsUp, ThumbsDown, Copy, Check,
    RotateCcw, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: string;
    content: string;
    id: string;
    liked?: boolean | null;
    copied?: boolean;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}

// ── Konstanta ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'chatbot_conversations';

const INITIAL_MSG = (suffix = ''): Message => ({
    id: 'init-' + Date.now() + suffix,
    role: 'bot',
    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAI, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?',
    liked: null,
});

const SUGGESTIONS = ['Jadwal Dokter', 'Lokasi Klinik', 'Biaya Scaling', 'Langkah Pendaftaran', 'Informasi Layanan'];

// ── Klinik Logo (pakai file asli dari public/images/) ─────────────────────
function ClinicLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
    return (
        <img
            src="/images/icon.png"
            alt="Nauli Dental Care"
            width={size}
            height={size}
            className={`object-contain ${className}`}
        />
    );
}

// ── Avatar bot kecil (logo dalam lingkaran teal) ──────────────────────────
function BotAvatar({ size = 32 }: { size?: number }) {
    return (
        <div className="shrink-0 rounded-xl bg-transparent border border-slate-100 ...">
            <ClinicLogo size={size} />   {/* ← size penuh, tanpa dikurangi */}
        </div>
    );
}

// ── Divider antar pesan ───────────────────────────────────────────────────
function MessageDivider() {
    return <div className="h-px bg-slate-100 mx-6" />;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(220);
    const [isResizing, setIsResizing] = useState(false);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConvId, setCurrentConvId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [editTitleValue, setEditTitleValue] = useState('');

    const feedbackInFlight = useRef<Set<string>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ── Init ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Conversation[];
                if (parsed.length > 0) { setConversations(parsed); setCurrentConvId(parsed[0].id); return; }
            } catch { /* corrupt */ }
        }
        const def: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG()], createdAt: Date.now() };
        setConversations([def]);
        setCurrentConvId(def.id);
    }, []);

    useEffect(() => {
        if (conversations.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [currentConvId, conversations, streamingText, isLoading]);

    // ── Resize sidebar ────────────────────────────────────────────────────
    useEffect(() => {
        const onMove = (e: MouseEvent) => { if (isResizing) setSidebarWidth(Math.min(320, Math.max(180, e.clientX))); };
        const onUp = () => setIsResizing(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isResizing]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── Lock scroll halaman saat chatbot terbuka ──────────────────────────────
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // cleanup saat komponen unmount
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── Helpers ───────────────────────────────────────────────────────────
    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages ?? [];

    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(c => c.id === currentConvId ? updater(c) : c));
    };

    // ── Reaction ──────────────────────────────────────────────────────────
    const handleReaction = async (msgId: string, reaction: boolean) => {
        if (feedbackInFlight.current.has(msgId)) return;
        const botMsg = messages.find(m => m.id === msgId);
        const botIdx = messages.findIndex(m => m.id === msgId);
        const userMsg = botIdx > 0 ? messages[botIdx - 1] : null;
        if (!botMsg) return;
        const currentLiked = botMsg.liked;
        const newLiked: boolean | null = currentLiked === reaction ? null : reaction;
        updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, liked: newLiked } : m) }));
        if (newLiked !== null) {
            feedbackInFlight.current.add(msgId);
            try {
                await api.post('/chatbot/log-feedback', { session_id: currentConvId, user_message: userMsg?.content ?? '', bot_response: botMsg.content, feedback: newLiked });
            } catch (err) {
                console.warn('Gagal mengirim feedback:', err);
                updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, liked: currentLiked } : m) }));
            } finally { feedbackInFlight.current.delete(msgId); }
        }
    };

    // ── Copy ──────────────────────────────────────────────────────────────
    const fallbackCopy = (text: string) => {
        const el = document.createElement('textarea'); el.value = text; el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.focus(); el.select();
        try { document.execCommand('copy'); } catch { /* noop */ }
        document.body.removeChild(el);
    };
    const handleCopy = (msgId: string, text: string) => {
        navigator.clipboard?.writeText(text).catch(() => fallbackCopy(text)) ?? fallbackCopy(text);
        updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: true } : m) }));
        setTimeout(() => updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: false } : m) })), 2000);
    };

    // ── Streaming ─────────────────────────────────────────────────────────
    const simulateStreaming = (fullText: string) => {
        const newMsgId = 'bot-' + Date.now();
        let index = 0, current = '';
        const interval = setInterval(() => {
            if (index < fullText.length) { current += fullText[index++]; setStreamingText(current); }
            else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({ ...conv, messages: [...conv.messages, { id: newMsgId, role: 'bot', content: fullText, liked: null }] }));
                setStreamingText('');
            }
        }, 15);
    };

    // ── Fallback ──────────────────────────────────────────────────────────
    const getFallbackResponse = (msg: string) => {
        const m = msg.toLowerCase();
        if (m.includes('jadwal') || m.includes('dokter')) return 'Jadwal dokter praktek Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik, hubungi 0852-1234-5678.';
        if (m.includes('lokasi') || m.includes('alamat')) return 'Nauli Dental Care di Jl. Balige No. 12, Toba, Sumatera Utara. Buka 08.00–20.00.';
        if (m.includes('biaya') || m.includes('scaling')) return 'Biaya scaling Rp 250.000–450.000. Info lengkap: WA 0821-6352-6363.';
        if (m.includes('daftar') || m.includes('booking')) return 'Pendaftaran via website atau langsung ke klinik. Bisa juga booking via WhatsApp.';
        if (m.includes('layanan')) return 'Layanan: scaling, tambal, cabut, saluran akar, behel, veneer, dan implant.';
        return 'Maaf, sedang ada gangguan koneksi. Hubungi WA 0821-6352-6363 untuk bantuan cepat.';
    };

    // ── Kirim pesan ───────────────────────────────────────────────────────
    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;
        const userMsgId = 'user-' + Date.now();
        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { id: userMsgId, role: 'user', content: msg }],
            title: conv.title === 'Percakapan Baru' && conv.messages.length === 1 ? msg.slice(0, 32) + (msg.length > 32 ? '…' : '') : conv.title,
        }));
        setInput('');
        setIsLoading(true);
        try {
            const cleanHistory = messages.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));
            const res = await api.post('/chatbot/chat', { message: msg, history: cleanHistory });
            setIsLoading(false);
            simulateStreaming(res.data.reply);
        } catch { setIsLoading(false); simulateStreaming(getFallbackResponse(msg)); }
    };

    // ── Manajemen percakapan ──────────────────────────────────────────────
    const createNewChat = () => {
        const c: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG('-new')], createdAt: Date.now() };
        setConversations(prev => [c, ...prev]); setCurrentConvId(c.id); setSearchQuery(''); setEditingTitleId(null);
    };
    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = conversations.filter(c => c.id !== id);
        if (next.length === 0) { const d: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG()], createdAt: Date.now() }; setConversations([d]); setCurrentConvId(d.id); }
        else { setConversations(next); if (currentConvId === id) setCurrentConvId(next[0].id); }
    };
    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.slice(0, 40) } : c)); setEditingTitleId(null);
    };
    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ══════════════════════════════════════════════════════════════════════
    // FAB — mirip "Ask AI" di referensi
    // ══════════════════════════════════════════════════════════════════════
    if (!isOpen) return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] group
                   flex flex-col items-center gap-2
                   w-[88px] py-4 px-3 rounded-[22px]
                   shadow-2xl transition-all duration-250
                   bg-[#0f1a14] hover:bg-emerald-600
                   border border-white/8 hover:border-emerald-400/40"
        >
            {/* ── Icon box — gelap default, putih/teal saat hover ── */}
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden
                        flex items-center justify-center
                        bg-emerald-600 group-hover:bg-white/20
                        transition-all duration-250 shadow-lg">

                {/* Logo klinik */}
                <ClinicLogo size={44} />

                {/* Status dot online — pojok kanan atas */}
                <span className="absolute top-1 right-1 flex items-center justify-center">
                    <span className="animate-ping absolute w-2.5 h-2.5 rounded-full bg-emerald-300 opacity-60" />
                    <span className="relative w-2 h-2 rounded-full bg-emerald-400 border border-white/60" />
                </span>
            </div>

            {/* Label */}
            <span className="text-[12px] font-black text-white/90 group-hover:text-white
                         tracking-wide leading-none transition-colors duration-200">
                Tanya AI
            </span>

            {/* Online indicator teks */}
            <span className="text-[9px] font-bold text-emerald-400 group-hover:text-emerald-200
                         uppercase tracking-widest leading-none transition-colors duration-200">
                ONLINE
            </span>
        </motion.button>
    );

    // ══════════════════════════════════════════════════════════════════════
    // CHATBOT WINDOW — light/white modal seperti referensi
    // ══════════════════════════════════════════════════════════════════════
    return (
        <AnimatePresence>
            {/* Backdrop overlay — HANYA untuk estetik, tidak menutup chatbot saat diklik */}
            {!isFull && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9990] bg-black/30 backdrop-blur-[2px] pointer-events-none"
                />
            )}

            <motion.div
                key="chatbot"
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className={`fixed z-[9999] flex bg-white overflow-hidden
                    ${isFull
                        ? 'inset-0 rounded-none shadow-none'
                        : 'bottom-6 right-6 w-[95vw] md:w-[860px] h-[600px] rounded-2xl shadow-2xl border border-slate-200'
                    }`}
                /* ← kunci: pointer-events aktif agar tidak ikut scroll */
                style={{ touchAction: 'none' }}
            >
                {/* ══ SIDEBAR riwayat ══════════════════════════════════════ */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ width: sidebarWidth, borderRight: '1px solid #e2e8f0', minWidth: 0 }}
                            className="h-full flex flex-col overflow-hidden shrink-0 relative bg-slate-50"
                        >
                            {/* Sidebar header */}
                            <div className="px-3 py-3 border-b border-slate-200 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Riwayat</span>
                                    <button
                                        onClick={createNewChat}
                                        className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition flex items-center justify-center"
                                        title="Chat baru"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari percakapan..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-600 placeholder-slate-400
                                                   bg-white border border-slate-200 rounded-lg
                                                   focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                    />
                                </div>
                            </div>

                            {/* Daftar percakapan */}
                            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
                                {filteredConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setCurrentConvId(conv.id)}
                                        className={`group flex items-start gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all
                                            ${currentConvId === conv.id
                                                ? 'bg-teal-50 border border-teal-200'
                                                : 'hover:bg-white border border-transparent'}`}
                                    >
                                        <div className={`shrink-0 mt-0.5 rounded-md overflow-hidden transition-all ${currentConvId === conv.id ? 'opacity-100' : 'opacity-40'}`}>
                                            <ClinicLogo size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {editingTitleId === conv.id
                                                ? <input type="text" value={editTitleValue} autoFocus
                                                    onChange={e => setEditTitleValue(e.target.value)}
                                                    onBlur={() => renameConversation(conv.id, editTitleValue)}
                                                    onKeyDown={e => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
                                                    className="w-full text-xs bg-white text-slate-700 border border-teal-300 rounded px-1 py-0.5 outline-none"
                                                />
                                                : <p className={`text-xs font-semibold truncate ${currentConvId === conv.id ? 'text-teal-800' : 'text-slate-600'}`}>{conv.title}</p>
                                            }
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                                            <button onClick={e => { e.stopPropagation(); setEditingTitleId(conv.id); setEditTitleValue(conv.title); }}
                                                className="p-1 text-slate-400 hover:text-teal-500"><Edit2 size={10} /></button>
                                            <button onClick={e => deleteConversation(conv.id, e)}
                                                className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={10} /></button>
                                        </div>
                                    </div>
                                ))}
                                {filteredConversations.length === 0 && (
                                    <p className="text-center py-10 text-slate-400 text-xs">Tidak ada percakapan</p>
                                )}
                            </div>

                            {/* Resize handle */}
                            <div
                                onMouseDown={() => setIsResizing(true)}
                                className="absolute top-0 -right-1 w-2 h-full cursor-ew-resize hover:bg-teal-300/40 z-50"
                            />
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ══ AREA CHAT UTAMA ══════════════════════════════════════ */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                    {/* ── Header (seperti referensi) ── */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white shrink-0">
                        <div className="flex items-center gap-3">
                            {/* Toggle sidebar */}
                            <button
                                onClick={() => setIsSidebarOpen(v => !v)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title={isSidebarOpen ? 'Sembunyikan riwayat' : 'Tampilkan riwayat'}
                            >
                                {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                            </button>

                            {/* Logo klinik di header */}
                            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center">
                                <ClinicLogo size={36} />
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold text-slate-800 leading-none">
                                    {currentConv?.title === 'Percakapan Baru' ? 'Tanyakan pertanyaan Anda' : (currentConv?.title ?? 'KlinikAI')}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-medium">KlinikAI · Nauli Dental Care</span>
                                </div>
                            </div>
                        </div>

                        {/* Aksi kanan */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={createNewChat}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[12px] font-semibold transition"
                                title="Percakapan baru"
                            >
                                <RotateCcw size={13} /> <span className="hidden sm:inline">Chat Baru</span>
                            </button>
                            <button
                                onClick={() => setIsFull(v => !v)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title={isFull ? 'Perkecil' : 'Perbesar'}
                            >
                                {isFull ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                            </button>
                            <button
                                onClick={() => { setIsOpen(false); setIsFull(false); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                                title="Tutup"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* ── Pesan ── */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto bg-white"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
                    >
                        {messages.map((msg, i) => (
                            <div key={msg.id || i}>
                                {i > 0 && <MessageDivider />}

                                {msg.role === 'user' ? (
                                    /* ── Pesan user (kanan) ── */
                                    <div className="px-6 py-4 flex justify-end">
                                        <div className="flex items-end gap-2.5 max-w-[75%]">
                                            <div className="bg-teal-600 text-white text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-br-sm whitespace-pre-wrap shadow-sm">
                                                {msg.content}
                                            </div>
                                            <div className="w-7 h-7 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mb-0.5">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Pesan bot (kiri) ── */
                                    <div className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <BotAvatar size={34} />
                                            <div className="flex-1 min-w-0">
                                                {/* Nama bot */}
                                                <p className="text-[11px] font-bold text-teal-700 mb-1.5 flex items-center gap-1.5">
                                                    KlinikAI
                                                    <span className="text-slate-300">·</span>
                                                    <span className="text-slate-400 font-normal">Nauli Dental Care</span>
                                                </p>
                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">
                                                    {msg.content}
                                                </p>

                                                {/* ── Action bar (Good / Bad / Copy) seperti referensi ── */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => handleReaction(msg.id, true)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all
                                                            ${msg.liked === true
                                                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                                                : 'text-slate-500 border-slate-200 hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50'}`}
                                                    >
                                                        <ThumbsUp size={12} className={msg.liked === true ? 'fill-teal-600' : ''} />
                                                        Jawaban baik
                                                    </button>
                                                    <button
                                                        onClick={() => handleReaction(msg.id, false)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all
                                                            ${msg.liked === false
                                                                ? 'bg-red-50 text-red-600 border-red-200'
                                                                : 'text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50'}`}
                                                    >
                                                        <ThumbsDown size={12} className={msg.liked === false ? 'fill-red-500' : ''} />
                                                        Kurang tepat
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(msg.id, msg.content)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                                    >
                                                        {msg.copied
                                                            ? <><Check size={12} className="text-teal-600" /><span className="text-teal-600">Tersalin</span></>
                                                            : <><Copy size={12} /> Salin</>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Streaming */}
                        {streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <BotAvatar size={34} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-teal-700 mb-1.5">KlinikAI</p>
                                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {streamingText}
                                                <span className="inline-block w-1 h-4 ml-0.5 bg-teal-500 animate-pulse align-middle rounded-sm" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Loading dots */}
                        {isLoading && !streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4 flex items-center gap-3">
                                    <BotAvatar size={34} />
                                    <div className="flex gap-1.5 py-1">
                                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="h-4" />
                    </div>

                    {/* ── Input area (seperti referensi) ── */}
                    <div className="px-5 pb-4 pt-3 border-t border-slate-200 bg-white shrink-0">
                        {/* Suggestions chips */}
                        {!isLoading && !streamingText && (
                            <div className="flex gap-2 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
                                {SUGGESTIONS.map(text => (
                                    <button
                                        key={text}
                                        onClick={() => handleSendMessage(text)}
                                        className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5
                                                   bg-slate-50 hover:bg-teal-50
                                                   border border-slate-200 hover:border-teal-300
                                                   text-slate-500 hover:text-teal-700
                                                   text-[11px] font-semibold rounded-full transition-all"
                                    >
                                        {text} <ChevronRight size={10} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input box */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tanyakan sesuatu..."
                                className="flex-1 text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none py-1"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || !!streamingText || !input.trim()}
                                className="w-8 h-8 rounded-lg flex items-center justify-center
                                           bg-teal-600 text-white hover:bg-teal-700
                                           disabled:opacity-40 disabled:cursor-not-allowed
                                           transition-all hover:scale-105 active:scale-95"
                            >
                                <ArrowUp size={15} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                                <ClinicLogo size={14} />
                                <p className="text-[10px] text-slate-400 font-medium">Nauli Dental Care</p>
                            </div>
                            <p className="text-[10px] text-slate-400">
                                KlinikAI dapat membuat kesalahan. Verifikasi info penting.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}