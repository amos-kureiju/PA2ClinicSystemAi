'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Award, Smile, Heart, Clock, Mail } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-700 pb-20">
            {/* HERO ABOUT */}
            <div className="relative h-[400px] rounded-[4rem] overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Clinic"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex flex-col justify-end p-12">
                    <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Nauli Dental Care</h1>
                    <p className="text-indigo-200 font-bold uppercase tracking-[0.4em] text-xs mt-4 italic">The Future of Dentistry in Balige</p>
                </div>
            </div>

            {/* INFO GRID */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Award size={32} /></div>
                    <h3 className="text-xl font-black text-slate-800 italic uppercase">Visi Kami</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">Menjadi pusat kesehatan gigi berbasis teknologi AI terdepan di Sumatera Utara.</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Heart size={32} /></div>
                    <h3 className="text-xl font-black text-slate-800 italic uppercase">Pelayanan</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">Kami mengedepankan kenyamanan pasien dengan prosedur minim rasa sakit.</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Smile size={32} /></div>
                    <h3 className="text-xl font-black text-slate-800 italic uppercase">Hasil</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">Senyum sehat dan masa depan yang cerah untuk setiap senyuman Anda.</p>
                </div>
            </div>

            {/* CONTACT AREA */}
            <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white grid md:grid-cols-2 gap-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black italic tracking-tighter mb-8">Hubungi Kami</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-blue-400 mt-1" />
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-blue-400">Lokasi</p>
                                <p className="text-slate-300 font-medium mt-1 leading-relaxed">Jl. Balige No. 12, Toba, Sumatera Utara</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="text-blue-400 mt-1" />
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-blue-400">WhatsApp</p>
                                <p className="text-slate-300 font-medium mt-1">+62 821 6352 6363</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="text-blue-400 mt-1" />
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-blue-400">Email</p>
                                <p className="text-slate-300 font-medium mt-1">info@naulidental.ai</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 flex flex-col justify-center items-center text-center">
                    <Clock size={48} className="text-blue-400 mb-6" />
                    <h3 className="text-2xl font-black italic">Jam Operasional</h3>
                    <div className="mt-4 space-y-1 text-slate-400 font-bold uppercase text-xs tracking-widest">
                        <p>Senin - Jumat: 08:00 - 21:00</p>
                        <p>Sabtu: 09:00 - 17:00</p>
                        <p className="text-rose-400">Minggu: Tutup (Hanya Darurat)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}