'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight, CheckCircle, Users, Star, Award,
    Heart, Sparkles, MapPin, Search, CalendarCheck,
    Stethoscope, Smartphone, MousePointer2
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export default function NauliCoAboutPage() {

    const patientJourney = [
        {
            step: "01",
            title: "Reservasi Online",
            desc: "Daftar melalui portal atau WhatsApp kami untuk memilih jadwal dokter spesialis.",
            icon: Smartphone,
            color: "#10B981"
        },
        {
            step: "02",
            title: "Konfirmasi & Datang",
            desc: "Tim kami akan mengirimkan pengingat. Harap datang 15 menit sebelum jadwal.",
            icon: MapPin,
            color: "#059669"
        },
        {
            step: "03",
            title: "Pemeriksaan AI",
            desc: "Diagnosa akurat menggunakan teknologi pemindaian 3D dan bantuan kecerdasan buatan.",
            icon: Search,
            color: "#047857"
        },
        {
            step: "04",
            title: "Tindakan Medis",
            desc: "Perawatan dilakukan oleh tim dokter ahli dengan standar sterilisasi internasional.",
            icon: Stethoscope,
            color: "#065F46"
        }
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ECFDF5' }}>

            {/* ══ HERO — Fullscreen Mint ══ */}
            <section
                className="relative w-full min-h-screen flex items-start overflow-hidden -mt-24 pt-24"
                style={{ backgroundColor: '#ECFDF5' }}
            >
                {/* Orbs dekorasi */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-32 pb-20 relative z-10">
                    <div className="grid md:grid-cols-2 gap-10 items-start">

                        {/* ── Kiri: Teks ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-6"
                        >
                            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter" style={{ color: '#005A32' }}>
                                Are You<br />Next?
                            </h1>
                            <div className="space-y-4 max-w-md pt-2">
                                <p className="text-emerald-900/75 text-lg font-bold leading-relaxed italic">
                                    Jadilah bagian dari gerakan yang mengedukasi masyarakat tentang pentingnya perawatan gigi berkualitas!
                                </p>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Nauli Dental Care Balige berkomitmen memberikan layanan kesehatan gigi terbaik dengan dukungan teknologi AI modern untuk hasil yang lebih presisi.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4">
                                <Link href="/patient/nauli-co/register-as-partner">
                                    <button className="bg-[#006D44] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-400/30">
                                        Daftar Sekarang
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* ── Kanan: Foto ── */}
                        <motion.div {...fadeUp(0.2)} className="relative flex justify-center">
                            <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none" />
                            <img src="/images/doctors.jpg" alt="Nauli Dental" className="w-full max-w-[460px] rounded-[2.5rem] shadow-2xl border-8 border-white/70" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ PANDUAN: ROUTE GRAFIK (Alur Pasien) ══ */}
            <section className="px-6 sm:px-10 py-24 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <CalendarCheck size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Langkah Berobat</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#005A32' }}>
                            Alur Perjalanan <span className="text-emerald-500 font-medium">Pasien</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Garis Tengah Grafik */}
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-emerald-200/50 md:-translate-x-1/2 rounded-full" />

                        <div className="space-y-12">
                            {patientJourney.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        {...fadeUp(i * 0.1)}
                                        className={`relative flex items-center justify-between md:justify-normal w-full group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        {/* Point di tengah garis */}
                                        <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#ECFDF5] z-10 md:-translate-x-1/2 shadow-sm" />

                                        {/* Konten Card */}
                                        <div className="w-full md:w-[45%] ml-12 md:ml-0">
                                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-white group-hover:border-emerald-200 transition-all">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                                        <Icon size={22} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Step {item.step}</span>
                                                        <h4 className="text-lg font-black text-slate-800 leading-none">{item.title}</h4>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section className="px-6 sm:px-10 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { v: '1.500+', l: 'Pasien Terlayani', i: Users },
                            { v: '5 Th', l: 'Pengalaman', i: Award },
                            { v: '98%', l: 'Kepuasan', i: Star },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <s.i size={18} />
                                </div>
                                <p className="text-2xl font-black text-emerald-700">{s.v}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.l}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION ══ */}
            <section className="px-6 sm:px-10 pb-32">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()} className="bg-[#005A32] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center">
                        <Sparkles className="absolute top-10 right-10 text-emerald-400/20" size={80} />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Siap Mendapatkan<br />Senyum Impian Anda?</h2>
                            <p className="text-emerald-100/60 max-w-xl mx-auto mb-10 font-medium">Jangan tunda kesehatan gigi Anda. Konsultasikan dengan tim ahli kami secara gratis hari ini.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/patient/appointments">
                                    <button className="bg-emerald-400 text-[#005A32] px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/20 flex items-center gap-2">
                                        Buat Janji Online <ArrowRight size={14} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}