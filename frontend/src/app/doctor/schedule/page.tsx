'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Users, Clock, ArrowRight, Loader2,
    UserRound, Stethoscope, Sparkles, CalendarDays
} from 'lucide-react';

export default function DoctorDashboard() {
    const [todayPatients, setTodayPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        api.get('/clinic/appointments').then(res => {
            const filtered = res.data.filter((app: any) => app.status === 'confirmed');
            setTodayPatients(filtered);
        }).finally(() => setIsLoading(false));

        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── 1. WELCOME BANNER ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-8 border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />

                <div className="relative z-10 pl-5">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                        <Sparkles size={11} className="text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            Sesi Kerja Aktif
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                        Selamat Pagi, Dokter
                    </h1>
                    <p className="text-slate-500 text-sm mt-1.5">
                        Anda memiliki{' '}
                        <span className="font-bold text-emerald-600">{todayPatients.length} pasien</span>
                        {' '}yang sudah dikonfirmasi hari ini.
                    </p>
                </div>

                <Stethoscope
                    size={160}
                    className="absolute -right-8 -bottom-8 text-emerald-50 rotate-[-15deg] pointer-events-none"
                />
            </div>

            {/* ── 2. STAT CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Pasien Antre */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:border-emerald-200 transition-all group">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Pasien Antre
                        </p>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {isLoading ? '—' : todayPatients.length}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">pasien menunggu pemeriksaan</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-100">
                        <Users size={26} />
                    </div>
                </div>

                {/* Waktu Sekarang */}
                <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                            Waktu Sekarang
                        </p>
                        <h3 className="text-3xl font-bold text-white">
                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            <span className="text-emerald-400 text-base font-medium ml-2">WIB</span>
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 capitalize">
                            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                        <CalendarDays size={26} />
                    </div>
                </div>
            </div>

            {/* ── 3. DAFTAR ANTREAN ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Section Header */}
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                            <Users size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Antrean Pasien Hari Ini
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Pasien yang sudah dikonfirmasi admin
                            </p>
                        </div>
                    </div>
                    {!isLoading && todayPatients.length > 0 && (
                        <span className="text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">
                            {todayPatients.length} pasien
                        </span>
                    )}
                </div>

                {/* List */}
                <div className="p-5 space-y-3">
                    {isLoading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin mx-auto text-emerald-600 mb-3" size={28} />
                            <p className="text-sm text-slate-400">Memuat data pasien...</p>
                        </div>
                    ) : todayPatients.length > 0 ? (
                        todayPatients.map((app: any, i: number) => (
                            <div
                                key={app.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5FAF7] rounded-xl border border-transparent hover:border-emerald-200 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Nomor */}
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-700 text-sm shadow-sm border border-slate-100 flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">
                                            {app.patient_name}
                                        </p>
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                            <Clock size={10} className="text-emerald-500" />
                                            Estimasi:{' '}
                                            {new Date(app.appointment_date).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} WIB
                                        </p>
                                    </div>
                                </div>

                                <button className="mt-3 sm:mt-0 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 group self-start sm:self-auto">
                                    Mulai Periksa
                                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-16 text-center space-y-2">
                            <UserRound size={36} className="mx-auto text-slate-200" />
                            <p className="text-sm font-medium text-slate-400">
                                Belum ada pasien yang dikonfirmasi hari ini
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}