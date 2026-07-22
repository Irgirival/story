import Link from 'next/link';
import { BookOpen, MessageSquare, GitBranch, Mail, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { getAllGenres } from '@/lib/genre-config';

export function Footer() {
  const genres = getAllGenres();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="CeritaKosmos Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-xl font-bold text-slate-100 tracking-tight">CeritaKosmos</span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs mb-6">
              Platform cerita digital generasi baru. Semua cerita&mdash;judul, sinopsis, bab, hingga cover&mdash;dihasilkan sepenuhnya oleh AI. 
              Dibuat dengan cinta untuk para pencinta cerita di seluruh alam semesta.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Twitter/X">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="GitHub">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Discord">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Jelajahi Genre</h3>
            <ul className="space-y-3">
              {genres.map((genre) => (
                <li key={genre.key}>
                  <Link
                    href={`/genre/${genre.key.toLowerCase()}`}
                    className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: genre.accentColor + '20', color: genre.accentColor }}>
                      {genre.label.charAt(0)}
                    </span>
                    <span>{genre.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Cepat Akses</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terbaru" className="text-slate-300 hover:text-amber-400 transition-colors">Cerita Terbaru</Link>
              </li>
              <li>
                <Link href="/terpopuler" className="text-slate-300 hover:text-amber-400 transition-colors">Terpopuler</Link>
              </li>
              <li>
                <Link href="/favorit" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favorit Saya
                </Link>
              </li>
              <li>
                <Link href="/riwayat" className="text-slate-300 hover:text-amber-400 transition-colors">Riwayat Baca</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Dapatkan rekomendasi cerita terbaru dan update fitur langsung di email Anda.
            </p>
            <form className="flex flex-col gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="email@anda.com"
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium hover:from-amber-400 hover:to-orange-400 transition-all">
                Berlangganan
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} CeritaKosmos. Dibuat dengan 
              <Heart className="w-4 h-4 inline text-red-500" aria-hidden="true" /> 
              dan AI.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privasi</Link>
              <Link href="/terms" className="hover:text-amber-400 transition-colors">Syarat</Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">Kontak</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}