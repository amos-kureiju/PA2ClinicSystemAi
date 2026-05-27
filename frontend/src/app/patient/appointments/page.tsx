'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, User, Stethoscope, CheckCircle,
    XCircle, AlertCircle, Plus, Search,
    ChevronRight, Phone, CalendarDays, Sparkles
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';

interface Appointment {
    id: number;
    patient_name: string;
    patient_phone: string;
    doctor_name: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    confirmed: { label: 'Dikonfirmasi', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
    pending:   { label: 'Menunggu',     bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
    completed: { label: 'Selesai',      bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
    cancelled: { label: 'Dibatalkan',   bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status || 'Pending', bg: '#f8fafc', text: '#475569', border: '#e2e8f0', dot: '#94a3b8' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
            letterSpacing: '0.01em',
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

function formatDate(dateStr: string) {
    try { return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return dateStr; }
}
function formatTime(dateStr: string) {
    try { return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
}

function AppointmentsContent() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [formData, setFormData] = useState({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
    const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

    useEffect(() => { fetchAppointments(); fetchDoctors(); }, []);

    const fetchAppointments = async () => {
        try { const res = await api.get('/clinic/appointments/me'); setAppointments(res.data); }
        catch { setAppointments([]); }
        finally { setLoading(false); }
    };

    const fetchDoctors = async () => {
        try { const res = await api.get('/clinic/doctors'); setDoctors(res.data); }
        catch { setDoctors([]); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus({ type: 'loading', msg: 'Mengirim...' });
        try {
            await api.post('/clinic/appointments', formData);
            setSubmitStatus({ type: 'success', msg: 'Janji temu berhasil dibuat!' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
            fetchAppointments();
            setTimeout(() => { setShowForm(false); setSubmitStatus({ type: '', msg: '' }); }, 2000);
        } catch {
            setSubmitStatus({ type: 'error', msg: 'Gagal membuat janji temu. Coba lagi.' });
            setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 3000);
        }
    };

    const tabs = [
        { id: 'all',       label: 'Semua',        count: appointments.length },
        { id: 'pending',   label: 'Menunggu',      count: appointments.filter(a => a.status === 'pending').length },
        { id: 'confirmed', label: 'Dikonfirmasi',  count: appointments.filter(a => a.status === 'confirmed').length },
        { id: 'completed', label: 'Selesai',       count: appointments.filter(a => a.status === 'completed').length },
    ];

    const filtered = appointments.filter(apt => {
        if (filter !== 'all' && apt.status !== filter) return false;
        if (searchQuery && !apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '11px 14px 11px 42px',
        fontSize: 13, fontWeight: 500, color: '#1e293b',
        backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0',
        borderRadius: 10, outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* ── HERO HEADER ── */}
            <div style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)',
                padding: '40px 24px 56px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: 60, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />

                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        {/* Badge */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 999, marginBottom: 14, border: '1px solid rgba(255,255,255,0.15)' }}>
                            <CalendarDays size={11} color="#6ee7b7" />
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#a7f3d0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Manajemen Janji Temu</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>Janji Temu Saya</h1>
                                <p style={{ fontSize: 13, color: '#a7f3d0', margin: '6px 0 0', fontWeight: 400 }}>Kelola semua jadwal kunjungan Anda dengan mudah</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setShowForm(!showForm)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '11px 20px', backgroundColor: '#fff',
                                    color: '#065f46', border: 'none', borderRadius: 12,
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    flexShrink: 0,
                                }}
                            >
                                <Plus size={15} /> Buat Janji Baru
                            </motion.button>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Total', value: appointments.length, color: '#6ee7b7' },
                                { label: 'Menunggu', value: appointments.filter(a => a.status === 'pending').length, color: '#fcd34d' },
                                { label: 'Dikonfirmasi', value: appointments.filter(a => a.status === 'confirmed').length, color: '#6ee7b7' },
                                { label: 'Selesai', value: appointments.filter(a => a.status === 'completed').length, color: '#93c5fd' },
                            ].map(stat => (
                                <div key={stat.label} style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)' }}>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: 500 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 40px' }}>

                {/* ── FORM ── */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}
                            style={{ marginBottom: 24 }}
                        >
                            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sparkles size={16} color="#059669" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Formulir Janji Temu Baru</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Isi semua kolom dengan lengkap</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                        {/* Nama */}
                                        <div style={{ position: 'relative' }}>
                                            <User size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input type="text" placeholder="Nama Lengkap" required value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} style={inputStyle} />
                                        </div>
                                        {/* Telepon */}
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input type="text" placeholder="Nomor WhatsApp" required value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })} style={inputStyle} />
                                        </div>
                                        {/* Dokter */}
                                        <div style={{ position: 'relative' }}>
                                            <Stethoscope size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
                                            <select required value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                                <option value="">-- Pilih Dokter --</option>
                                                {doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>)}
                                            </select>
                                        </div>
                                        {/* Tanggal */}
                                        <div style={{ position: 'relative' }}>
                                            <Clock size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input type="datetime-local" required value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <button type="submit" style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                                            {submitStatus.type === 'loading' ? 'Memproses...' : 'Kirim Janji Temu'}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                            Batal
                                        </button>
                                        {submitStatus.msg && (
                                            <span style={{ fontSize: 12, fontWeight: 600, color: submitStatus.type === 'success' ? '#059669' : submitStatus.type === 'error' ? '#dc2626' : '#0d9488', padding: '8px 12px', backgroundColor: submitStatus.type === 'success' ? '#f0fdf4' : submitStatus.type === 'error' ? '#fef2f2' : '#f0fdfa', borderRadius: 8 }}>
                                                {submitStatus.msg}
                                            </span>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── SEARCH ── */}
                <div style={{ position: 'relative', marginBottom: 16 }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text" placeholder="Cari berdasarkan nama dokter..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 42px', fontSize: 13, fontWeight: 500, color: '#1e293b', backgroundColor: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    />
                </div>

                {/* ── TABS ── */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            style={{
                                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                                backgroundColor: filter === tab.id ? '#059669' : '#fff',
                                color: filter === tab.id ? '#fff' : '#64748b',
                                boxShadow: filter === tab.id ? '0 4px 12px rgba(5,150,105,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            {tab.label}
                            <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75 }}>({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* ── LIST ── */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ width: 36, height: 36, border: '3px solid #d1fae5', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Memuat janji temu...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Calendar size={24} color="#cbd5e1" />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>Belum Ada Janji Temu</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Buat janji temu pertama Anda dengan dokter spesialis kami</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtered.map((apt, idx) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                style={{
                                    backgroundColor: '#fff', borderRadius: 14,
                                    border: '1.5px solid #e2e8f0', padding: '16px 20px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.15s, border-color 0.15s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#d1fae5'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                                        {/* Avatar */}
                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #059669, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Stethoscope size={20} color="#fff" />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.doctor_name}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
                                                    <Calendar size={11} color="#059669" />
                                                    {formatDate(apt.appointment_date)}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
                                                    <Clock size={11} color="#059669" />
                                                    {formatTime(apt.appointment_date)} WIB
                                                </span>
                                            </div>
                                            {apt.notes && (
                                                <div style={{ marginTop: 8, padding: '6px 10px', backgroundColor: '#f0fdf4', borderRadius: 7, fontSize: 11, color: '#065f46', fontWeight: 500 }}>
                                                    {apt.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                        <StatusBadge status={apt.status} />
                                        <ChevronRight size={15} color="#cbd5e1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Memuat...</p>
            </div>
        }>
            <AppointmentsContent />
        </Suspense>
    );
}