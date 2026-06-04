'use client';
import { motion } from 'framer-motion';
import {
    ArrowRight, MapPin, Clock, Stethoscope,
    Phone, Instagram, Facebook, CheckCircle2,
    CalendarCheck, Smartphone, Sparkles, MessageCircle
} from 'lucide-react';
import Link from 'next/link';

/* ── Animation Helper ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export default function GuideAndHistoryPage() {

    const services = [
        "Pembersihan karang gigi (Scaling)",
        "Penambalan gigi estetis (Sinar/Komposit)",
        "Pemutihan gigi (Bleaching)",
        "Perawatan gigi anak (Topical Fluoride)",
        "Konsultasi Gigi Berlubang & Abses",
        "Kerapian Gigi (Orthodontic Consultation)"
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">

            {/* ══ HERO SECTION: SEJARAH & PROFIL ══ */}
            <section className="relative bg-[#064e3b] pt-24 pb-40 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.div {...fadeUp()} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
                        <Sparkles size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-50">Profil & Panduan</span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                        Nauli <span className="text-emerald-400">Dental Care</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-emerald-100/70 text-lg max-w-3xl mx-auto leading-relaxed font-medium">
                        Penyedia layanan kesehatan gigi dan mulut terpercaya yang beroperasi di wilayah Sumatera Utara, mengedukasi masyarakat melalui perawatan estetika dan medis yang berkualitas.
                    </motion.p>
                </div>
            </section>

            {/* ══ JARINGAN KLINIK (Bento Style) ══ */}
            <section className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* CABANG BALIGE */}
                    <motion.div {...fadeUp(0.3)} className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden group">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <MapPin size={28} />
                                </div>
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Pusat - Toba</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight">Cabang Balige</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                Melayani pemeriksaan gigi umum hingga perawatan estetika wajah dan gigi di jantung Kabupaten Toba.
                            </p>
                            <div className="space-y-4 border-t border-slate-50 pt-6">
                                <div className="flex gap-3 text-xs">
                                    <Clock size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-slate-600 font-semibold">Senin – Jumat: 10.00 – 20.00 WIB | Sabtu: 10.00 – 18.00 WIB</span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <Stethoscope size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-slate-600">drg. Yetti M, drg. Sere S, drg. Domdom P.</span>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <a href="https://wa.me/628126530965" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider text-center hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a href="https://instagram.com/dentalcare.nauli" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-pink-500 transition border border-slate-100">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* CABANG TANAH JAWA */}
                    <motion.div {...fadeUp(0.4)} className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden group">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <MapPin size={28} />
                                </div>
                                <span className="bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Cabang - Simalungun</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight">Tanah Jawa</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                Klinik alternatif strategis yang berada di wilayah Simalungun, samping Kantor Pos Tanah Jawa.
                            </p>
                            <div className="space-y-4 border-t border-slate-50 pt-6">
                                <div className="flex gap-3 text-xs">
                                    <Clock size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-slate-600 font-semibold">Senin – Sabtu: 13.00 – 20.00 WIB (Reservasi Available)</span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <MapPin size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-slate-600">Ruko Putih, Samping Kantor Pos Tanah Jawa, Pematang-Tanahdjawah.</span>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <a href="https://wa.me/6282276075793" className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider text-center hover:bg-slate-900 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition border border-slate-100">
                                    <Facebook size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ LAYANAN KOMPREHENSIF ══ */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Layanan Medis <span className="text-emerald-500">Unggulan</span></h2>
                        <div className="h-1.5 w-12 bg-emerald-500 rounded-full mx-auto mt-4" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {services.map((service, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.05)} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm hover:border-emerald-300 transition-colors">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                <span className="text-sm font-bold text-slate-700">{service}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PANDUAN KUNJUNGAN ══ */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <motion.div {...fadeUp()} className="bg-[#0A1C14] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-10 tracking-tight">PANDUAN KUNJUNGAN</h2>

                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                                    <Smartphone size={24} />
                                </div>
                                <h4 className="font-black text-sm uppercase">1. Reservasi Online</h4>
                                <p className="text-xs text-white/60 leading-relaxed font-medium">Hubungi WhatsApp admin cabang tujuan Anda untuk memastikan ketersediaan jadwal dokter.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                                    <CalendarCheck size={24} />
                                </div>
                                <h4 className="font-black text-sm uppercase">2. Konfirmasi Jadwal</h4>
                                <p className="text-xs text-white/60 leading-relaxed font-medium">Tim kami akan mengonfirmasi jam temu. Mohon datang 15 menit sebelum waktu praktik dimulai.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="font-black text-sm uppercase">3. Konsultasi & Tindakan</h4>
                                <p className="text-xs text-white/60 leading-relaxed font-medium">Lakukan pemeriksaan komprehensif bersama tim dokter ahli kami untuk hasil kesehatan gigi yang maksimal.</p>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/10 text-center">
                            <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 italic">Siap Mendapatkan Senyum Sehat?</p>
                            <Link href="/patient/appointments" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                                Buat Janji Sekarang <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                    {/* Decor Blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
            </section>
        </section>
        </div >
    );
}