'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Clock, X, Stethoscope,
    Loader2, ArrowRight, Sparkles, UserRound,
    CalendarDays, Play, Star
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');
    const [featured, setFeatured] = useState<any>(null);

    const categories = ['Semua', 'Bedah Mulut', 'Orthodontist', 'Gigi Anak', 'Perawat'];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/clinic/doctors');
                setDoctors(res.data);
                if (res.data.length > 0) setFeatured(res.data[0]);
            } catch (err: any) {
                console.error('Gagal mengambil data:', err?.response?.data || err?.message || err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDocs = doctors.filter((d: any) => {
        const matchFilter =
            filter === 'Semua' ||
            d.specialty?.toLowerCase().includes(filter.toLowerCase()) ||
            d.role?.toLowerCase() === filter.toLowerCase();
        const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className="min-h-screen font-sans overflow-x-clip bg-[#0A1C14]">

            {/* ══ HERO FULLSCREEN ══════════════════════════════════════════ */}
            <div className="relative w-full h-screen min-h-[600px] overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="/images/doctors.jpg"
                        alt="hero background"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Overlay layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-xl space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                    Nauli Dental Care
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tighter">
                                Tim Medis<br />
                                <span className="text-emerald-400">Terbaik</span> Kami
                            </h1>

                            {featured && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-bold text-sm">
                                            {featured.experience || '5'}+ Tahun
                                        </span>
                                    </div>
                                    <span className="text-white/30">•</span>
                                    <span className="text-white/60 text-sm">{featured.specialty}</span>
                                    <span className="text-white/30">•</span>
                                    <span className="text-emerald-400 text-sm font-bold">{featured.name}</span>
                                </div>
                            )}

                            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                                Tenaga medis profesional dan berpengalaman siap memberikan
                                pelayanan kesehatan gigi terbaik untuk Anda dan keluarga.
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => featured && setSelectedDoc(featured)}
                                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                                >
                                    <Play size={15} className="fill-white" />
                                    Lihat Profil
                                </button>
                                <a href="#daftar-dokter">
                                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/15 transition-all">
                                        Semua Dokter
                                        <ArrowRight size={14} />
                                    </button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Thumbnail strip kanan bawah */}
                <div className="absolute bottom-12 right-6 sm:right-10 flex items-end gap-2 z-10">
                    {(doctors as any[]).slice(0, 5).map((doc: any, i: number) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            onClick={() => setFeatured(doc)}
                            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${featured?.id === doc.id
                                    ? 'ring-2 ring-emerald-400 scale-110 z-10'
                                    : 'opacity-50 hover:opacity-80 hover:scale-105'
                                }`}
                        >
                            <img
                                src={doc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                className="w-12 h-16 sm:w-14 sm:h-20 object-cover"
                                alt={doc.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ DAFTAR DOKTER ═══════════════════════════════════════════ */}
            <div id="daftar-dokter" className="bg-[#EDF5F2] pb-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-12 space-y-6">

                    {/* Header section */}
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <h2 className="text-slate-900 font-black text-xl tracking-tight">Semua Dokter</h2>
                        <span className="text-emerald-600 text-sm font-bold">({filteredDocs.length})</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-3 bg-white border border-[#D4EDE5] rounded-2xl p-2 hover:border-emerald-400 transition-all shadow-sm">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama dokter atau spesialisasi..."
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/25 font-medium"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-xl uppercase tracking-wider">
                                {filteredDocs.length} hasil
                            </span>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${filter === cat
                                    ? 'bg-[#0A1C14] text-white border-[#0A1C14] shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-emerald-500" size={36} />
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Memuat data...</p>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="py-20 text-center space-y-3 opacity-30">
                            <UserRound size={44} className="mx-auto text-slate-400" />
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Tidak ada data</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {filteredDocs.map((doc: any) => (
                                <motion.div
                                    key={doc.id}
                                    layoutId={`card-${doc.id}`}
                                    onClick={() => setSelectedDoc(doc)}
                                    whileHover={{ scale: 1.04, y: -4 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                                >
                                    <div className="aspect-[2/3] bg-white/5 relative">
                                        <img
                                            src={doc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            alt={doc.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                        {/* Badge */}
                                        <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                            <span className="text-[9px] font-black text-white uppercase tracking-wider">{doc.role}</span>
                                        </div>

                                        {/* Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-black/95 to-transparent">
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">{doc.specialty}</p>
                                            <h3 className="text-white font-black text-sm leading-tight drop-shadow-lg">{doc.name}</h3>
                                            <p className="text-white/50 text-[10px] mt-1">{doc.experience || '3'}+ thn pengalaman</p>
                                        </div> 

                                        {/* Hover */}
                                        <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/25 scale-75 group-hover:scale-100 transition-transform">
                                                <ArrowRight size={16} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ══ DETAIL MODAL ════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={`card-${selectedDoc.id}`}
                            className="relative w-full max-w-4xl bg-[#0D2419] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white/50 hover:text-white transition-all"
                            >
                                <X size={17} />
                            </button>

                            {/* Foto */}
                            <div className="w-full md:w-2/5 relative min-h-[220px]">
                                <img
                                    src={selectedDoc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoc.name}`}
                                    className="w-full h-full object-cover"
                                    alt={selectedDoc.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#181818] hidden md:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent md:hidden" />
                            </div>

                            {/* Detail */}
                            <div className="w-full md:w-3/5 p-7 md:p-10 flex flex-col">
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full mb-4">
                                        <Stethoscope size={11} className="text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            {selectedDoc.specialty}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white leading-none tracking-tight">{selectedDoc.name}</h2>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-white/50 text-xs">{selectedDoc.experience || '3'}+ Tahun Pengalaman</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays size={13} className="text-emerald-400" />
                                        <h4 className="text-white/70 font-bold text-xs uppercase tracking-widest">Jadwal Praktik</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedDoc.schedules && selectedDoc.schedules.length > 0 ? (
                                            selectedDoc.schedules.map((sch: any, i: number) => (
                                                <div key={i} className="flex flex-wrap gap-3 bg-white/5 border border-white/8 p-3 rounded-xl">
                                                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold w-24">
                                                        <CalendarClock size={12} />{sch.day}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/60 text-xs w-24">
                                                        <Clock size={12} className="text-emerald-400" />{sch.time}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                                                        <MapPin size={11} className="text-emerald-400" />{sch.loc}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-5 rounded-xl border border-dashed border-white/10 text-center">
                                                <p className="text-white/25 text-xs uppercase tracking-widest">Jadwal belum dikonfigurasi</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-7 flex gap-3">
                                    <Link href="/patient/dashboard" className="flex-1">
                                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group">
                                            Booking Sekarang
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setSelectedDoc(null)}
                                        className="px-5 rounded-2xl border border-white/10 text-white/35 hover:text-white hover:border-white/25 transition-all text-sm font-bold"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CalendarClock({ size, className }: any) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}