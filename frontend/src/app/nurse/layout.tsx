'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    ClipboardList,
    Users2,
    LogOut,
    Menu,
    X,
    Loader2,
    Stethoscope,
    HeartPulse,
    Bell,
    Moon,
    ChevronDown,
} from 'lucide-react';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [nurseName, setNurseName] = useState('Perawat');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        const name = localStorage.getItem('user_name') || 'Perawat';

        if (!token) {
            router.push('/login');
        } else if (role?.toLowerCase() !== 'nurse') {
            alert('⛔ Akses ditolak: Area ini khusus untuk Perawat');
            router.push('/login');
        } else {
            setIsAuthorized(true);
            setNurseName(name);
        }
    }, [router]);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_name');
            Cookies.remove('token');
            Cookies.remove('role');
            router.push('/login');
        }
    };

    const navItems = [
        { name: 'Dashboard',      href: '/nurse',          icon: LayoutDashboard },
        { name: 'Antrian Hari Ini', href: '/nurse/queue',  icon: ClipboardList },
        { name: 'Daftar Pasien',  href: '/nurse/patients', icon: Users2 },
        { name: 'Layanan Klinik', href: '/nurse/services', icon: Stethoscope },
        { name: 'Catatan Medis',  href: '/nurse/records',  icon: ClipboardList },
    ];

    const currentPage = navItems.find(i => i.href === pathname)?.name || 'Nurse Panel';

    // Inisial nama
    const initials = nurseName
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();

    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                    <HeartPulse className="text-teal-500 animate-pulse" size={28} />
                </div>
                <Loader2 className="animate-spin text-teal-400" size={24} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Memverifikasi Akses Perawat...
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F0FAF5] text-[#1E293B] font-sans">

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <aside className={`
                fixed lg:sticky lg:top-0 z-50
                w-[260px] h-screen bg-white
                border-r border-slate-100
                shadow-[2px_0_16px_rgba(0,0,0,0.04)]
                flex flex-col transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Logo */}
                <div className="h-[64px] px-5 flex items-center gap-3 border-b border-slate-100 shrink-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600
                                    rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
                        <HeartPulse size={18} className="text-white" />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-sm font-black tracking-tight text-slate-800">
                            Klinik.<span className="text-teal-600">AI</span>
                        </h1>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            Nurse System
                        </p>
                    </div>
                </div>

                {/* Profil mini */}
                <div className="px-4 py-4 border-b border-slate-50 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500
                                        flex items-center justify-center text-white font-black text-xs shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-700 truncate">
                                NAULI DENTAL CARE
                            </p>
                            <p className="text-[10px] text-teal-500 font-semibold truncate">{nurseName}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-3">
                        Nurse Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all cursor-pointer group
                                        ${isActive
                                            ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                                            : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                                        }`}
                                >
                                    {/* Active bar kiri */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nurse-active-bar"
                                            className="absolute -left-3 w-1 h-5 bg-teal-700 rounded-r-full"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                        ${isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-teal-100/60'}`}>
                                        <Icon size={15} className={isActive ? 'text-white' : 'text-teal-500'} />
                                    </div>
                                    <span className={`text-[12px] font-bold tracking-tight
                                        ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-teal-700'}`}>
                                        {item.name}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-slate-100 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                   text-slate-400 hover:text-red-600 hover:bg-red-50
                                   text-[12px] font-bold transition-all group"
                    >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-red-100 transition-colors">
                            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── MAIN ────────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

                {/* Header — sama persis seperti dokter */}
                <header className="h-[64px] bg-white/80 backdrop-blur-md border-b border-slate-100
                                   px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">

                    {/* Kiri: hamburger + judul halaman */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        {/* Divider + judul */}
                        <div className="hidden lg:block w-px h-5 bg-slate-200" />
                        <h2 className="text-[11px] font-black text-slate-700 tracking-[0.15em] uppercase
                                       border-l-2 border-teal-500 pl-3">
                            {currentPage}
                        </h2>
                    </div>

                    {/* Kanan: notif + dark mode dummy + profil */}
                    <div className="flex items-center gap-2">

                        {/* Bell */}
                        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            {/* Badge angka */}
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full
                                             flex items-center justify-center text-[8px] font-black text-white border border-white">
                                3
                            </span>
                        </button>

                        {/* Moon (dark mode toggle placeholder) */}
                        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                            <Moon size={16} />
                        </button>

                        <div className="w-px h-5 bg-slate-200 mx-1" />

                        {/* Profil dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 pl-1 pr-3 py-1.5
                                           rounded-xl hover:bg-slate-50 border border-slate-100
                                           hover:border-slate-200 transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500
                                                flex items-center justify-center text-white font-black text-[11px] shadow-sm">
                                    {initials}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-[11px] font-black text-slate-800 leading-tight">{nurseName}</p>
                                    <p className="text-[9px] font-bold text-teal-500 uppercase tracking-wider">Perawat</p>
                                </div>
                                <ChevronDown size={12} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl
                                                   shadow-xl border border-slate-100 overflow-hidden z-50"
                                    >
                                        {/* Header dropdown */}
                                        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-xs">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white leading-tight">{nurseName}</p>
                                                    <p className="text-[10px] text-teal-200 mt-0.5">Perawat</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                                                           text-red-500 hover:bg-red-50 text-xs font-bold transition-all"
                                            >
                                                <LogOut size={13} /> Keluar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="max-w-[1500px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Backdrop mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Backdrop dropdown profil */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
            )}
        </div>
    );
}