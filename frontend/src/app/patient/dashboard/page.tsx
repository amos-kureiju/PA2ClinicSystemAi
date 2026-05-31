'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, Calendar,
    Clock, Star, Heart, Activity, Phone, User,
    Stethoscope, CheckCircle, MapPin, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: '',
        patient_address: '',
        patient_gender: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const bgImages = [
        '/images/bg/dental-bg-1.png',
        '/images/bg/dental-bg-2.png',
        '/images/bg/dental-bg-3.png',
    ];

    // Auto slide background
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    // Fetch doctors
    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Memproses...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat. Mengalihkan...' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '', patient_address: '', patient_gender: '' });
            setTimeout(() => {
                setStatus({ type: '', msg: '' });
                router.push('/patient/appointments');
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Pastikan data sudah benar.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    const features = [
        { icon: <Calendar size={22} />, title: 'Booking Mudah', desc: 'Pilih jadwal & dokter favorit online 24/7' },
        { icon: <Star size={22} />, title: 'Dokter Ahli', desc: 'Tim dokter gigi spesialis berpengalaman' },
        { icon: <Activity size={22} />, title: 'Teknologi Modern', desc: 'Peralatan canggih untuk perawatan terbaik' },
        { icon: <Heart size={22} />, title: 'Perawatan Nyaman', desc: 'Prosedur minim rasa dengan hasil maksimal' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Fullscreen dengan Background Slider */}
            <div className="relative h-screen w-full flex flex-col items-start justify-center px-6 sm:px-10 lg:px-20">
                {/* Background Slider - TANPA TOMBOL NAVIGASI */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${bgImages[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide Indicators - TETAP ADA */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {bgImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`transition-all duration-300 rounded-full ${currentSlide === idx
                                    ? 'w-8 h-1.5 bg-white'
                                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left max-w-2xl relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-5"
                    >
                        <Sparkles size={12} className="text-yellow-400" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Nauli Dental AI</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.2] mb-4">
                        Senyum Sehat,
                        <br />
                        <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                            Masa Depan Cerah
                        </span>
                    </h1>

                    <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-lg mb-8">
                        Sistem manajemen klinik gigi modern dengan teknologi AI Automation untuk pengalaman perawatan yang lebih nyaman dan efisien.
                    </p>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                            Layanan Unggulan Kami
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Kami menyediakan layanan dental terbaik dengan teknologi modern dan tim dokter berpengalaman
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-emerald-100 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tentang Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                                <Heart size={14} className="text-emerald-600" />
                                <span className="text-[10px] font-bold text-emerald-600">Tentang Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                                Klinik Gigi Modern dengan Teknologi AI
                            </h2>
                            <p className="text-slate-500 mb-4 leading-relaxed">
                                Nauli Dental hadir sebagai solusi kesehatan gigi modern yang menggabungkan teknologi AI dengan pelayanan profesional. Kami berkomitmen memberikan pengalaman perawatan gigi yang nyaman, cepat, dan terjangkau.
                            </p>
                            <p className="text-slate-500 leading-relaxed">
                                Dengan tim dokter spesialis berpengalaman dan peralatan canggih, kami siap membantu Anda mendapatkan senyum sehat dan percaya diri.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center"
                        >
                            <ShieldCheck size={48} className="mx-auto mb-4 text-white/80" />
                            <h3 className="text-2xl font-bold mb-2">Terpercaya & Profesional</h3>
                            <p className="text-white/80">Lebih dari 1000+ pasien telah mempercayakan senyum mereka kepada kami</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <Calendar size={16} className="text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Booking Online</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                            Buat Janji Temu Sekarang
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Isi formulir di bawah ini untuk melakukan reservasi. Kami akan menghubungi Anda untuk konfirmasi.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_name}
                                        onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nomor WhatsApp"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_phone}
                                        onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Alamat dan Jenis Kelamin */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Alamat Lengkap"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_address}
                                        onChange={e => setFormData({ ...formData, patient_address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_gender}
                                        onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Jenis Kelamin --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.doctor_name}
                                        onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih Dokter Spesialis --</option>
                                        {doctors.map((d: any) => (
                                            <option key={d.id} value={d.name}>
                                                {d.name} - {d.specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {status.type === 'loading' ? 'Memproses...' : 'Konfirmasi Janji Temu'}
                            </button>

                            {status.msg && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-center text-sm font-medium py-3 rounded-xl ${status.type === 'success'
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : status.type === 'error'
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-emerald-600 bg-emerald-50'
                                        }`}
                                >
                                    {status.msg}
                                </motion.p>
                            )}
                        </form>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Data Terenkripsi</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><Heart size={12} /> Gratis Konsultasi Awal</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><CheckCircle size={12} /> Konfirmasi Cepat</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer - Elegant White dengan Sentuhan Hijau */}
            <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Grid Utama: 4 Kolom Responsif */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-emerald-100">

                        {/* Kolom 1: Logo & Tagline */}
                        <div>
                            <Link href="/patient/dashboard" className="flex items-center gap-3 mb-4 group">
                                {/* Logo Squircle */}
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
                                {/* Teks */}
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
                                Nauli Dental Care adalah klinik perawatan gigi yang berlokasi di Balige, Kabupaten Toba, Sumatera Utara. Klinik ini melayani berbagai macam perawatan gigi umum dan estetika demi menjaga kesehatan mulut serta senyuman Anda.
                            </p>
                            {/* Social Media Icons */}
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

                        {/* Kolom 4: Contact Us & Jam Operasional */}
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

                    {/* Bottom Bar */}
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