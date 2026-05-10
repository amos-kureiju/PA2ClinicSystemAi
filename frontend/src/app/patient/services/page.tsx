'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope, Sparkles, ShieldCheck,
    ArrowRight, Loader2, Activity,
    Clock, Award, Users, Calendar, Star, Heart,
    Zap, CheckCircle, Phone, X, Info, MapPin,
    DollarSign, ChevronLeft, ChevronRight, Play
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get(`/clinic/services?t=${Date.now()}`);
                setServices(res.data);
            } catch (err) {
                console.error('Gagal sinkronisasi:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
        window.addEventListener('focus', fetchServices);
        return () => window.removeEventListener('focus', fetchServices);
    }, []);

    const handleViewDetail = (service: any) => {
        setSelectedService(service);
        setCurrentGalleryIndex(0);
        setIsDetailOpen(true);
    };

    const nextGalleryImage = () => {
        const g = selectedService?.gallery_urls || [];
        if (g.length > 0) setCurrentGalleryIndex(p => (p + 1) % g.length);
    };

    const prevGalleryImage = () => {
        const g = selectedService?.gallery_urls || [];
        if (g.length > 0) setCurrentGalleryIndex(p => (p - 1 + g.length) % g.length);
    };

    const handleQuickBook = async () => {
        if (!selectedService) return;
        setIsBooking(true);
        let name = 'Pasien Baru', phone = 'Belum diisi';
        try {
            const u = await api.get('/auth/me');
            if (u.data?.full_name) name = u.data.full_name;
            if (u.data?.phone_number) phone = u.data.phone_number;
        } catch { /* silent */ }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        try {
            await api.post('/clinic/appointments', {
                patient_name: name,
                patient_phone: phone,
                doctor_name: `Layanan: ${selectedService.name}`,
                appointment_date: tomorrow.toISOString(),
                notes: 'Dokter akan ditentukan pihak klinik.',
            });
            setIsDetailOpen(false);
            router.push('/patient/appointments');
        } catch {
            alert('Gagal booking. Silakan coba menu Janji Temu.');
        } finally {
            setIsBooking(false);
        }
    };

    const stats = [
        { icon: Users, value: '10K+', label: 'Pasien Puas', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20' },
        { icon: Award, value: '15+', label: 'Tahun Pengalaman', color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/15' },
        { icon: Clock, value: '24/7', label: 'Layanan Darurat', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20' },
        { icon: Star, value: '4.9', label: 'Rating Pasien', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/15' },
    ];

    const features = [
        { icon: Zap, title: 'AI Technology', desc: 'Diagnosis akurat dengan kecerdasan buatan', color: 'from-emerald-500 to-teal-500' },
        { icon: ShieldCheck, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional', color: 'from-emerald-600 to-emerald-700' },
        { icon: Heart, title: 'Ramah Lansia', desc: 'Perawatan khusus untuk pasien lansia', color: 'from-teal-500 to-emerald-600' },
        { icon: Calendar, title: 'Booking Mudah', desc: 'Janji temu online 24 jam kapan saja', color: 'from-emerald-400 to-teal-600' },
    ];

    return (
        <div className="min-h-screen bg-[#0A1C14] font-sans">

            {/* ══ HERO FULLSCREEN ══════════════════════════════════════════ */}
            <div className="relative w-full h-screen min-h-[600px] overflow-hidden">

                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src="/images/layanan.jpg"
                        alt="hero background"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Overlay layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C14] via-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A1C14] to-transparent" />

                {/* Hero content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-xl space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                    Nauli Dental Care
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tighter">
                                Layanan Gigi<br />
                                <span className="text-emerald-400">Terpadu</span> Kami
                            </h1>

                            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                                Inovasi perawatan gigi modern berbasis AI untuk hasil akurat,
                                aman, dan tanpa rasa sakit bersama tim medis profesional.
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <a href="#services">
                                    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95">
                                        <Play size={15} className="fill-white" />
                                        Pilih Layanan
                                    </button>
                                </a>
                                <a href="#features">
                                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/15 transition-all">
                                        Keunggulan Kami
                                        <ArrowRight size={14} />
                                    </button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-emerald-400/60 rounded-full mt-2 animate-bounce" />
                    </div>
                </motion.div>
            </div>

            {/* ══ STATS ════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white/5 border ${s.border} backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all group`}
                        >
                            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border ${s.border}`}>
                                <s.icon size={22} />
                            </div>
                            <h3 className="text-2xl font-black text-white">{s.value}</h3>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ FEATURES ═════════════════════════════════════════════════ */}
            <section id="features" className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Mengapa Memilih Kami</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Keunggulan <span className="text-emerald-400">Layanan</span> Kami
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                        >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <f.icon className="text-white" size={20} />
                            </div>
                            <h3 className="font-bold text-white text-base">{f.title}</h3>
                            <p className="text-sm text-white/45 mt-2 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ SERVICES GRID ════════════════════════════════════════════ */}
            <section id="services" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Daftar Perawatan</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Pilih <span className="text-emerald-400">Perawatan</span> Terbaik
                    </h2>
                </motion.div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                        <p className="text-white/30 text-xs font-black uppercase tracking-widest">Memuat layanan...</p>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                whileHover={{ y: -6 }}
                                onClick={() => handleViewDetail(item)}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:bg-white/8 transition-all duration-300 cursor-pointer"
                            >
                                {/* Foto */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={item.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                    {/* Harga badge */}
                                    <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                                        <p className="text-xs font-black text-white">Rp {item.price?.toLocaleString()}</p>
                                    </div>

                                    {/* AI badge */}
                                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1">
                                        <p className="text-[10px] font-black text-white flex items-center gap-1">
                                            <CheckCircle size={10} className="text-emerald-400" /> AI Verified
                                        </p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-base font-black text-white leading-tight mb-2">{item.name}</h3>
                                    <p className="text-xs text-white/45 leading-relaxed line-clamp-2 mb-4">{item.description}</p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-white/8 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-emerald-400" />
                                            <span className="text-xs text-white/40">30-60 menit</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={13} className="text-emerald-400" />
                                            <span className="text-xs text-white/40">Garansi 1 bulan</span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-emerald-900/30">
                                        Booking Sekarang
                                        <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-3 opacity-30">
                        <Stethoscope size={44} className="mx-auto text-white/30" />
                        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Belum ada layanan tersedia</p>
                    </div>
                )}
            </section>

            {/* ══ CTA SECTION ══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden bg-white/5 border border-emerald-500/20 rounded-2xl"
                >
                    {/* Blur dekorasi */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 rounded-full mb-4">
                                <Activity size={13} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Assistant 24/7</span>
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Punya Pertanyaan Medis?</h3>
                            <p className="text-white/45 text-sm mt-2 max-w-md leading-relaxed">
                                Tanyakan langsung pada asisten AI kami yang siap membantu Anda kapan saja, gratis!
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/30">
                                <Sparkles size={15} /> Buka Chatbot AI
                            </button>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                                <Phone size={15} /> Call Center
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ══ DETAIL MODAL ═════════════════════════════════════════════ */}
            <AnimatePresence>
                {isDetailOpen && selectedService && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                        onClick={() => setIsDetailOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#0D2419] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Gallery */}
                            <div className="relative h-64 overflow-hidden bg-black/40">
                                {selectedService.gallery_urls?.length > 0 ? (
                                    <>
                                        <img
                                            src={selectedService.gallery_urls[currentGalleryIndex]}
                                            className="w-full h-full object-contain"
                                            alt={`Gallery ${currentGalleryIndex + 1}`}
                                        />
                                        {selectedService.gallery_urls.length > 1 && (
                                            <>
                                                <button onClick={prevGalleryImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all">
                                                    <ChevronLeft size={18} />
                                                </button>
                                                <button onClick={nextGalleryImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                                    {selectedService.gallery_urls.map((_: string, i: number) => (
                                                        <button key={i} onClick={() => setCurrentGalleryIndex(i)}
                                                            className={`h-1.5 rounded-full transition-all ${i === currentGalleryIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/30'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <img
                                        src={selectedService.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95'}
                                        className="w-full h-full object-cover"
                                        alt={selectedService.name}
                                    />
                                )}
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-xl text-white/70 hover:text-white transition-all z-10"
                                >
                                    <X size={17} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-5">
                                <div className="flex justify-between items-start gap-3 flex-wrap">
                                    <div>
                                        <h2 className="text-xl font-black text-white">{selectedService.name}</h2>
                                        <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                                            <CheckCircle size={12} /> AI Verified Service
                                        </p>
                                    </div>
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
                                        <p className="text-base font-black text-emerald-400">
                                            Rp {selectedService.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Deskripsi Layanan</p>
                                    <p className="text-sm text-white/60 leading-relaxed">{selectedService.description}</p>
                                </div>

                                {selectedService.detail_info && (
                                    <div>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Info size={11} /> Detail Informasi
                                        </p>
                                        <p className="text-sm text-white/55 leading-relaxed whitespace-pre-line">{selectedService.detail_info}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Clock, label: 'Durasi', value: '30-60 menit' },
                                        { icon: ShieldCheck, label: 'Garansi', value: '1 bulan pasca perawatan' },
                                        { icon: MapPin, label: 'Lokasi', value: 'Nauli Dental Care' },
                                        { icon: DollarSign, label: 'Pembayaran', value: 'Cash / Transfer / BPJS' },
                                    ].map(({ icon: Icon, label, value }, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/8 p-3 rounded-xl">
                                            <Icon size={15} className="text-emerald-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-white/30">{label}</p>
                                                <p className="text-xs font-bold text-white/70">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-white/10">
                                    <button
                                        onClick={handleQuickBook}
                                        disabled={isBooking}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-lg shadow-emerald-900/30"
                                    >
                                        {isBooking ? <Loader2 size={15} className="animate-spin" /> : <>Booking Sekarang <ArrowRight size={14} /></>}
                                    </button>
                                    <button
                                        onClick={() => setIsDetailOpen(false)}
                                        className="flex-1 flex items-center justify-center py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
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