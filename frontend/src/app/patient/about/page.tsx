'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Phone, Award, Smile, Heart,
    Clock, Mail, Sparkles, ArrowRight,
    Play, ShieldCheck, Users, Star, Zap
} from 'lucide-react';
import Link from 'next/link';

// ── Ganti dengan gambar lokal Anda di public/images/bg/ ──────────────────
const BG_IMAGES = [
    '/images/bg/dental-bg-1.jpg',
    '/images/bg/dental-bg-2.jpg',
    '/images/bg/dental-bg-3.jpg',
];

// Fallback sementara (Unsplash) — hapus setelah upload gambar sendiri
const BG_FALLBACK = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070',
];

const features = [
    { icon: ShieldCheck, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional WHO' },
    { icon: Zap, title: 'AI Diagnosis', desc: 'Deteksi dini karies dengan akurasi 96%' },
    { icon: Heart, title: 'Ramah Pasien', desc: 'Prosedur minim rasa sakit & nyaman' },
    { icon: Users, title: 'Tim Profesional', desc: '15+ dokter spesialis berpengalaman' },
];

const gallery = [
    { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800', label: 'Ruang Perawatan' },
    { src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800', label: 'Tim Dokter' },
    { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800', label: 'Peralatan Modern' },
    { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800', label: 'Ruang Tunggu' },
];

export default function AboutPage() {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrentBg(p => (p + 1) % BG_FALLBACK.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen bg-[#EDF5F2] font-sans overflow-x-hidden">

            {/* ══ HERO — AUTO ROTATE BG ════════════════════════════════════ */}
            <div className="relative h-screen w-full overflow-hidden flex items-center">

                {/* Rotating background */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={currentBg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeInOut' }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src={BG_FALLBACK[currentBg]}
                            className="w-full h-full object-cover object-center"
                            alt="background"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlays persis seperti referensi */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0A1C14] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 h-40 z-[2] bg-gradient-to-t from-[#0A1C14] to-transparent" />

                {/* Dot indicators — bawah tengah */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[10] flex gap-2 items-center">
                    {BG_FALLBACK.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentBg(i)}
                            className={`rounded-full transition-all duration-300 ${currentBg === i
                                    ? 'w-7 h-2 bg-emerald-400'
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-[5] max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-lg space-y-6"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                            <Sparkles size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                Nauli Dental Care
                            </span>
                        </div>

                        {/* Judul — warna teks mengikuti referensi */}
                        <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tighter">
                            <span className="text-white">Tentang </span><br />
                            <span className="text-emerald-400">Nauli</span>
                            <span className="text-white"> Dental</span>
                        </h1>

                        <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-sm">
                            Inovasi perawatan gigi modern berbasis AI untuk hasil akurat,
                            aman, dan tanpa rasa sakit bersama tim medis profesional.
                        </p>

                        <div className="flex items-center gap-3 pt-2 flex-wrap">
                            <Link href="/patient/services">
                                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95">
                                    <Play size={14} className="fill-white" />
                                    Pilih Layanan
                                </button>
                            </Link>
                            <a href="#keunggulan">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/15 transition-all">
                                    Keunggulan Kami
                                    <ArrowRight size={14} />
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute bottom-8 right-10 z-[5] flex flex-col items-center gap-1.5"
                >
                    <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-emerald-400/50 rounded-full mt-2" />
                    </div>
                </motion.div>
            </div>

            {/* ══ KEUNGGULAN — 4 kolom tanpa card ═════════════════════════ */}
            <div id="keunggulan" className="max-w-7xl mx-auto px-6 sm:px-10 py-24">

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Mengapa Memilih Kami</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Keunggulan <span className="text-emerald-400">Layanan</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-[#0A1C14] px-8 py-10 group hover:bg-white/5 transition-all"
                        >
                            <f.icon size={24} className="text-emerald-400 mb-5 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ INFORMASI KLINIK — teks + gambar ════════════════════════ */}
            <div className="border-t border-white/8 py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Tentang Klinik</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">
                            Informasi <span className="text-emerald-400">Klinik</span> Kami
                        </h2>
                    </motion.div>

                    {/* Dua kolom: teks kiri, info kanan */}
                    <div className="grid md:grid-cols-2 gap-16 items-start mb-20">

                        {/* Kolom kiri — narasi */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <p className="text-white/60 text-base leading-relaxed">
                                <span className="text-emerald-400 font-bold">Nauli Dental Care</span> adalah klinik gigi modern berbasis kecerdasan buatan (AI) yang berlokasi di Balige, Sumatera Utara. Didirikan pada 2024, kami berkomitmen menghadirkan layanan kesehatan gigi berkualitas tinggi dengan teknologi terkini untuk masyarakat Toba dan sekitarnya.
                            </p>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Dengan dukungan lebih dari 15 dokter spesialis dan sistem booking digital 24 jam, kami memastikan setiap pasien mendapatkan pelayanan terbaik — cepat, aman, dan nyaman. Chatbot AI kami siap menjawab pertanyaan medis kapan saja.
                            </p>

                            {/* Stats inline */}
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/8">
                                {[
                                    { val: '2024', lbl: 'Berdiri' },
                                    { val: '15+', lbl: 'Dokter Spesialis' },
                                    { val: '2.4K+', lbl: 'Pasien Terlayani' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-black text-emerald-400">{s.val}</div>
                                        <div className="text-[10px] text-white/35 font-bold uppercase tracking-widest mt-1">{s.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Kolom kanan — kontak & jam */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {[
                                { icon: MapPin, label: 'Lokasi', val: 'Jl. Balige No. 12, Toba, Sumatera Utara' },
                                { icon: Phone, label: 'WhatsApp', val: '+62 821 6352 6363' },
                                { icon: Mail, label: 'Email', val: 'info@naulidental.ai' },
                            ].map(({ icon: Icon, label, val }, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Icon size={16} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{label}</p>
                                        <p className="text-white/70 text-sm mt-0.5">{val}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Jam operasional */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Clock size={16} className="text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Jam Operasional</p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-3">
                                            <span className="text-white/40 w-32">Senin – Jumat</span>
                                            <span className="text-white/70">08:00 – 21:00</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-white/40 w-32">Sabtu</span>
                                            <span className="text-white/70">09:00 – 17:00</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-white/40 w-32">Minggu</span>
                                            <span className="text-red-400/80">Tutup (Hanya Darurat)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Galeri foto klinik */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Galeri Klinik</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {gallery.map((g, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer"
                                >
                                    <img
                                        src={g.src}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={g.label}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-xs font-black text-white uppercase tracking-wider">{g.label}</p>
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ CTA ══════════════════════════════════════════════════════ */}
            <div className="border-t border-white/8 py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row items-center justify-between gap-10"
                    >
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">
                                Siap memulai perjalanan<br />
                                <span className="text-emerald-400">senyum sehat</span> Anda?
                            </h3>
                            <p className="text-white/40 text-sm mt-3">
                                Daftarkan diri Anda dan nikmati konsultasi pertama gratis.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <Link href="/patient/services">
                                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95">
                                    Lihat Layanan <ArrowRight size={15} />
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all">
                                    Daftar Gratis
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}