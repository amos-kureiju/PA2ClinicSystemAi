'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { BellRing, Calendar, Clock, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get('/clinic/admin/notifications/reservations');
                setNotifications(res.data);
            } catch (err) {
                console.error("Gagal memuat notifikasi", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
            {/* Header Section - Dibuat lebih formal */}
            <div className="flex items-center gap-5 border-b border-slate-200 pb-8">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <BellRing size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pusat Notifikasi</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Sistem Pemantauan Reservasi Masuk</p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Sinkronisasi Data...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BellRing size={24} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Tidak ada aktivitas reservasi baru.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif: any) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-emerald-300"
                        >
                            <div className="flex items-center gap-4">
                                {/* Inisial Pasien */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-b-2 ${notif.status === 'pending'
                                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    }`}>
                                    {notif.patient_name.charAt(0).toUpperCase()}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">
                                            {notif.patient_name}
                                        </h3>
                                        <div className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${notif.status === 'pending'
                                                ? 'bg-amber-100/50 text-amber-700 border-amber-200'
                                                : 'bg-emerald-100/50 text-emerald-700 border-emerald-200'
                                            }`}>
                                            {notif.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-emerald-500" />
                                            {notif.consultation_time} WIB
                                        </span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-emerald-500" />
                                            {notif.consultation_date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Indikator Waktu Masuk (Opsional dekorasi agar tidak kosong di sisi kanan) */}
                            <div className="hidden sm:block">
                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                    New Entry
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}