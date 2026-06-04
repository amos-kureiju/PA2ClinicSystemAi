'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NauliCoAboutPage() {
    return (
        <div className="bg-white min-h-[calc(100vh-80px)]">

            {/* ════════════════════════════════════════════════════
                HERO — "Are You Next?" (persis seperti referensi)
            ════════════════════════════════════════════════════ */}
            <section className="px-6 py-12 max-w-7xl mx-auto">
                <div
                    className="relative rounded-[3rem] overflow-hidden min-h-[580px] flex items-center"
                    style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 50%, #E0F7FA 100%)' }}
                >
                    {/* Dekorasi background orbs */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-teal-200/20 rounded-full blur-[60px] pointer-events-none" />

                    <div className="grid md:grid-cols-2 gap-10 px-10 md:px-20 py-16 items-center w-full relative z-10">

                        {/* ── Kiri: Teks ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-7"
                        >
                            <h1
                                className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tighter"
                                style={{ color: '#01579B' }}
                            >
                                Are You<br />Next?
                            </h1>

                            <div className="space-y-5 max-w-md">
                                <p className="text-blue-900/70 text-lg font-bold leading-relaxed italic">
                                    Jadilah bagian dari gerakan yang tidak hanya mendukung passion-mu, tetapi juga mengedukasi masyarakat tentang pentingnya perawatan gigi dan kesehatan yang lebih baik!
                                </p>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Nauli Co. adalah komunitas kreatif yang lahir dari semangat Nauli Dental, sebuah klinik gigi terpercaya yang telah berkomitmen untuk memberikan layanan kesehatan gigi terbaik selama lebih dari 20 tahun. Sebagai komunitas, kami mendukung individu yang memiliki passion dalam menciptakan konten positif.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link href="/patient/nauli-co/register-as-partner">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-[#0288D1] hover:bg-[#01579B] text-white px-10 py-4 rounded-2xl
                                            font-black text-[11px] uppercase tracking-[0.18em]
                                            shadow-2xl shadow-blue-300/40 transition-all flex items-center gap-2"
                                    >
                                        Join Now! <ArrowRight size={14} />
                                    </motion.button>
                                </Link>
                                <Link href="/patient/nauli-co/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-white/70 hover:bg-white text-blue-800 px-8 py-4 rounded-2xl
                                            font-black text-[11px] uppercase tracking-[0.18em]
                                            border border-blue-200 transition-all backdrop-blur-sm"
                                    >
                                        Learn More
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* ── Kanan: Foto / Ilustrasi ── */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative flex justify-center items-end h-full"
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" />

                            {/* Foto dokter/model — ganti dengan gambar klinik Anda */}
                            <div className="relative z-10 w-full max-w-[420px]">
                                <img
                                    src="/images/doctors.jpg"
                                    alt="NauliCo Community"
                                    className="w-full object-cover object-top rounded-[2.5rem]
                                        shadow-2xl shadow-blue-900/20
                                        border-8 border-white/80
                                        hover:scale-[1.02] transition-transform duration-700"
                                    style={{ maxHeight: '480px' }}
                                    onError={(e) => {
                                        // Fallback ilustrasi jika gambar tidak ada
                                        const t = e.target as HTMLImageElement;
                                        t.style.display = 'none';
                                        const parent = t.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `
                                                <div class="w-full h-[420px] rounded-[2.5rem] bg-gradient-to-br from-blue-200 to-teal-200 border-8 border-white/80 shadow-2xl flex flex-col items-center justify-center gap-4">
                                                    <div class="text-8xl">🦷</div>
                                                    <p class="font-black text-blue-700 text-lg uppercase tracking-widest">NauliCo</p>
                                                    <p class="text-blue-500 text-sm">Community Hub</p>
                                                </div>
                                            `;
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                STATS STRIP
            ════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { value: '5.000+', label: 'Member Aktif', color: 'text-blue-600' },
                        { value: '20 Th', label: 'Pengalaman Klinik', color: 'text-teal-600' },
                        { value: '98%', label: 'Kepuasan Pasien', color: 'text-emerald-600' },
                        { value: '3 Kota', label: 'Cabang Klinik', color: 'text-cyan-600' },
                    ].map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.07 }}
                            className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center hover:shadow-md transition-all"
                        >
                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ════════════════════════════════════════════════════
                MISI SECTION
            ════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-[#006D44] to-[#00897B] rounded-3xl p-10 md:p-14 text-white
                        shadow-xl shadow-emerald-900/20 flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 mb-3 block">Misi Kami</span>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            Bersama Membangun<br />
                            <span className="text-emerald-300">Senyum Indonesia</span>
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                            NauliCo percaya bahwa setiap orang berhak mendapatkan perawatan gigi terbaik. Bergabunglah bersama kami dan jadilah agen perubahan dalam dunia kesehatan gigi.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Link href="/patient/nauli-co/register-as-partner">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-white text-emerald-700 font-black text-sm px-8 py-4 rounded-2xl
                                    shadow-lg hover:shadow-xl transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                                Gabung NauliCo <ArrowRight size={16} />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}