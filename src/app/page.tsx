'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Star, Clock, Eye, Heart, ChevronRight } from 'lucide-react';
import { StoryGrid } from '@/components/story/StoryGrid';
import { getGenreConfig, GENRE_LABELS, formatNumber, formatReadTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const featuredStories = [
  {
    id: '1',
    title: 'Simfoni Bintang yang Mati',
    slug: 'simfoni-bintang-yang-mati',
    tagline: 'Di ruang hampa, hanya memori yang bersinar',
    synopsis: 'Kapten Elara Voss menemukan sinyal misterius dari bintang neutron yang seharusnya sudah mati jutaan tahun lalu. Sinyal itu membawa melodi—simfoni yang hanya bisa didengar oleh mereka yang pernah kehilangan seseorang sayang.',
    genre: 'KOSMOS',
    coverImageUrl: null,
    chapterCount: 12,
    totalReadTime: 45,
    viewCount: 12500,
    likeCount: 3420,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    title: 'Hutan di Balik Matahari',
    slug: 'hutan-di-balik-matahari',
    tagline: 'Di mana cahaya tidak pernah menyentuh tanah',
    synopsis: 'Peneliti botani Dr. Maya Sutanto menemukan ekosistem tersembunyi di sisi gelap Mercury. Tanaman-tanaman di sana tidak berfotosintesis—mereka makan radiasi. Dan mereka sadar.',
    genre: 'ALAM',
    coverImageUrl: null,
    chapterCount: 8,
    totalReadTime: 32,
    viewCount: 8900,
    likeCount: 2100,
    status: 'PUBLISHED',
  },
];

const latestStories = [
  {
    id: '3',
    title: 'Cinta di Antara Meteor',
    slug: 'cinta-di-antara-meteor',
    tagline: 'Dua jiwa, satu orbit, tak terduga',
    synopsis: 'Pilot antariksa dan insinyur komunikasi terjebak di kapsul darurat selama badai meteor. Dalam 72 jam menunggu penyelamatan, mereka menemukan cinta lebih kuat dari gravitasi.',
    genre: 'ROMANCE',
    coverImageUrl: null,
    chapterCount: 10,
    totalReadTime: 38,
    viewCount: 5600,
    likeCount: 1890,
    status: 'PUBLISHED',
  },
  {
    id: '4',
    title: 'Bisikan dari Lubang Hitam',
    slug: 'bisikan-dari-lubang-hitam',
    tagline: 'Suara yang tidak seharusnya ada',
    synopsis: 'Tim peneliti Station Kepler-442 mendengar bisikan dari lubang hitam supermasif. Bisukan itu memprediksi masa depan mereka—dan satu per satu, ramalan itu jadi kenyataan.',
    genre: 'HOROR',
    coverImageUrl: null,
    chapterCount: 15,
    totalReadTime: 58,
    viewCount: 7200,
    likeCount: 1560,
    status: 'PUBLISHED',
  },
  {
    id: '5',
    title: 'Proyek Orion: Rahasia NASA',
    slug: 'proyek-orion-rahasia-nasa',
    tagline: 'Kebenaran yang disembunyikan 50 tahun',
    synopsis: 'Jurnalis investigasi mengungkap dokumen terkunci tentang misi Apollo 18 yang resmi tidak pernah ada. Apa yang mereka temukan di bulan mengubah pemahaman kita tentang asal-usul manusia.',
    genre: 'KONSPIRASI',
    coverImageUrl: null,
    chapterCount: 20,
    totalReadTime: 75,
    viewCount: 9800,
    likeCount: 2340,
    status: 'PUBLISHED',
  },
  {
    id: '6',
    title: 'Lautan Debu di Mars',
    slug: 'lautan-debu-di-mars',
    tagline: 'Kolonis pertama, misteri kuno',
    synopsis: 'Koloni Mars pertama menemukan struktur di bawah Olympus Mons yang lebih tua dari peradaban manusia. Di dalamnya, peta menuju bintang-bintang yang belum pernah kita lihat.',
    genre: 'KOSMOS',
    coverImageUrl: null,
    chapterCount: 18,
    totalReadTime: 68,
    viewCount: 6400,
    likeCount: 1780,
    status: 'PUBLISHED',
  },
];

const popularStories = [
  {
    id: '1',
    title: 'Simfoni Bintang yang Mati',
    slug: 'simfoni-bintang-yang-mati',
    tagline: 'Di ruang hampa, hanya memori yang bersinar',
    synopsis: 'Kapten Elara Voss menemukan sinyal misterius dari bintang neutron yang seharusnya sudah mati jutaan tahun lalu...',
    genre: 'KOSMOS',
    coverImageUrl: null,
    chapterCount: 12,
    totalReadTime: 45,
    viewCount: 12500,
    likeCount: 3420,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    title: 'Hutan di Balik Matahari',
    slug: 'hutan-di-balik-matahari',
    tagline: 'Di mana cahaya tidak pernah menyentuh tanah',
    synopsis: 'Peneliti botani Dr. Maya Sutanto menemukan ekosistem tersembunyi di sisi gelap Mercury...',
    genre: 'ALAM',
    coverImageUrl: null,
    chapterCount: 8,
    totalReadTime: 32,
    viewCount: 8900,
    likeCount: 2100,
    status: 'PUBLISHED',
  },
  {
    id: '7',
    title: 'Cinta yang Terlewat Waktu',
    slug: 'cinta-yang-terlewat-waktu',
    tagline: 'Dia menunggu 300 tahun di stasiun ruang angkasa',
    synopsis: 'Seorang astronot terjebak dalam loop waktu, bertemu kembali dengan cinta masa lalnya di setiap iterasi...',
    genre: 'ROMANCE',
    coverImageUrl: null,
    chapterCount: 14,
    totalReadTime: 52,
    viewCount: 11200,
    likeCount: 2980,
    status: 'PUBLISHED',
  },
  {
    id: '8',
    title: 'Rahasia di Bawah Es Europa',
    slug: 'rahasia-di-bawah-es-europa',
    tagline: 'Mereka sudah di sini sebelum kita tiba',
    synopsis: 'Misi penetrasi es Europa menemukan peradaban di bawah lautan subsurface. Dan mereka tidak senang kita datang.',
    genre: 'HOROR',
    coverImageUrl: null,
    chapterCount: 16,
    totalReadTime: 62,
    viewCount: 10500,
    likeCount: 2650,
    status: 'PUBLISHED',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center cosmic-bg star-field overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0], 
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge variant="genre" className="text-sm mb-4 inline-block px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1" />
              Platform Cerita AI-First
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Cerita<span className="gradient-text">Kosmos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Platform cerita digital generasi baru. Semua cerita—judul, sinopsis, bab, hingga cover—dihasilkan sepenuhnya oleh AI. 
            Pengalaman baca seperti buku fisik: efek balik halaman, bookmark, mode malam, tipografi premium.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/genre/KOSMOS">
              <Button size="xl" className="gap-2 w-full sm:w-auto">
                <BookOpen className="w-5 h-5" />
                Mulai Membaca
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto border-slate-700 hover:border-amber-500">
                <Sparkles className="w-5 h-5" />
                Buat Cerita AI
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            <StatCard icon={BookOpen} value="50+" label="Cerita Tersedia" />
            <StatCard icon={Star} value="5" label="Genre Unik" />
            <StatCard icon={Clock} value="200+" label="Jam Bacaan" />
            <StatCard icon={Heart} value="10K+" label="Pembaca Aktif" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </motion.div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 lg:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryGrid
            stories={featuredStories}
            title="Cerita Unggulan"
            subtitle="Koleksi terbaik yang dipilih oleh tim kami—setiap cerita adalah karya seni AI yang memukau."
            variant="featured"
            showViewAll
            viewAllHref="/unggulan"
          />
        </div>
      </section>

      {/* Latest Stories */}
      <section className="py-16 lg:py-24 bg-slate-950/50 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryGrid
            stories={latestStories}
            title="Cerita Terbaru"
            subtitle="Yang baru saja dipublikasikan—jadilah yang pertama membaca kisah-kisah segar dari AI."
            variant="default"
            showViewAll
            viewAllHref="/terbaru"
          />
        </div>
      </section>

      {/* Popular Stories */}
      <section className="py-16 lg:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryGrid
            stories={popularStories}
            title="Terpopuler Minggu Ini"
            subtitle="Cerita yang paling banyak dibaca dan disukai komunitas."
            variant="default"
            showViewAll
            viewAllHref="/terpopuler"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 cosmic-bg star-field relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 sm:p-12"
          >
            <Sparkles className="w-16 h-16 mx-auto text-amber-500 mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ingin Cerita Sendiri?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Masukkan genre, tema, dan tone yang kamu inginkan. AI kami akan menghasilkan cerita lengkap—dari judul hingga cover—in hitungan menit.
            </p>
            <Link href="/admin">
              <Button size="xl" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Buat Cerita Sekarang
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center">
      <Icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
      <p className="font-display text-3xl font-bold text-amber-400 mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}