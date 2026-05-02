'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, ArrowLeft, CheckCircle2,
    Loader2, ShieldCheck, KeyRound, Sparkles,
    Stethoscope, Brain
} from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/reset-password', {
                email: email.toLowerCase().trim(),
                new_password: newPassword,
            });
            console.log('Respon Reset:', res.data);
            setIsSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Gagal mereset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-[#EDF5F2]">

            {/* ── KIRI: PANEL BRANDING ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-14 relative overflow-hidden">

                {/* Dekorasi lingkaran */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Logo / Brand */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl">
                        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Stethoscope size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs font-black uppercase tracking-widest">
                            Nauli Dental Care
                        </span>
                    </div>
                </div>

                {/* Konten Tengah */}
                <div className="relative z-10 space-y-8">
                    {/* Ikon utama */}
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center">
                        <KeyRound size={38} className="text-emerald-400" />
                    </div>

                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none mb-4">
                            Pemulihan<br />Akses Akun
                        </h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                            Atur ulang kata sandi Anda dengan aman. Identitas dan data klinik Anda tetap terlindungi.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="space-y-3">
                        {[
                            { icon: ShieldCheck, text: 'Verifikasi email terdaftar' },
                            { icon: Lock, text: 'Password terenkripsi penuh' },
                            { icon: Brain, text: 'Sistem keamanan berlapis' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={14} className="text-emerald-400" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer panel */}
                <p className="relative z-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    © 2025 Nauli Dental Care · Sistem Klinik
                </p>
            </div>

            {/* ── KANAN: FORM AREA ─────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -24 }}
                                transition={{ duration: 0.35 }}
                            >
                                {/* Kembali */}
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-[10px] font-black uppercase tracking-widest transition-colors group mb-10"
                                >
                                    <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Login
                                </Link>

                                {/* Heading */}
                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                                        <Sparkles size={12} className="text-emerald-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                            Pemulihan Akun
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                                        Atur Ulang Sandi
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium mt-3">
                                        Masukkan email terdaftar dan buat kata sandi baru Anda.
                                    </p>
                                </div>

                                {/* Form Card */}
                                <div className="bg-white rounded-[2rem] border border-[#D4EDE5] shadow-sm p-8 space-y-5">

                                    {/* Email */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Konfirmasi Email
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors"
                                                size={17}
                                            />
                                            <input
                                                type="email"
                                                placeholder="nama@email.com"
                                                className="w-full pl-12 pr-4 py-4 bg-[#F5FAF7] border border-[#D4EDE5] rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 text-sm placeholder:text-slate-300"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Baru */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors"
                                                size={17}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Minimal 8 karakter"
                                                className="w-full pl-12 pr-4 py-4 bg-[#F5FAF7] border border-[#D4EDE5] rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 text-sm placeholder:text-slate-300"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        onClick={handleReset}
                                        disabled={isLoading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                                    >
                                        {isLoading
                                            ? <><Loader2 className="animate-spin" size={18} /> Memproses...</>
                                            : <><KeyRound size={16} /> Ganti Password Sekarang</>
                                        }
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* ── SUCCESS STATE ─────────────────────────────── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-[2rem] border border-[#D4EDE5] shadow-sm p-12 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                    className="w-24 h-24 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-8"
                                >
                                    <CheckCircle2 size={46} className="text-emerald-500" />
                                </motion.div>

                                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                        Berhasil
                                    </span>
                                </div>

                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                                    Password Diperbarui!
                                </h2>
                                <p className="text-slate-400 text-sm font-medium">
                                    Anda akan diarahkan ke halaman login secara otomatis dalam beberapa detik.
                                </p>

                                <div className="mt-8 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 3, ease: 'linear' }}
                                    />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                                    Mengarahkan ke Login...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}