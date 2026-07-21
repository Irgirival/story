'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, BookOpen, Search, User, LogOut, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getAllGenres } from '@/lib/genre-config';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const genres = getAllGenres();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="CeritaKosmos Home">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-slate-950" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">CeritaKosmos</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/genre/KOSMOS" 
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Kosmos
            </Link>
            <Link 
              href="/genre/ALAM" 
              className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors"
            >
              Alam
            </Link>
            <Link 
              href="/genre/ROMANCE" 
              className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors"
            >
              Romance
            </Link>
            <Link 
              href="/genre/HOROR" 
              className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors"
            >
              Horor
            </Link>
            <Link 
              href="/genre/KONSPIRASI" 
              className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors"
            >
              Konspirasi
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-amber-400" aria-label="Cari">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-amber-400 gap-1">
              <Sparkles className="w-4 h-4" />
              Generate
            </Button>
            <Button variant="cosmic" size="sm" className="gap-1">
              <User className="w-4 h-4" />
              Masuk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-slate-300"
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
              >
                <X className="w-8 h-8" />
              </Button>
              
              <div className="flex flex-col items-center gap-6 text-center">
                {genres.map((genre) => (
                  <Link
                    key={genre.key}
                    href={`/genre/${genre.key}`}
                    className="text-2xl font-bold hover:text-amber-400 transition-colors"
                    style={{ color: genre.accentColor }}
                    onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                  >
                    {genre.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 w-full max-w-xs px-8">
                <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}>
                  <Search className="w-5 h-5 mr-2" />
                  Cari Cerita
                </Button>
                <Button variant="cosmic" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Cerita Baru
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="w-5 h-5 mr-2" />
                  Masuk / Daftar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}