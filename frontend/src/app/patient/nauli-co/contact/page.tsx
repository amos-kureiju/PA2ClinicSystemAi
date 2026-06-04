'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    MapPin, Clock, CheckCircle, Copy, Navigation,
    MessageCircle, Sparkles
} from 'lucide-react';

/* ── Fade helper ── */
const FadeUp = ({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

/* ── Jam operasional ── */
const JAM_BUKA = [
    { hari: 'Senin', jam: '10.00 – 19.00', buka: true },
    { hari: 'Selasa', jam: '10.00 – 19.00', buka: true },
    { hari: 'Rabu', jam: '10.00 – 19.00', buka: true },
    { hari: 'Kamis', jam: '10.00 – 19.00', buka: true },
    { hari: 'Jumat', jam: '10.00 – 19.00', buka: true },
    { hari: 'Sabtu', jam: '10.00 – 17.00', buka: true },
    { hari: 'Minggu', jam: 'Tutup', buka: false },
];

const hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

export default function ContactPage() {
    const [copied, setCopied] = useState(false);
    const alamat = 'Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314';

    const copyAlamat = () => {
        navigator.clipboard.writeText(alamat);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

            {/* ══════════════════════════════════════════
                HEADER SECTION - Paling Atas
            ══════════════════════════════════════════ */}
            <div className="relative w-full pt-40 pb-20 px-6 overflow-hidden flex items-center justify-center -mt-24">
                {/* -mt-24 digunakan untuk menarik kontainer ke atas menutupi area navbar */}

                {/* Background Image & Overlay Lebih Transparan */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/bg/galery5.png"
                        alt="background"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay dikurangi kepekatannya (opacity 40%) agar gambar terlihat jelas */}
                    <div className="absolute inset-0 bg-emerald-950/40" />
                </div>

                {/* Elemen Dekoratif Blur */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-4 border border-white/30">
                        <Sparkles size={12} className="text-emerald-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            NEED HELP? GET IN TOUCH
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-none">
                        Kami Siap <span className="text-emerald-400">Melayani</span> Anda
                    </h1>
                    <p className="text-white/80 text-base max-w-md mx-auto font-medium">
                        Feel free to reach out to us for any inquiries or assistance. We're here to help!
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                MAIN CONTENT - Padat & Rapi
            ══════════════════════════════════════════ */}
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Grid 2 Kolom: Alamat & Jam Operasional */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                    
                    {/* Kartu Alamat */}
                    <FadeUp>
                        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Alamat Klinik</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">{alamat}</p>
                                    <div className="flex gap-2 mt-3">
                                        <a
                                            href="https://maps.google.com/maps?q=2.3331763,99.0659975"
                                            target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <Navigation size={10} /> Buka di Maps
                                        </a>
                                        <button onClick={copyAlamat}
                                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border
                                                ${copied
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
                                            {copied ? <CheckCircle size={10} /> : <Copy size={10} />}
                                            {copied ? 'Tersalin' : 'Salin'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Kartu Jam Operasional */}
                    <FadeUp delay={0.06}>
                        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                    <Clock size={18} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Jam Operasional</p>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-600">Buka Hari Ini</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {JAM_BUKA.map((item) => {
                                            const isToday = item.hari === hariIni;
                                            return (
                                                <div key={item.hari} className="flex items-center justify-between">
                                                    <span className={`text-[11px] font-medium ${isToday ? 'text-emerald-700' : 'text-slate-600'}`}>
                                                        {item.hari}
                                                    </span>
                                                    <span className={`text-[11px] font-semibold ${item.buka ? (isToday ? 'text-emerald-600' : 'text-slate-600') : 'text-red-400'}`}>
                                                        {item.jam}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>
                </div>

                {/* Kartu WhatsApp - 1/2 lebar saja, tidak memanjang */}
                <div className="flex justify-center mb-6">
                    <FadeUp delay={0.09} className="w-full md:w-1/2">
                        <a href="https://wa.me/628126530965" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-[#E8F5E9] rounded-xl shadow-sm border border-green-200 p-4 hover:shadow-md hover:border-green-300 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0">
                                <MessageCircle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">WhatsApp</p>
                                <p className="text-xs font-bold text-slate-700">0812-6530-965</p>
                            </div>
                            <div className="ml-auto text-green-500">
                                <span className="text-[10px] font-bold">Chat →</span>
                            </div>
                        </a>
                    </FadeUp>
                </div>

                {/* ══════════════════════════════════════════
                    GOOGLE MAPS 
                ══════════════════════════════════════════ */}
                <FadeUp delay={0.12}>
                    <div className="rounded-xl overflow-hidden shadow-md border border-emerald-100">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <p className="text-[10px] font-bold text-white/80">Nauli Dental Care — Balige</p>
                            </div>
                            <a href="https://maps.google.com/maps?q=2.3331763,99.0659975" target="_blank" rel="noopener noreferrer"
                                className="text-[9px] font-black text-white/70 hover:text-white flex items-center gap-1 transition">
                                Buka Maps <Navigation size={9} />
                            </a>
                        </div>

                        <div className="relative w-full h-[280px] bg-slate-100">
                            <iframe
                                src="https://maps.google.com/maps?q=2.3331763,99.0659975&z=17&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Nauli Dental Care Location"
                                className="w-full h-full"
                            />
                        </div>

                        <div className="bg-white px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-emerald-100">
                            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                <MapPin size={10} className="text-emerald-500" />
                                Jl. Raja Paindoan No.20A, Balige, Toba
                            </p>
                            <a href="https://maps.google.com/maps?q=2.3331763,99.0659975" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">
                                <Navigation size={10} /> Petunjuk Arah
                            </a>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </div>
    );
}