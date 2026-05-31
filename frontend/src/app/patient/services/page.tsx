'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    Stethoscope, Sparkles, ShieldCheck,
    ArrowRight, Loader2, Activity,
    Clock, Award, Users, Calendar, Star, Heart,
    Zap, CheckCircle, Phone, X, Info, MapPin,
    DollarSign, ChevronLeft, ChevronRight, Play,
    TrendingUp, Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            } catch (err) { console.error(err); }
            finally { setIsLoading(false); }
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

    const features = [
        { icon: Zap, title: 'AI Technology', desc: 'Diagnosis akurat dengan kecerdasan buatan', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { icon: ShieldCheck, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional', color: 'bg-teal-100', iconColor: 'text-teal-600' },
        { icon: Heart, title: 'Ramah Pasien', desc: 'Perawatan personal dan penuh perhatian', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { icon: Calendar, title: 'Booking Mudah', desc: 'Janji temu online 24 jam kapan saja', color: 'bg-teal-100', iconColor: 'text-teal-600' },
    ];

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#EDF5F2' }}>

            {/* ══ HERO — latar foto klinik dengan overlay terang ══════════ */}
            <div className="relative w-full h-screen min-h-[580px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/layanan.jpg"
                        alt="Layanan Nauli Dental"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EDF5F2] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#EDF5F2] to-transparent" />

                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-xl space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    Nauli Dental Care
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tighter">
                                Layanan Gigi<br />
                                <span className="text-emerald-300">Terpadu</span> Kami
                            </h1>

                            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                                Perawatan gigi modern dengan teknologi terkini untuk hasil akurat,
                                aman, dan nyaman bersama tim dokter spesialis kami.
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <a href="#services">
                                    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                                        <Play size={14} className="fill-white" />
                                        Pilih Layanan
                                    </button>
                                </a>
                                <a href="#features">
                                    <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 transition-all">
                                        Keunggulan
                                        <ArrowRight size={14} />
                                    </button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-slate-400/40 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-emerald-500/60 rounded-full mt-2 animate-bounce" />
                    </div>
                </motion.div>
            </div>

            {/* ══ FEATURES ═════════════════════════════════════════════════ */}
            <section id="features" className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Mengapa Memilih Kami
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Keunggulan <span className="text-emerald-600">Layanan</span> Kami
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg">
                        Kami menggabungkan teknologi modern dengan sentuhan pelayanan tulus.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white border border-emerald-100 rounded-2xl p-6
                                       hover:shadow-md hover:border-emerald-200 transition-all group"
                        >
                            <div className={`w-11 h-11 ${f.color} ${f.iconColor} rounded-xl
                                            flex items-center justify-center mb-4
                                            group-hover:scale-110 transition-transform`}>
                                <f.icon size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">{f.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ SERVICES GRID ════════════════════════════════════════════ */}
            <section id="services" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Daftar Perawatan
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Pilih <span className="text-emerald-600">Perawatan</span> Terbaik
                    </h2>
                </motion.div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={36} />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Memuat layanan...
                        </p>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.07 }}
                                whileHover={{ y: -5 }}
                                onClick={() => handleViewDetail(item)}
                                className="group bg-white border border-emerald-100 rounded-2xl overflow-hidden
                                           hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-52 overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={item.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
                                        <p className="text-xs font-black text-emerald-700">
                                            Rp {item.price?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
                                        <p className="text-[10px] font-black text-white flex items-center gap-1">
                                            <CheckCircle size={9} /> AI Verified
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-base font-black text-slate-800 leading-tight mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-emerald-500" />
                                            <span className="text-xs text-slate-500">30-60 menit</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={12} className="text-emerald-500" />
                                            <span className="text-xs text-slate-500">Garansi 1 bulan</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white
                                                       py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider
                                                       transition-all flex items-center justify-center gap-2
                                                       shadow-sm shadow-emerald-200 active:scale-95">
                                        Booking Sekarang
                                        <ArrowRight size={13} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                            <Stethoscope size={28} className="text-emerald-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Belum ada layanan tersedia
                        </p>
                    </div>
                )}
            </section>

            {/* ══ CTA SECTION ══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl px-8 md:px-12 py-12
                               flex flex-col md:flex-row items-center justify-between gap-8
                               shadow-xl shadow-emerald-900/15 relative overflow-hidden"
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-4">
                            <Activity size={12} className="text-white/80" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                AI Assistant 24/7
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                            Punya Pertanyaan Medis?
                        </h3>
                        <p className="text-white/65 text-sm mt-2 max-w-md leading-relaxed">
                            Tanyakan langsung pada asisten AI kami yang siap membantu Anda kapan saja, gratis!
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
                        <button className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50
                                           px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95">
                            <Sparkles size={15} /> Buka Chatbot AI
                        </button>
                        <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25
                                           text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all">
                            <Phone size={15} /> Call Center
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ══ FOOTER - DILUAR MODAL ════════════════════════════════════ */}
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
                                Klinik ini melayani berbagai macam perawatan gigi umum dan estetika demi menjaga kesehatan mulut serta senyuman Anda.
                            </p>
                            <div className="flex gap-3 mt-5">
                                {[
                                    { icon: 'facebook', color: 'hover:bg-[#1877F2]' },
                                    { icon: 'instagram', color: 'hover:bg-[#E4405F]' },
                                    { icon: 'twitter', color: 'hover:bg-[#1DA1F2]' },
                                    { icon: 'linkedin', color: 'hover:bg-[#0077B5]' },
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        className={`w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 hover:text-white ${social.color} transition-all duration-300 hover:border-transparent`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            {social.icon === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                                            {social.icon === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 7a5 5 0 100 10 5 5 0 000-10zm6.5-1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />}
                                            {social.icon === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.682-12.007c0-.213-.005-.425-.015-.636a10.005 10.005 0 002.44-2.53z" />}
                                            {social.icon === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />}
                                        </svg>
                                    </a>
                                ))}
                            </div>
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
                                            <ArrowRight size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom 3: Office Address */}
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
                                            <p className="flex justify-between gap-4"><span>Senin - Kamis:</span><span>10.00 - 19.00</span></p>
                                            <p className="flex justify-between gap-4"><span>Jumat:</span><span>10.00 - 19.00</span></p>
                                            <p className="flex justify-between gap-4"><span>Sabtu:</span><span>10.00 - 17.00</span></p>
                                            <p className="flex justify-between gap-4 text-red-500"><span>Minggu:</span><span>Tutup</span></p>
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

            {/* ══ MODAL (PORTAL) - DIPISAHKAN DARI FOOTER ════════════════════ */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isDetailOpen && selectedService && (
                        <div
                            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                            style={{ zIndex: 99999 }}
                            onClick={() => setIsDetailOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative
                                           overflow-hidden max-h-[90vh] overflow-y-auto border border-emerald-100"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Gallery */}
                                <div className="relative h-64 overflow-hidden bg-slate-100">
                                    {selectedService.gallery_urls?.length > 0 ? (
                                        <>
                                            <img
                                                src={selectedService.gallery_urls[currentGalleryIndex]}
                                                className="w-full h-full object-cover"
                                                alt={`Gallery ${currentGalleryIndex + 1}`}
                                            />
                                            {selectedService.gallery_urls.length > 1 && (
                                                <>
                                                    <button onClick={prevGalleryImage}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full transition-all shadow">
                                                        <ChevronLeft size={18} />
                                                    </button>
                                                    <button onClick={nextGalleryImage}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full transition-all shadow">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                                        {selectedService.gallery_urls.map((_: string, i: number) => (
                                                            <button key={i} onClick={() => setCurrentGalleryIndex(i)}
                                                                className={`h-1.5 rounded-full transition-all ${i === currentGalleryIndex ? 'w-4 bg-emerald-500' : 'w-1.5 bg-slate-300'}`}
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
                                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-xl
                                                   text-slate-500 hover:text-red-500 transition-all shadow z-10"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-5">
                                    <div className="flex justify-between items-start gap-3 flex-wrap">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800">{selectedService.name}</h2>
                                            <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                                                <CheckCircle size={12} /> AI Verified Service
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                                            <p className="text-base font-black text-emerald-700">
                                                Rp {selectedService.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Deskripsi Layanan
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedService.description}</p>
                                    </div>

                                    {selectedService.detail_info && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <Info size={11} /> Detail Informasi
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                {selectedService.detail_info}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Clock, label: 'Durasi', value: '30-60 menit' },
                                            { icon: ShieldCheck, label: 'Garansi', value: '1 bulan pasca perawatan' },
                                            { icon: MapPin, label: 'Lokasi', value: 'Nauli Dental Care' },
                                            { icon: DollarSign, label: 'Pembayaran', value: 'Cash / Transfer / BPJS' },
                                        ].map(({ icon: Icon, label, value }, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                                <Icon size={15} className="text-emerald-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-slate-400">{label}</p>
                                                    <p className="text-xs font-bold text-slate-700">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={handleQuickBook}
                                            disabled={isBooking}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600
                                                       hover:bg-emerald-700 text-white rounded-xl text-sm font-bold
                                                       transition-all disabled:opacity-60 shadow-md shadow-emerald-200 active:scale-95"
                                        >
                                            {isBooking
                                                ? <Loader2 size={15} className="animate-spin" />
                                                : <>Booking Sekarang <ArrowRight size={14} /></>
                                            }
                                        </button>
                                        <button
                                            onClick={() => setIsDetailOpen(false)}
                                            className="flex-1 flex items-center justify-center py-3 bg-slate-100
                                                       text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-bold transition-all"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}