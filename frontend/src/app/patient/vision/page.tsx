'use client';
import { motion } from 'framer-motion';
import { Scan, Camera, ShieldCheck, Sparkles, Activity, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function VisionPage() {
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 3000);
    };
    
    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <header className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                    <Sparkles size={16} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Dental Vision</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Analisis Gigi Dengan Pintar Menggunakan Teknologi Chatbot RAG </h1>
                <p className="text-slate-500 font-medium max-w-lg mx-auto italic">Gunakan teknologi Chatbot RAG kami untuk konsultasi kondisi kesehatan gigi Anda secara dini.</p>
            </header>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* UPLOAD AREA */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mb-6 shadow-inner relative z-10">
                        {isScanning ? <Activity className="animate-spin" size={40} /> : <Camera size={40} />}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10">Unggah Foto Gigi</h3>
                    <p className="text-xs text-slate-400 font-bold mb-8 relative z-10 uppercase tracking-widest">Format: JPG, PNG (Max 5MB)</p>
                    <button
                        onClick={handleScan}
                        className="relative z-10 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                        {isScanning ? "Scanning..." : "Mulai Analisis"}
                    </button>
                </div>

                {/* INFO AREA */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black italic mb-4 text-blue-400">Cara Kerja Vision AI</h4>
                            <ul className="space-y-4">
                                {[
                                    "Ambil foto area gigi yang ingin diperiksa",
                                    "AI akan menganalisa struktur & warna gigi",
                                    "Dapatkan rekomendasi tindakan medis"
                                ].map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Scan size={150} className="absolute -right-10 -bottom-10 opacity-5 text-white rotate-12" />
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner"><ShieldCheck size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Note</p>
                            <p className="text-xs font-bold text-slate-700 mt-1 italic">Data medis Anda dienkripsi secara aman.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}