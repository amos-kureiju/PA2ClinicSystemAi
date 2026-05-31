'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Phone, Award, Smile, Heart,
    Clock, Mail, Sparkles, ArrowRight,
    Play, ShieldCheck, Users, Star, Zap,
    CheckCircle2, Building2, CalendarDays, TrendingUp,
    ChevronRight, Activity
} from 'lucide-react';
import Link from 'next/link';

const BG_FALLBACK = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070',
];

const features = [
    { icon: ShieldCheck, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional WHO dengan protokol kebersihan ketat.' },
    { icon: Zap, title: 'AI Diagnosis', desc: 'Teknologi deteksi dini karies dan kelainan gigi dengan akurasi 96%.' },
    { icon: Heart, title: 'Ramah Pasien', desc: 'Prosedur minim rasa sakit dengan pendekatan personal dan nyaman.' },
    { icon: Users, title: 'Tim Profesional', desc: '15+ dokter spesialis berpengalaman dan bersertifikat nasional.' },
];

const gallery = [
    { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800', label: 'Ruang Perawatan' },
    { src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800', label: 'Tim Dokter' },
    { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800', label: 'Peralatan Modern' },
    { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800', label: 'Ruang Tunggu' },
];

const stats = [
    { val: '2024', lbl: 'Tahun Berdiri', icon: CalendarDays },
    { val: '15+', lbl: 'Dokter Spesialis', icon: Users },
    { val: '2.4K+', lbl: 'Pasien Terlayani', icon: Smile },
    { val: '96%', lbl: 'Tingkat Kepuasan', icon: TrendingUp },
];

const values = [
    'Pelayanan berbasis teknologi AI terkini',
    'Sterilisasi berstandar internasional WHO',
    'Konsultasi digital 24 jam via chatbot',
    'Tim dokter spesialis bersertifikat',
    'Booking online mudah & cepat',
    'Fasilitas modern & nyaman',
];

export default function AboutPage() {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrentBg(p => (p + 1) % BG_FALLBACK.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: '#EDF5F2' }}>

            {/* ══ HERO ═══════════════════════════════════════════════════ */}
            <div className="relative h-screen w-full overflow-hidden flex items-center">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={currentBg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeInOut' }}
                        className="absolute inset-0 z-0"
                    >
                        <img src={BG_FALLBACK[currentBg]} className="w-full h-full object-cover" alt="bg" />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#EDF5F2] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] bg-gradient-to-t from-[#EDF5F2] to-transparent" />

                {/* Dots */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[10] flex gap-2">
                    {BG_FALLBACK.map((_, i) => (
                        <button key={i} onClick={() => setCurrentBg(i)}
                            className={`rounded-full transition-all duration-300 ${currentBg === i ? 'w-7 h-2 bg-emerald-500' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-[5] max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-xl space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                            <Sparkles size={12} className="text-emerald-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                                Nauli Dental Care · Est. 2024
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tighter">
                            <span className="text-white">Tentang </span><br />
                            <span className="text-emerald-400">Nauli</span>
                            <span className="text-white"> Dental</span>
                        </h1>

                        <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-sm">
                            Klinik gigi modern berbasis AI di Balige — menghadirkan perawatan
                            akurat, aman, dan nyaman untuk keluarga Anda.
                        </p>

                        <div className="flex items-center gap-3 pt-2 flex-wrap">
                            <Link href="/patient/services">
                                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                                    <Play size={13} className="fill-white" /> Pilih Layanan
                                </button>
                            </Link>
                            <a href="#keunggulan">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 transition-all">
                                    Keunggulan Kami <ArrowRight size={13} />
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ STATS BAR ══════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-4 mb-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4
                                                 shadow-sm border border-emerald-100/80
                                                 hover:shadow-md hover:border-emerald-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <s.icon size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-800">{s.val}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.lbl}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ══ KEUNGGULAN ════════════════════════════════════════════ */}
            <div id="keunggulan" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Mengapa Memilih Kami</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Keunggulan <span className="text-emerald-600">Layanan</span> Kami
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg">
                        Kami menggabungkan teknologi AI mutakhir dengan sentuhan perawatan manusiawi untuk pengalaman dental terbaik.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl p-6 border border-emerald-100
                                       hover:shadow-lg hover:border-emerald-200 transition-all group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                <f.icon size={20} className="text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 mb-2">{f.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ INFORMASI KLINIK ══════════════════════════════════════ */}
            <div className="border-t border-emerald-100 py-24" style={{ backgroundColor: '#f7faf8' }}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10">

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Tentang Klinik</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Informasi <span className="text-emerald-600">Klinik</span> Kami
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 items-start mb-20">

                        {/* Kiri — narasi + nilai */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <p className="text-slate-600 text-base leading-relaxed">
                                <span className="text-emerald-600 font-bold">Nauli Dental Care</span> adalah klinik gigi modern berbasis kecerdasan buatan (AI) yang berlokasi di Balige, Sumatera Utara. Didirikan pada 2024, kami berkomitmen menghadirkan layanan kesehatan gigi berkualitas tinggi dengan teknologi terkini untuk masyarakat Toba dan sekitarnya.
                            </p>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Dengan dukungan lebih dari 15 dokter spesialis dan sistem booking digital 24 jam, kami memastikan setiap pasien mendapatkan pelayanan terbaik — cepat, aman, dan nyaman. Chatbot AI kami siap menjawab pertanyaan medis kapan saja.
                            </p>

                            {/* Nilai-nilai */}
                            <div className="pt-4">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Komitmen Kami</p>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {values.map((v, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm text-slate-600">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Kanan — kontak & jam */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {/* Card kontak */}
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-5">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Kontak & Lokasi</p>
                                {[
                                    { icon: MapPin, label: 'Lokasi', val: 'Jl. Raja Paindoan No.20A, Balige, Toba, Sumatera Utara 22314' },
                                    { icon: Phone, label: 'WhatsApp', val: '0812-6530-965' },
                                    { icon: Mail, label: 'Email', val: 'booking@naulidental.com' },
                                ].map(({ icon: Icon, label, val }, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon size={15} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{label}</p>
                                            <p className="text-slate-700 text-sm mt-0.5 font-medium">{val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Card jam operasional */}
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock size={15} className="text-emerald-600" />
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Jam Operasional</p>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { day: 'Senin – Kamis', time: '10:00 – 19:00', status: 'open' },
                                        { day: 'Jumat', time: '10:00 – 19:00', status: 'open' },
                                        { day: 'Sabtu', time: '10:00 – 17:00', status: 'open' },
                                        { day: 'Minggu', time: 'Tutup', status: 'closed' },
                                    ].map((h, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <span className="text-sm text-slate-600 font-medium">{h.day}</span>
                                            <span className={`text-sm font-bold px-3 py-1 rounded-full text-xs
                                                ${h.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                                                    h.status === 'closed' ? 'bg-red-50 text-red-500' :
                                                        'bg-amber-50 text-amber-600'}`}>
                                                {h.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Galeri ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Galeri Klinik</span>
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
                                    className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer shadow-sm"
                                >
                                    <img src={g.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={g.label} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-xs font-black text-white uppercase tracking-wider">{g.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ TESTIMONI ══════════════════════════════════════════════ */}
            <div className="py-24 border-t border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Testimoni Pasien</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Apa Kata <span className="text-emerald-600">Pasien</span> Kami
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { name: 'Rina Simanjuntak', role: 'Pasien Scaling', rating: 5, text: 'Pelayanan sangat profesional, dokternya ramah dan hasilnya memuaskan. Chatbot AI-nya sangat membantu untuk booking.' },
                            { name: 'Budi Tambunan', role: 'Pasien Behel', rating: 5, text: 'Fasilitas modern dan bersih. Proses pemasangan behel sangat nyaman, tidak terasa sakit sama sekali.' },
                            { name: 'Sari Hutabarat', role: 'Pasien Implan', rating: 5, text: 'Awalnya takut implan, tapi tim dokter sangat sabar menjelaskan. Hasilnya luar biasa, sangat puas!' },
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex gap-0.5 mb-4">
                                    {Array(t.rating).fill(0).map((_, s) => (
                                        <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{t.name}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ CTA ════════════════════════════════════════════════════ */}
            <div className="py-24 border-t border-emerald-100" style={{ backgroundColor: '#f0f9f4' }}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl px-10 py-14
                                   flex flex-col md:flex-row items-center justify-between gap-10
                                   shadow-2xl shadow-emerald-900/20"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-5">
                                <Sparkles size={11} className="text-white/80" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Konsultasi Pertama Gratis</span>
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                Siap memulai perjalanan<br />
                                <span className="text-emerald-200">senyum sehat</span> Anda?
                            </h3>
                            <p className="text-white/60 text-sm mt-3">
                                Daftarkan diri dan nikmati konsultasi pertama gratis bersama dokter spesialis kami.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0 flex-wrap">
                            <Link href="/patient/services">
                                <button className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95">
                                    Lihat Layanan <ArrowRight size={14} />
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all">
                                    Daftar Gratis
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
            <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-emerald-100">

                        {/* Kolom 1: Logo & Tagline */}
                        <div>
                            <Link href="/patient/dashboard" className="flex items-center gap-3 mb-4 group">
                                <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden border-2 border-emerald-100 shadow-sm group-hover:border-emerald-200 transition-all flex-shrink-0 bg-white flex items-center justify-center p-1.5">
                                    <img
                                        src="/images/Logo.png"
                                        alt="Nauli Dental"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<span class="text-emerald-600 font-black text-lg">ND</span>';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <h2 className="text-slate-800 font-black text-[18px] tracking-tighter leading-tight">
                                        Nauli<span className="text-[#006D44]">Dental</span>
                                    </h2>
                                    <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase">
                                        Clinic Care
                                    </p>
                                </div>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed mt-3">
                                Nauli Dental Care adalah klinik perawatan gigi yang berlokasi di Balige, Kabupaten Toba, Sumatera Utara.
                                Klinik ini melayani berbagai macam perawatan gigi umum dan estetika.
                            </p>
                        </div>

                        {/* Kolom 2: Company Links */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Company Links
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Beranda', href: '/patient/dashboard' },
                                    { name: 'Nauli Dental', href: '/patient/about' },
                                    { name: 'Tim Kami', href: '/patient/doctors' },
                                    { name: 'Visi & Misi', href: '/patient/visiMisi' },
                                    { name: 'Layanan', href: '/patient/services' },
                                    { name: 'Cari Jadwal', href: '/patient/appointments' },
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <Link href={link.href} className="text-slate-500 hover:text-emerald-600 text-sm transition-colors duration-300 flex items-center gap-2 group">
                                            <ChevronRight size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom 3: Office Address - Data Baru Balige */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Office Address
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <MapPin size={13} className="text-emerald-500" />
                                    </div>
                                    <div className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition">
                                        Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange,<br />
                                        Kec. Balige, Toba, Sumatera Utara 22314
                                    </div>
                                </div>
                                <div className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <MapPin size={13} className="text-emerald-500" />
                                    </div>
                                    <div className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition">
                                        Koordinat: 2°19'58.7"N 99°03'57.8"E
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 4: Contact & Hours */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Contact & Hours
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Mail size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                        <a href="mailto:booking@naulidental.com" className="text-slate-600 text-sm hover:text-emerald-600 transition">
                                            booking@naulidental.com
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Phone size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Telepon</p>
                                        <a href="tel:+628126530965" className="text-slate-600 text-sm hover:text-emerald-600 transition">
                                            0812-6530-965
                                        </a>
                                    </div>
                                </li>
                                <li className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Clock size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jam Operasional</p>
                                        <div className="text-slate-600 text-sm space-y-0.5">
                                            <p>Senin - Sabtu: 10.00 - 19.00</p>
                                            <p className="text-red-500">Minggu: Tutup</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Activity size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                        <p className="text-slate-600 text-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Buka (Senin - Sabtu)
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">
                            © {new Date().getFullYear()} Nauli Dental Care - Balige, Toba, Sumatera Utara. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs">
                            <Link href="/patient/privacy" className="text-slate-400 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                            <Link href="/patient/terms" className="text-slate-400 hover:text-emerald-600 transition-colors">Terms of Use</Link>
                            <Link href="/patient/accessibility" className="text-slate-400 hover:text-emerald-600 transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}