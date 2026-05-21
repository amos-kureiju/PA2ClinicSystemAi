'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    Search, ClipboardList, User, Calendar,
    ChevronRight, FileText, Activity, X,
    Stethoscope, Pill, MapPin, Loader2,
    Download, Printer, UserCheck, AlertCircle
} from 'lucide-react';

export default function AdminMedicalRecords() {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        api.get('/clinic/medical-records')
            .then(res => setRecords(Array.isArray(res.data) ? res.data : []))
            .catch(err => {
                console.error("Gagal mengambil data rekam medis:", err);
                setRecords([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Safety Filter: Mencegah error .toLowerCase() pada data null
    const filteredRecords = records.filter((r: any) => {
        const name = (r.patient_name || '').toLowerCase();
        const diagnosis = (r.diagnosis || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || diagnosis.includes(search);
    });

    // Format Tanggal Indonesia
    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "Tanggal tidak valid";
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return "Format error"; }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10">

            {/* --- TOP STATS BAR --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Arsip</p>
                        <h3 className="text-xl font-black text-slate-800">{records.length} Record</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien Terdaftar</p>
                        <h3 className="text-xl font-black text-slate-800">
                            {[...new Set(records.map(r => r.patient_name))].length} Pasien
                        </h3>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] shadow-lg flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-white/5">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database</p>
                        <h3 className="text-xl font-black text-emerald-400 uppercase italic tracking-tighter">Sync Active</h3>
                    </div>
                </div>
            </div>

            {/* --- HEADER & SEARCH --- */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic flex items-center gap-3">
                            <ClipboardList className="text-emerald-500" size={28} /> Central Medical Records
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem Informasi Rekam Medis Nauli Dental Care</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100">
                            <Printer size={18} />
                        </button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau diagnosa..."
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all italic shadow-inner text-slate-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE CONTENT --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Pasien</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hasil Diagnosa</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tgl Kunjungan</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Opsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-24 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /></td></tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center flex flex-col items-center gap-3">
                                    <AlertCircle className="text-slate-200" size={40} />
                                    <p className="font-bold text-slate-300 italic uppercase text-xs tracking-widest">Belum ada data tersedia</p>
                                </td></tr>
                            ) : filteredRecords.map((r: any) => (
                                <tr key={r.id} className="group hover:bg-emerald-50/30 transition-all cursor-pointer" onClick={() => setSelectedRecord(r)}>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg uppercase italic transform group-hover:rotate-6 transition-transform">
                                                {(r.patient_name || "?").charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm uppercase italic tracking-tight">{r.patient_name || "Tanpa Nama"}</p>
                                                <p className="text-[9px] font-black text-slate-400 mt-1 uppercase bg-slate-100 w-fit px-2 py-0.5 rounded-full">ND-{(r.id || 0).toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm font-bold text-slate-600 italic line-clamp-1">{r.diagnosis || "Belum didiagnosa"}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase border border-emerald-100">{r.treatment || "Umum"}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-700 italic">{formatDate(r.created_at).split(' ')[0]} {formatDate(r.created_at).split(' ')[1]}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(r.created_at).getFullYear()}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                            Buka Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DETAIL — Portal agar blur full screen termasuk sidebar --- */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedRecord && (
                        <div
                            className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                            style={{ zIndex: 99999 }}
                            onClick={() => setSelectedRecord(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative overflow-hidden border-[8px] border-white"
                            >
                                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 w-full" />

                                <div className="p-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 shadow-inner">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black uppercase italic text-slate-800 tracking-tighter">Ringkasan Medis</h2>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arsip Nauli Dental • ND-{selectedRecord.id}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedRecord(null)} className="p-2 bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl transition-all">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Identitas Pasien</label>
                                                <h3 className="text-xl font-black text-slate-800 uppercase italic">{selectedRecord.patient_name || "N/A"}</h3>
                                                <p className="text-xs font-bold text-teal-600 mt-1">{formatDate(selectedRecord.created_at)}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-100">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Dokter Pemeriksa</label>
                                                <div className="flex items-center gap-3 font-bold text-slate-700">
                                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                        <Stethoscope size={16} />
                                                    </div>
                                                    {selectedRecord.doctor_name || "dr. Septian Adi"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100">
                                                <label className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-2">Analisa Diagnosa</label>
                                                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                                                    &quot;{selectedRecord.diagnosis || "Tidak ada data diagnosa"}&quot;
                                                </p>
                                            </div>
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
                                                <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">Prosedur Medis</label>
                                                <p className="text-sm font-black text-slate-800 flex items-center gap-2 italic">
                                                    <Pill size={16} className="text-blue-500" /> {selectedRecord.treatment || "Konsultasi Umum"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                                        <label className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] block mb-3 italic">
                                            Instruksi Dokter & Catatan Resep
                                        </label>
                                        <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                                            {selectedRecord.notes || "Pasien disarankan untuk menjaga kebersihan gigi dan melakukan kontrol rutin 6 bulan sekali."}
                                        </p>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
                                        <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-black text-teal-600 hover:text-teal-800 transition-all uppercase tracking-widest">
                                            Cetak Dokumen <Printer size={14} />
                                        </button>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 italic">
                                            <MapPin size={12} /> Terverifikasi Digital • Klinik Nauli
                                        </p>
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