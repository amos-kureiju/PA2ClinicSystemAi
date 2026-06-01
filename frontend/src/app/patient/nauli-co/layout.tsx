'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'About', href: '/nauli-co/about' },
    { label: "What's New", href: '/nauli-co/whats-new' },
    { label: 'Register as Partner', href: '/nauli-co/register-partner' },
    { label: 'Contact', href: '/nauli-co/contact' },
];

export default function NauliCoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoErr, setLogoErr] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── NAVBAR ─────────────────────────────────────────── */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
                    : 'bg-white border-b border-slate-100'
                }`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-6">

                    {/* Kiri: back + logo */}
                    <div className="flex items-center gap-4">
                        {/* Tombol kembali ke patient portal */}
                        <Link
                            href="/patient/dashboard"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400
                                       hover:text-emerald-600 transition-colors uppercase tracking-widest"
                        >
                            <ChevronLeft size={14} />
                            Portal Utama
                        </Link>

                        <div className="hidden sm:block w-px h-5 bg-slate-200" />

                        {/* Logo NauliCo */}
                        <Link href="/nauli-co/about" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm overflow-hidden">
                                {!logoErr ? (
                                    <Image
                                        src="/images/logo1.png"
                                        alt="NauliCo"
                                        width={32} height={32}
                                        className="object-cover w-full h-full"
                                        onError={() => setLogoErr(true)}
                                    />
                                ) : (
                                    <span className="text-white font-black text-sm">N</span>
                                )}
                            </div>
                            <span className="text-base font-black text-slate-900 tracking-tight">
                                NAULI<span className="text-emerald-600">CO</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(link => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all
                                        ${isActive
                                            ? 'text-emerald-600'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nauli-co-nav-underline"
                                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 rounded-full"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA kanan */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/nauli-co/register-partner">
                            <button className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white
                                               text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200">
                                Join Now
                            </button>
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
                        >
                            <div className="px-6 py-4 space-y-1">
                                <Link
                                    href="/patient/dashboard"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                                               text-slate-400 hover:text-emerald-600 transition-colors"
                                    onClick={() => setOpen(false)}
                                >
                                    <ChevronLeft size={14} /> Portal Utama
                                </Link>
                                <div className="h-px bg-slate-100 mx-4" />
                                {NAV_LINKS.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                            ${pathname === link.href
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link href="/nauli-co/register-partner" onClick={() => setOpen(false)}>
                                    <button className="w-full mt-2 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl">
                                        Join Now
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── CONTENT ────────────────────────────────────────── */}
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}