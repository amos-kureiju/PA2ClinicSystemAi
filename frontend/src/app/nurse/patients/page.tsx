'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Users2, Search, Loader2, Mail, Calendar } from 'lucide-react';

interface Patient {
    id: number;
    full_name?: string;   // optional — antisipasi field null dari DB
    email?: string;
    created_at?: string;
    total_appointments?: number;
}

export default function NursePatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/clinic/patients');

                // Pastikan res.data adalah array sebelum disimpan ke state
                const raw = Array.isArray(res.data) ? res.data : [];
                setPatients(raw);
            } catch (err: any) {
                console.error('Gagal memuat data pasien:', err);
                setFetchError('Gagal memuat data pasien. Coba refresh halaman.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // ── Filter null-safe: tidak crash walau full_name/email undefined ─────────
    const filtered = patients.filter(p => {
        const name = (p.full_name ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        const q = searchTerm.toLowerCase();
        return name.includes(q) || email.includes(q);
    });

    // ── Helper: inisial avatar, fallback "?" jika nama kosong ────────────────
    const getInitial = (name?: string) =>
        name?.trim() ? name.trim().charAt(0).toUpperCase() : '?';

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Pasien</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">
                    {patients.length} pasien terdaftar di sistem
                </p>
            </div>

            {/* Error banner */}
            {fetchError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-xl">
                    {fetchError}
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                    type="text"
                    placeholder="Cari nama atau email pasien..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-400 outline-none transition-all shadow-sm"
                />
            </div>

            {/* States */}
            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-teal-500 mx-auto" size={32} />
                    <p className="text-xs text-slate-400 mt-3">Memuat data pasien...</p>
                </div>

            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <Users2 size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-bold">
                        {searchTerm ? 'Tidak ada pasien cocok dengan pencarian' : 'Belum ada data pasien'}
                    </p>
                    {/* Tip debugging: tampilkan contoh key dari data pertama jika ada */}
                    {patients.length > 0 && searchTerm === '' && (
                        <p className="text-[10px] text-slate-300 mt-2">
                            Field tersedia: {Object.keys(patients[0]).join(', ')}
                        </p>
                    )}
                </div>

            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((patient, i) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-teal-200 transition-all"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {/* Avatar — null-safe */}
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center font-black text-teal-700 text-lg shrink-0">
                                    {getInitial(patient.full_name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800 truncate">
                                        {patient.full_name || <span className="text-slate-300 italic">Nama tidak tersedia</span>}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                                        <Mail size={10} />
                                        {patient.email || '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar size={10} />
                                    {/* Fallback 0 jika total_appointments undefined */}
                                    {patient.total_appointments ?? 0} kunjungan
                                </span>
                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                                    Aktif
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}