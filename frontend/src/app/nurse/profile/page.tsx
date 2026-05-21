'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    User, Mail, ShieldCheck, Phone, Briefcase,
    Calendar, Award, Lock, Edit3, MapPin,
    CheckCircle, Clock, ChevronRight, Camera,
    Stethoscope, HeartPulse, AlertCircle, Loader2,
    Star, Building2, IdCard, KeyRound
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/clinic/profile/me')
            .then(res => { setProfile(res.data); setIsLoading(false); })
            .catch(err => { console.error(err); setError("Gagal memuat data profil."); setIsLoading(false); });
    }, []);

    // ── Loading ───────────────────────────────────────────────────────────
    if (isLoading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <HeartPulse size={28} className="text-emerald-500 animate-pulse" />
            </div>
            <Loader2 className="animate-spin text-emerald-400" size={22} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Profil...</p>
        </div>
    );

    // ── Error ─────────────────────────────────────────────────────────────
    if (error || !profile) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertCircle size={28} className="text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-500">{error || "Profil tidak ditemukan"}</p>
        </div>
    );

    // ── Stat cards data ───────────────────────────────────────────────────
    const statCards = [
        { label: 'Pasien Selesai', value: profile.stats?.total_handled ?? 0, icon: Award, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { label: 'Tahun Pengalaman', value: profile.details?.experience ?? '0', icon: Briefcase, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
        { label: 'Role Akun', value: profile.role, icon: ShieldCheck, iconBg: 'bg-slate-50', iconColor: 'text-slate-600' },
        { label: 'ID Staff', value: `#${profile.id ?? '—'}`, icon: IdCard, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">

            {/* ── HERO CARD ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
            >
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />

                <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">

                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-emerald-50">
                            {profile.details?.photo_url ? (
                                <img src={profile.details.photo_url} className="w-full h-full object-cover" alt={profile.full_name} />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-4xl font-black">
                                    {profile.full_name?.charAt(0) ?? '?'}
                                </div>
                            )}
                        </div>
                        {/* Online dot */}
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                        {/* Camera overlay */}
                        <button className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/30 flex items-center justify-center text-transparent hover:text-white transition-all duration-200">
                            <Camera size={20} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {profile.full_name}
                                </h1>
                                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600
                                                 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                    {profile.role} Terverifikasi
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
                                <Mail size={13} className="text-emerald-500" />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
                                <Phone size={13} className="text-emerald-500" />
                                {profile.details?.phone || 'Belum diset'}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
                                <MapPin size={13} className="text-emerald-500" />
                                Klinik Nauli Dental, Balige
                            </div>
                        </div>
                    </div>

                    {/* Edit button */}
                    <button className="shrink-0 flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white
                                       px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                        <Edit3 size={14} /> Edit Profil
                    </button>
                </div>
            </motion.div>

            {/* ── STAT CARDS ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5
                                   flex flex-col items-center text-center hover:shadow-md hover:border-emerald-100 transition-all"
                    >
                        <div className={`w-10 h-10 ${s.iconBg} ${s.iconColor} rounded-xl flex items-center justify-center mb-3`}>
                            <s.icon size={18} />
                        </div>
                        <p className="text-lg font-black text-slate-800 leading-none">{s.value}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1.5">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── MAIN GRID ─────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* ── Kiri: Info + Security ─────────────────────────────── */}
                <div className="md:col-span-2 space-y-6">

                    {/* Informasi Profesional */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                                Informasi Profesional
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                {
                                    label: 'Spesialisasi Klinis',
                                    value: profile.details?.specialty || 'General Medical Staff',
                                    icon: Stethoscope,
                                    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600'
                                },
                                {
                                    label: 'Lokasi Penugasan',
                                    value: 'Klinik Nauli Dental, Balige',
                                    icon: Building2,
                                    iconBg: 'bg-teal-50', iconColor: 'text-teal-600'
                                },
                                {
                                    label: 'Nomor Izin Praktik (STR)',
                                    value: profile.details?.str_number || 'REG-99201-9928',
                                    icon: ShieldCheck,
                                    iconBg: 'bg-amber-50', iconColor: 'text-amber-600'
                                },
                                {
                                    label: 'Tanggal Bergabung',
                                    value: '12 Januari 2024',
                                    icon: Calendar,
                                    iconBg: 'bg-blue-50', iconColor: 'text-blue-600'
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-100 transition-all">
                                    <div className={`w-9 h-9 ${item.iconBg} ${item.iconColor} rounded-lg flex items-center justify-center shrink-0`}>
                                        <item.icon size={15} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Keamanan Akun */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900 rounded-2xl p-7 shadow-lg relative overflow-hidden"
                    >
                        {/* Dekorasi */}
                        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
                            <Lock size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <KeyRound size={16} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white">Keamanan Akun</h3>
                                <p className="text-[10px] text-slate-500 font-medium">Perbarui kata sandi Anda secara berkala</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                            <input
                                type="password"
                                placeholder="Masukkan password baru"
                                className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-3
                                           text-sm text-white placeholder-slate-500
                                           focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 outline-none
                                           transition-all"
                            />
                            <button className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3
                                               rounded-xl font-bold text-xs uppercase tracking-wider
                                               transition-all active:scale-95 shadow-md shadow-emerald-900/30">
                                Update Password
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* ── Kanan: Jadwal + Help ───────────────────────────────── */}
                <div className="space-y-6">

                    {/* Jadwal Praktik */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                    Jadwal Praktik
                                </h4>
                            </div>
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                                <Clock size={13} className="text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {(profile.details?.schedules?.length > 0
                                ? profile.details.schedules
                                : [
                                    { day: 'Senin', time: '08:00 - 16:00' },
                                    { day: 'Rabu', time: '08:00 - 16:00' },
                                    { day: 'Jumat', time: '08:00 - 16:00' },
                                ]
                            ).map((s: any, i: number) => (
                                <div key={i}
                                    className="flex items-center justify-between bg-slate-50 hover:bg-emerald-50
                                               border border-transparent hover:border-emerald-100
                                               px-4 py-3 rounded-xl transition-all group cursor-default">
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">
                                        {s.day}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600
                                                     bg-white px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-emerald-100">
                                        {s.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bantuan Admin */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/15 relative overflow-hidden"
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                                <HeartPulse size={16} className="text-white" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">
                                Bantuan Admin
                            </p>
                            <h5 className="font-black text-white text-sm mb-4 leading-snug">
                                Butuh perubahan data yang terkunci?
                            </h5>
                            <button className="flex items-center gap-2 text-[10px] font-black text-white/80
                                               hover:text-white hover:gap-3 transition-all uppercase tracking-wide">
                                Hubungi IT Support <ChevronRight size={13} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}