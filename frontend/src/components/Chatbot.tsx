'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, Send, X, Bot, User, Sparkles,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2, Menu, GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe untuk satu percakapan
interface Conversation {
    id: string;
    title: string;
    messages: { role: string; content: string }[];
    createdAt: number;
}

export default function Chatbot() {
    // State UI
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);

    // State data
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConvId, setCurrentConvId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [editTitleValue, setEditTitleValue] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);

    // --- Helper: Simpan ke localStorage ---
    const saveConversations = (newConvs: Conversation[]) => {
        localStorage.setItem('chatbot_conversations', JSON.stringify(newConvs));
        setConversations(newConvs);
    };

    // --- Inisialisasi / muat dari localStorage ---
    useEffect(() => {
        const stored = localStorage.getItem('chatbot_conversations');
        if (stored) {
            const parsed = JSON.parse(stored) as Conversation[];
            setConversations(parsed);
            if (parsed.length > 0) setCurrentConvId(parsed[0].id);
        } else {
            const defaultConv: Conversation = {
                id: Date.now().toString(),
                title: 'Percakapan Baru',
                messages: [{
                    role: 'bot',
                    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
                }],
                createdAt: Date.now()
            };
            setConversations([defaultConv]);
            setCurrentConvId(defaultConv.id);
        }
    }, []);

    // --- Simpan setiap ada perubahan percakapan ---
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    // --- Auto scroll ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [currentConvId, conversations, streamingText, isLoading]);

    // --- Dapatkan percakapan aktif ---
    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages || [];

    // --- Update percakapan (menambah pesan, dll) ---
    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(conv =>
            conv.id === currentConvId ? updater(conv) : conv
        ));
    };

    // --- Efek mengetik (typewriter) ---
    const simulateStreaming = (fullText: string, onFinish?: () => void) => {
        let index = 0;
        let current = "";
        const interval = setInterval(() => {
            if (index < fullText.length) {
                current += fullText[index];
                setStreamingText(current);
                index++;
            } else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({
                    ...conv,
                    messages: [...conv.messages, { role: 'bot', content: fullText }]
                }));
                setStreamingText('');
                onFinish?.();
            }
        }, 15);
    };

    // ========== FALLBACK RESPONSES (jika API gagal) ==========
    const getFallbackResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase();
        if (msg.includes('jadwal') || msg.includes('dokter') || msg.includes('praktik')) {
            return "Jadwal dokter praktek setiap Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik dokter, silakan hubungi reception kami di 0852-1234-5678.";
        } else if (msg.includes('lokasi') || msg.includes('alamat')) {
            return "Klinik Nauli Dental Care berada di Jl. Balige No. 12, Toba, Sumatera Utara. Buka pukul 08.00–20.00.";
        } else if (msg.includes('biaya') || msg.includes('harga') || msg.includes('scaling')) {
            return "Biaya scaling gigi mulai dari Rp 250.000 – Rp 450.000 tergantung kondisi. Untuk informasi lengkap, hubungi WA 0821-6352-6363.";
        } else if (msg.includes('daftar') || msg.includes('pendaftaran')) {
            return "Pendaftaran bisa dilakukan langsung lewat website kami atau datang ke klinik. Bisa juga booking via WhatsApp kami.";
        } else if (msg.includes('layanan') || msg.includes('service')) {
            return "Kami menyediakan: scaling, tambal gigi, cabut gigi, perawatan saluran akar, behel, veneer, dan implant.";
        } else {
            return "Maaf, saya sedang terputus dari server pusat. Namun silakan sampaikan pertanyaan Anda, nanti akan saya teruskan ke admin. Atau Anda bisa langsung menghubungi nomor WA kami 0821-6352-6363 untuk bantuan cepat.";
        }
    };

    // --- Kirim pesan (dengan fallback jika API error) ---
    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;

        // Tambahkan pesan user
        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { role: 'user', content: msg }],
            title: (conv.title === 'Percakapan Baru' && conv.messages.length === 1)
                ? msg.slice(0, 30) + (msg.length > 30 ? '...' : '')
                : conv.title
        }));
        setInput('');
        setIsLoading(true);

        // Ambil history terakhir (max 6)
        const historyForApi = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));

        try {
            // Coba panggil API dengan timeout 10 detik
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await api.post('/chatbot/chat', {
                message: msg,
                history: historyForApi
            }, { signal: controller.signal });

            clearTimeout(timeoutId);
            setIsLoading(false);
            simulateStreaming(response.data.reply);

        } catch (error: any) {
            console.error('API Chatbot error:', error);
            setIsLoading(false);

            // Gunakan fallback response lokal
            const fallbackReply = getFallbackResponse(msg);
            simulateStreaming(fallbackReply);
        }
    };

    // --- Buat percakapan baru ---
    const createNewChat = () => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            title: 'Percakapan Baru',
            messages: [{
                role: 'bot',
                content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
            }],
            createdAt: Date.now()
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConvId(newConv.id);
        setSearchQuery('');
        setEditingTitleId(null);
    };

    // --- Hapus percakapan ---
    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newConvs = conversations.filter(c => c.id !== id);
        if (newConvs.length === 0) {
            const defaultConv: Conversation = {
                id: Date.now().toString(),
                title: 'Percakapan Baru',
                messages: [{
                    role: 'bot',
                    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
                }],
                createdAt: Date.now()
            };
            setConversations([defaultConv]);
            setCurrentConvId(defaultConv.id);
        } else {
            setConversations(newConvs);
            if (currentConvId === id) setCurrentConvId(newConvs[0].id);
        }
    };

    // --- Ganti nama percakapan ---
    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(conv =>
            conv.id === id ? { ...conv, title: newTitle.slice(0, 40) } : conv
        ));
        setEditingTitleId(null);
    };

    // --- Filter percakapan berdasarkan search ---
    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // --- Resize sidebar ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = Math.min(500, Math.max(200, e.clientX));
            setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => setIsResizing(false);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Saran pertanyaan cepat
    const suggestions = [
        "Jadwal Dokter",
        "Lokasi Klinik",
        "Biaya Scaling",
        "Langkah Pendaftaran",
        "Informasi Layanan"
    ];

    // --- Jika chatbot tidak terbuka ---
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all z-[999] flex items-center gap-3 font-bold group"
            >
                <div className="relative">
                    <MessageCircle size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-600 animate-ping"></span>
                </div>
                <span>Tanya KlinikAI</span>
            </button>
        );
    }

    // --- Tampilan utama dengan sidebar ---
    return (
        <div className={`fixed transition-all duration-300 z-[999] flex bg-white shadow-2xl border border-slate-200 overflow-hidden
            ${isFull
                ? "inset-0 w-full h-full rounded-none"
                : "bottom-6 right-6 w-[95vw] md:w-[1000px] h-[700px] rounded-[2rem]"
            }`}>

            {/* Sidebar Riwayat */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: sidebarWidth, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden shrink-0 relative"
                        style={{ width: sidebarWidth }}
                    >
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">Riwayat Chat</h2>
                                <button
                                    onClick={createNewChat}
                                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari percakapan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredConversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => setCurrentConvId(conv.id)}
                                    className={`group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${currentConvId === conv.id
                                            ? 'bg-emerald-100 border border-emerald-200 shadow-sm'
                                            : 'hover:bg-slate-100'
                                        }`}
                                >
                                    <MessageCircle size={16} className="text-emerald-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        {editingTitleId === conv.id ? (
                                            <input
                                                type="text"
                                                value={editTitleValue}
                                                onChange={(e) => setEditTitleValue(e.target.value)}
                                                onBlur={() => renameConversation(conv.id, editTitleValue)}
                                                onKeyPress={(e) => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
                                                autoFocus
                                                className="w-full text-sm font-semibold bg-white border border-emerald-300 rounded px-1 py-0.5"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-700 truncate">{conv.title}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">
                                            {new Date(conv.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingTitleId(conv.id);
                                                setEditTitleValue(conv.title);
                                            }}
                                            className="p-1 text-slate-400 hover:text-emerald-600"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => deleteConversation(conv.id, e)}
                                            className="p-1 text-slate-400 hover:text-red-600"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredConversations.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-sm">Tidak ada percakapan</div>
                            )}
                        </div>

                        <div
                            ref={resizeRef}
                            onMouseDown={() => setIsResizing(true)}
                            className="absolute top-0 -right-1 w-2 h-full cursor-ew-resize hover:bg-emerald-300 transition bg-transparent z-50"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Area Chat Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 p-4 text-white flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-xl transition"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div>
                                {currentConv && (
                                    <div className="flex items-center gap-2">
                                        {editingTitleId === 'current' ? (
                                            <input
                                                type="text"
                                                value={editTitleValue}
                                                onChange={(e) => setEditTitleValue(e.target.value)}
                                                onBlur={() => {
                                                    renameConversation(currentConvId!, editTitleValue);
                                                    setEditingTitleId(null);
                                                }}
                                                onKeyPress={(e) => e.key === 'Enter' && renameConversation(currentConvId!, editTitleValue)}
                                                autoFocus
                                                className="bg-slate-800 text-white px-2 py-1 rounded text-sm font-bold"
                                            />
                                        ) : (
                                            <>
                                                <h3 className="font-black text-lg tracking-tight">{currentConv.title}</h3>
                                                <button
                                                    onClick={() => {
                                                        setEditingTitleId('current');
                                                        setEditTitleValue(currentConv.title);
                                                    }}
                                                    className="p-1 hover:bg-white/10 rounded"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Assistant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsFull(!isFull)} className="p-2 hover:bg-white/10 rounded-xl transition">
                            {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button onClick={() => { setIsOpen(false); setIsFull(false); }} className="p-2 hover:bg-red-500/20 rounded-xl transition">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Pesan */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-md">
                                    <Bot size={16} />
                                </div>
                            )}
                            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed whitespace-pre-wrap
                                ${msg.role === 'user'
                                    ? "bg-slate-800 text-white rounded-br-none shadow-xl"
                                    : "bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm"
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {streamingText && (
                        <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-md">
                                <Bot size={16} />
                            </div>
                            <div className="max-w-[85%] p-4 rounded-3xl rounded-bl-none text-sm font-medium leading-relaxed bg-white text-slate-700 border border-slate-200 shadow-sm whitespace-pre-wrap">
                                {streamingText}
                                <span className="inline-block w-2 h-4 ml-1 bg-emerald-600 animate-pulse align-middle"></span>
                            </div>
                        </div>
                    )}

                    {isLoading && !streamingText && (
                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-100 px-5 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5">
                                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input & Suggestions */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="max-w-5xl mx-auto w-full space-y-4">
                        {!isLoading && !streamingText && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {suggestions.map((text) => (
                                    <button
                                        key={text}
                                        onClick={() => handleSendMessage(text)}
                                        className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                                    >
                                        {text} <ChevronRight size={12} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-emerald-600">
                                <Sparkles size={20} />
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tanyakan jadwal dokter atau layanan..."
                                className="w-full pl-12 pr-16 py-5 bg-slate-100 border-none rounded-[2rem] text-sm focus:ring-2 focus:ring-emerald-600 outline-none transition text-slate-800 font-semibold"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || !!streamingText}
                                className="absolute right-2 p-3.5 bg-emerald-600 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg hover:rotate-12 active:scale-90 disabled:bg-slate-300"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}