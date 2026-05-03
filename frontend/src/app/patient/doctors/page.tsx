'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Clock, X, Stethoscope,
    Loader2, ArrowRight, Sparkles, UserRound, CalendarDays
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');

    const categories = ['Semua', 'Bedah Mulut', 'Orthodontist', 'Gigi Anak', 'Perawat'];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/clinic/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error('Gagal mengambil data dari database');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDocs = doctors.filter((d: any) => {
        const matchFilter =
            filter === 'Semua' ||
            d.specialty.toLowerCase().includes(filter.toLowerCase()) ||
            d.role.toLowerCase() === filter.toLowerCase();
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[#EDF5F2] pb-24 font-sans">

            {/* ── HERO HEADER ────────────────────────────────────────────── */}
            <div className="bg-slate-900 pt-24 pb-20 px-6 relative overflow-hidden">
                {/* Dekorasi blur */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-5 py-2 rounded-full">
                        <Sparkles size={13} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            Nauli Dental Care
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                        Tim Medis Kami
                    </h1>
                    <p className="text-slate-400 font-medium text-base max-w-md mx-auto">
                        Tenaga medis profesional dan berpengalaman siap memberikan pelayanan terbaik untuk Anda.
                    </p>
                </div>
            </div>

            {/* ── FILTER & SEARCH ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10 space-y-5 mb-12">
                {/* Search bar */}
                <div className="bg-white rounded-[1.5rem] border border-[#D4EDE5] shadow-sm p-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama dokter atau spesialisasi..."
                        className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl uppercase tracking-widest">
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
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === cat
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── GRID DOKTER ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6">
                {isLoading ? (
                    <div className="py-24 text-center flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-600" size={40} />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sinkronisasi Data...</p>
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div className="py-24 text-center space-y-3 opacity-40">
                        <UserRound size={48} className="mx-auto text-slate-400" />
                        <p className="font-black text-slate-500 uppercase tracking-[0.3em] text-xs italic">
                            Tidak ada data ditemukan
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredDocs.map((doc: any) => (
                            <motion.div
                                key={doc.id}
                                layoutId={`card-${doc.id}`}
                                onClick={() => setSelectedDoc(doc)}
                                whileHover={{ y: -6 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden cursor-pointer group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all"
                            >
                                {/* Foto */}
                                <div className="aspect-[4/5] bg-[#F5FAF7] relative overflow-hidden">
                                    <img
                                        src={doc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={doc.name}
                                    />
                                    {/* Role badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                                            {doc.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                                        {doc.specialty}
                                    </p>
                                    <h3 className="font-black text-slate-800 text-sm leading-tight uppercase italic group-hover:text-emerald-700 transition-colors">
                                        {doc.name}
                                    </h3>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {doc.experience || '3+'} thn pengalaman
                                        </span>
                                        <div className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        {/* Modal Card */}
                        <motion.div
                            layoutId={`card-${selectedDoc.id}`}
                            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#D4EDE5]"
                        >
                            {/* Tombol Close */}
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="absolute top-5 right-5 z-10 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm text-slate-400 hover:text-red-500 hover:border-red-200 transition-all active:scale-90"
                            >
                                <X size={18} />
                            </button>

                            {/* Kiri: Foto */}
                            <div className="w-full md:w-2/5 bg-[#F5FAF7] p-8 flex items-center justify-center">
                                <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                                    <img
                                        src={selectedDoc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoc.name}`}
                                        className="w-full h-full object-cover"
                                        alt={selectedDoc.name}
                                    />
                                </div>
                            </div>

                            {/* Kanan: Detail */}
                            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">

                                {/* Nama & Spesialisasi */}
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-4">
                                        <Stethoscope size={12} className="text-emerald-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                            {selectedDoc.specialty}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                                        {selectedDoc.name}
                                    </h2>
                                    <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-widest">
                                        {selectedDoc.experience || '3+'} Tahun Pengalaman Medis
                                    </p>
                                </div>

                                {/* Jadwal Praktik */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                                            <CalendarDays size={15} />
                                        </div>
                                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-[0.25em]">
                                            Jadwal Praktik Mingguan
                                        </h4>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedDoc.schedules && selectedDoc.schedules.length > 0 ? (
                                            selectedDoc.schedules.map((sch: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F5FAF7] border border-[#D4EDE5] p-4 rounded-2xl"
                                                >
                                                    <div className="flex items-center gap-2 w-36 font-black text-emerald-700 text-xs uppercase tracking-tight">
                                                        <CalendarClock size={15} className="text-emerald-500 flex-shrink-0" />
                                                        {sch.day}
                                                    </div>
                                                    <div className="flex items-center gap-2 w-36 font-bold text-slate-700 text-xs">
                                                        <Clock size={14} className="text-emerald-500 flex-shrink-0" />
                                                        {sch.time}
                                                    </div>
                                                    <div className="flex items-center gap-2 font-bold text-slate-400 text-xs uppercase tracking-tight">
                                                        <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
                                                        {sch.loc}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                                <p className="italic text-slate-400 text-xs font-black uppercase tracking-widest">
                                                    Jadwal belum dikonfigurasi admin.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="mt-8 flex gap-3">
                                    <Link href="/patient/dashboard" className="flex-1">
                                        <button className="w-full bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                                            Booking Sekarang
                                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setSelectedDoc(null)}
                                        className="px-5 py-4 rounded-2xl border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all font-black text-xs uppercase tracking-widest"
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