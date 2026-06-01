'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight, Heart, Users, Star, Sparkles,
    CheckCircle, Award, TrendingUp, Zap, Stethoscope
} from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const perks = [
    { icon: Heart, label: 'Komunitas Suportif', desc: 'Bergabung dengan ribuan pasien yang saling mendukung perjalanan kesehatan gigi.' },
    { icon: Star, label: 'Reward Eksklusif', desc: 'Kumpulkan poin di setiap kunjungan, tukarkan dengan diskon dan layanan gratis.' },
    { icon: Sparkles, label: 'Edukasi Gigi', desc: 'Akses konten edukasi, tips perawatan, dan webinar eksklusif dari dokter kami.' },
    { icon: Zap, label: 'Prioritas Antrian', desc: 'Member NauliCo mendapat slot prioritas saat pemesanan janji temu online.' },
    { icon: Award, label: 'Member Badge', desc: 'Badge eksklusif di profil Anda sebagai tanda kepercayaan terhadap NauliDental.' },
    { icon: TrendingUp, label: 'Benefit Bertingkat', desc: 'Naik level Silver → Gold → Platinum — semakin banyak manfaat yang Anda raih.' },
];

const stats = [
    { value: '5.000+', label: 'Member Aktif' },
    { value: '20 Th', label: 'Pengalaman' },
    { value: '98%', label: 'Kepuasan Pasien' },
    { value: '3 Kota', label: 'Cabang Kami' },
];

export default function NauliCoAboutPage() {
    return (
        <div className="bg-white">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-6 py-20">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-[80px] pointer-events-none" />
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center relative">

                    {/* Text */}
                    <div>
                        <FadeUp>
                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
                                <Sparkles size={10} /> Komunitas NauliDental
                            </span>
                        </FadeUp>
                        <FadeUp delay={0.08}>
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.08] mb-5">
                                Apakah Kamu<br />
                                <span className="text-emerald-500">Yang Berikutnya?</span>
                            </h1>
                        </FadeUp>
                        <FadeUp delay={0.14}>
                            <p className="text-slate-500 text-base leading-relaxed mb-3">
                                Jadilah bagian dari gerakan yang tidak hanya mendukung kesehatanmu, tetapi juga mengedukasi masyarakat tentang pentingnya perawatan gigi.
                            </p>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                <span className="text-emerald-600 font-semibold">NauliCo</span> adalah komunitas kreatif yang lahir dari semangat NauliDental — klinik gigi terpercaya yang telah berkomitmen melayani selama lebih dari 20 tahun.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.2}>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/patient/nauli-co/register-as-partner"
                                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-emerald-200 transition-all">
                                    Gabung Sekarang <ArrowRight size={14} />
                                </Link>
                                <Link href="/patient/nauli-co/contact"
                                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
                                    Hubungi Kami
                                </Link>
                            </div>
                        </FadeUp>
                    </div>

                    {/* Stats card */}
                    <FadeUp delay={0.18} className="hidden lg:block">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-8">
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <Stethoscope size={18} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">NauliCo Community</p>
                                    <p className="text-xs text-emerald-500">Komunitas Kesehatan Gigi</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {stats.map((s, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.06 }}
                                        className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                                    >
                                        <p className="text-2xl font-black text-slate-800">{s.value}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Member levels */}
                            <div className="space-y-2">
                                {[
                                    { level: 'Silver', color: 'text-slate-500 bg-slate-50 border-slate-200', bar: 'bg-slate-400', w: '33%' },
                                    { level: 'Gold', color: 'text-amber-600 bg-amber-50 border-amber-200', bar: 'bg-amber-400', w: '66%' },
                                    { level: 'Platinum', color: 'text-teal-600  bg-teal-50  border-teal-200', bar: 'bg-teal-500', w: '100%' },
                                ].map(m => (
                                    <div key={m.level} className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-xs font-black ${m.color}`}>
                                        <span className="w-14">{m.level}</span>
                                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: m.w }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.7, delay: 0.5 }}
                                                className={`h-full ${m.bar} rounded-full`}
                                            />
                                        </div>
                                        <CheckCircle size={12} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ── Perks ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <FadeUp className="text-center mb-14">
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3 block">Keuntungan Member</span>
                        <h2 className="text-3xl font-black text-slate-800 mb-3">
                            Mengapa Bergabung <span className="text-emerald-500">NauliCo?</span>
                        </h2>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto">
                            Nikmati berbagai keuntungan eksklusif yang dirancang untuk mendukung perjalanan kesehatan gigi Anda.
                        </p>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {perks.map((p, i) => (
                            <FadeUp key={i} delay={i * 0.06}>
                                <div className="group bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 rounded-2xl p-6 transition-all duration-300 h-full">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-all">
                                        <p.icon size={18} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-800 mb-2">{p.label}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto text-center">
                    <FadeUp>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-10 shadow-xl shadow-emerald-200/50 text-white">
                            <Sparkles size={28} className="mx-auto mb-4 opacity-80" />
                            <h2 className="text-2xl font-black mb-3">Siap Bergabung?</h2>
                            <p className="text-emerald-100 text-sm mb-7 max-w-sm mx-auto">
                                Daftarkan diri Anda dan mulai perjalanan kesehatan gigi yang lebih baik bersama komunitas NauliCo.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Link href="/patient/nauli-co/register-as-partner"
                                    className="inline-flex items-center gap-2 bg-white text-emerald-600 font-black text-sm px-6 py-3 rounded-xl hover:bg-emerald-50 shadow-md transition-all">
                                    Daftar Sekarang <ArrowRight size={14} />
                                </Link>
                                <Link href="/patient/nauli-co/contact"
                                    className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/25 transition-all">
                                    Tanya Dulu
                                </Link>
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}