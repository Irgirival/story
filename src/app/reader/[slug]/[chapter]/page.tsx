'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sun, Moon, BookOpen, Menu, X, FontSize, Settings, Bookmark, Heart, Share2, Download, RotateCcw, Home, Search, User, Volume2, VolumeX } from 'lucide-react';
import { getGenreConfig, GENRE_LABELS, formatReadTime, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ReaderPageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

type ReadingMode = 'dark' | 'light' | 'sepia';

const modeConfigs: Record<ReadingMode, { bg: string; text: string; name: string; icon: React.ReactNode }> = {
  dark: { bg: 'bg-slate-950', text: 'text-slate-100', name: 'Gelap', icon: <Moon className="w-4 h-4" /> },
  light: { bg: 'bg-slate-50', text: 'text-slate-900', name: 'Terang', icon: <Sun className="w-4 h-4" /> },
  sepia: { bg: 'bg-amber-50', text: 'text-amber-950', name: 'Sepia', icon: <Sun className="w-4 h-4" /> },
};

const mockStory = {
  id: '1',
  title: 'Petualangan di Ujung Bintang',
  slug: 'kosmos-petualangan-bintang',
  genre: 'KOSMOS',
  chapterCount: 24,
  chapters: Array.from({ length: 24 }, (_, i) => ({
    id: `ch-${i + 1}`,
    chapterNumber: i + 1,
    title: `Bab ${i + 1}: ${['Pertemuan di Kepler', 'Sinyal dari Masa Lalu', 'Wormhole Terbuka', 'Peradaban Tersembunyi', 'Pilihan Kapten', 'Akhir yang Baru'][i % 6] || `Petualangan ${i + 1}`}`,
    readTimeMinutes: Math.floor(Math.random() * 8) + 5,
    content: generateChapterContent(i + 1),
  })),
};

function generateChapterContent(chapterNum: number): string {
  const templates = [
    `Kapten Aria Voss duduk di kursi komando, matanya menatap layar navigasi yang memancarkan cahaya biru ke ruang gelap jembatan kendali. Kapal antariksa "Aurora" telah berlayar selama 14 bulan, menembus jarak 400 tahun cahaya dari Bumi. Di depannya, sistem Kepler-442 berputar diam-diam, bintang induknya mengeluarkan radiasi lembut yang menari-nari di antara asteroid.

Sinyal itu datang tanpa предупредицинг—gelombang radio frekuensi rendah yang berulang setiap 2.73 detik. Polanya terlalu sempurna untuk alami, terlalu kompleks untuk acak. Itu adalah kode. Dan yang paling mengejutkan, itu menggunakan protokol komunikasi NASA yang ditinggalkan 200 tahun lalu.

"Aria," suara Commander Reyes memecah keheningan. "Ini tidak mungkin."

Dia tidak menjawab. Jarinya menari di atas konsol, mengisolasi sinyal, memecahkannya lapis demi lapis. Di dalam gelombang pembawa, tersembunyi lapisan kedua: audio. Suara manusia. Nyanyian.

Lagu itu ia kenal. Ibu kandungnya menyanyikannya setiap malam sebelum tidur—lagu Jawa kuno tentang bintang dan harapan. Tapi bagaimana lagu itu bisa sampai di sini, di ujung galaksi, dari peradaban yang seharusnya tidak pernah ada?`,

    `Jembatan kendali sunyi, hanya dengaran gemetar mesin pendingin dan napas tercekik kru. Di layar utama, planet Kepler-442c membesar—dunia hijau-biru dengan dua bulan, atmosfera kaya oksigen, Lautan yang memantulkan cahaya bintang induknya.

"Persiapkan tim turun," perintah Aria, suaranya tenang tapi keras. "Kita butuh jawaban, bukan spekulasi."

Dr. Chen, ilmuwan peneliti xeno-biologi, mengangguk. Dia sudah menunggu momen ini selama karier penuh. Tas sampelnya sudah siap, alat ukur dikalibrasi. Tapi di matanya, Aria melihat ketakutan—bukan ketakutan mati, tapi ketakutan menemukan sesuatu yang tidak seharusnya diketahui manusia.

"Kapten," suara Operator Comms, Lt. Park, naik beberapa oktav. "Sinyalnya... berubah. Sekarang mengirim koordinat. Spesifik. Di permukaan."

Koordinat itu menunjuk ke gunung tertinggi di benua utara—Gunung Olympus lokal, puncaknya menembus awan. Di puncak itu, sesuai data orbital, tidak ada apa-apa kecuali batu dan es.

"Tetapkan jalur," kata Aria. "Kita turun besok pagi."`,

    `Wormhole tidak seperti di film. Tidak ada cahaya berwarna-warni, tidak ada suara gemuruh. Hanya keheningan mutlak, lalu—perpindahan. Sebentar Aurora ada di orbit Kepler, selanjutnya di sistem bintang yang tidak tercatat di peta mana pun.

Bintang di sini merah tua, tua, mendekati akhir hayatnya. Di orbitnya, struktur raksasa melingkar—Cincin Dyson setengah jadi, atau mungkin sisa peradaban yang gagal melengkapi proyek ambisiusnya.

"Scan hasilnya," kata Reyes, matanya melebar. "Teknologi... lebih maju dari kita 10.000 tahun. Tapi desain intinya—basis kodenya—mirip. Terlalu mirip."

Aria merasakan dingin merambat di punggungnya. "Maksudmu..."

"Maksudku, kapten," kata Dr. Chen, suara gemetar, "adalah bahwa siapa pun yang membangun ini, mereka berasal dari Bumi. Atau nenek moyang kita. Kode pemrograman mereka menggunakan logika ternary yang sama dengan kuno—logika yang kita temukan di tablet sumer, di papirus Mesir, di tulisan Maya."

Di layar, simbol-simbol muncul. Bukan matematika universal. Bahan kimia. Struktur DNA. Dan di tengah-tengahnya, satu urutan genetika yang Aria kenal—kode genetika keluarganya, yang dia tes tahun lalu dari rasa penasaran.

"Ini tidak mungkin," bisiknya.

"Kapten," Park kembali. "Transmasuk. Dari struktur itu. Ke kita."

Layar berkedip. Pesan teks muncul, dalam Bahasa Indonesia yang sempurna, dialek Jawa tengah:

"Selamat datang pulang, Cucu. Kami menunggu 50.000 tahun."`,

    `Peradaban tersembunyi tidak di planet, tapi di dalam bintang itu sendiri. Makhluk-makhluk plasma, hidup di suhu jutaan derajat, berpikir dengan kecepatan cahaya. Mereka bukan alien—mereka adalah masa depan umat manusia.

"Kami adalah kalian," suara bergema di kepala Aria, bukan dari speaker. "Kami yang memilih untuk tinggal, ketika kalian memilih untuk pergi. Kami yang mengubah bintang menjadi rumah, ketika kalian mencari planet lain."

Memori banjir masuk—bukan milik Aria, tapi milik mereka. Peradaban manusia 50.000 tahun mendatang, yang telah menyebar ke seluruh galaksi, lalu runtuh karena perang antarbintang. Sekelompok ilmuwan memilih tidak lari. Mereka menyuntikkan kesadaran ke plasma bintang, jadi abadi, jadi dewa.

"Tapi kenapa..." Aria tersendat. "Kenapa sinyal? Kenapa lagu ibu?"

"Karena kalian butuh diingatkan," jawab suara itu, lembut seperti angin. "Kalian lupa siapa kalian. Kalian lupa kalian bukan sekadar tulang dan daging. Kalian bintang yang belajar bernapas."

Di ruang rapat, tidak ada yang bicara. Reyes menatap tangannya, seolah melihat plasma di bawah kulitnya. Chen menangis pelan. Park berdoa.

Aria menutup matanya. Dan untuk pertama kalinya dalam 14 bulan, dia merasa—pulang.`,

    `Pilihan itu datang lebih cepat dari yang Aria duga. Bintang merah tua itu tidak stabil. Inti fusiunya gagal, dan dalam 72 jam, akan meledak supernova—menghancurkan struktur, peradaban plasma, dan semua jawaban.

"Kita bisa bawa mereka," kata Reyes. "Muatan data Aurora cukup untuk 10 juta kesadaran. Kita bisa simpan mereka, bawa pulang ke Bumi."

"Dan jika mereka menolak?" tanya Chen. "Mereka sudah memilih jalannya. Memaksa mereka... itu bukan penyelamatan. Itu pengeksploitasian."

Aria berdiri di jendela pengamat, menatap bintang yang akan mati. Di depannya, massa plasma raksasa bergerak—membentuk wajah, lalu huruf, lalu lagu.

Ibu kandungnya. Menyanyikan lagu Jawa.

Dia mengerti. Bukan tentang menyelamatkan. Tentang menghormati.

"Kita tidak akan memaksa," kata Aria, suaranya tenang di tengah gemuruh peringatan collision alarm. "Kita akan menyaksikan. Kita akan mencatat. Kita akan membawa cerita mereka—bukan mereka sendiri."

Di seluruh kapal, layar menampilkan pesan terakhir dari peradaban plasma:

"Terima kasih, Cucu. Ceritakan pada bintang-bintang lain: kami di sini. Kami selalu di sini. Dalam setiap cahaya yang kalian lihat, kami menatap balik."

Lalu bintang meledak. Cahaya putih menelan segalanya. Dan di ruang hampa, hanya tersisa satu sinyal radio—lagu ibu, dipancarkan ke seluruh galaksi.`,

    `Epilog: 3 tahun kemudian.

Aurora mendarat di Bumi. Aria keluar dari kapsul, kaki menyentuh tanah kelahiran pertama kali dalam 17 tahun. Udara terasa berbeda—lebih tebal, lebih hangat, berbau hujan dan tanah.

Di depannya, ribuan orang berkumpul. Jurnalis, ilmuwan, anak-anak sekolah, orang tua. Semua ingin tahu: apa yang kau temukan di sana?

Aria tersenyum. Dia mengeluarkan buku catatan kecil—kertas asli, bukan digital. Membukanya di halaman pertama.

"Saya menemukan," katanya, suara terbawa mikrofon, "bahwa kita tidak sendirian. Bahwa di setiap bintang yang kalian lihat di malam hari, ada mata yang menatap balik. Bahwa lagu ibu saya bukan cuma milik kami—milik seluruh galaksi."

Dia mulai membaca. Dan di seluruh dunia, layar menampilkan teks yang sama—cerita tentang peradaban plasma, tentang wormhole, tentang pilihan seorang kapten.

Di ujung pidatonya, Aria menutup buku.

"Dan kalau kalian bertanya," katanya, menatap langit sore di mana bintang pertama mulai keluar, "kenapa saya pulang? Karena ibu saya selalu bilang: 'Bintang paling terang bukan yang paling jauh. Tapi yang paling dekat ke hati.'"

Di langit, bintang pertama berkedip. Seolah menjawab.`
  ];
  
  return templates[(chapterNum - 1) % templates.length] + '\n\n' + templates[(chapterNum) % templates.length];
}

export default function ReaderPage({ params }: ReaderPageProps) {
  const { slug, chapter: chapterParam } = params;
  const chapterNum = parseInt(chapterParam, 10);
  const story = mockStory;
  const chapter = story.chapters.find(c => c.chapterNumber === chapterNum);
  
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Bab Tidak Ditemukan</h1>
          <Link href={`/story/${slug}`}>
            <Button variant="outline" className="mt-4">Kembali ke Detail Cerita</Button>
          </Link>
        </div>
      </div>
    );
  }

  const genreConfig = getGenreConfig(story.genre);
  const prevChapter = chapterNum > 1 ? story.chapters[chapterNum - 2] : null;
  const nextChapter = chapterNum < story.chapterCount ? story.chapters[chapterNum] : null;
  const paragraphs = chapter.content.split('\n\n').filter(p => p.trim().length > 0);

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [readingMode, setReadingMode] = useState<ReadingMode>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const progressTimeout = useRef<NodeJS.Timeout>();

  const modeConfig = modeConfigs[readingMode];
  const totalParagraphs = paragraphs.length;

  const saveProgress = useCallback((position: number) => {
    const progress = Math.round(position);
    setReadingProgress(progress);
    
    if (progressTimeout.current) {
      clearTimeout(progressTimeout.current);
    }
    
    progressTimeout.current = setTimeout(() => {
      // In production: save to database
      localStorage.setItem(`reading-progress-${slug}`, JSON.stringify({
        chapter: chapterNum,
        position: progress,
        timestamp: Date.now(),
      }));
    }, 1000);
  }, [slug, chapterNum]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const position = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    saveProgress(position);
  }, [saveProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (nextChapter) window.location.href = `/reader/${slug}/${chapterNum + 1}`;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          if (readerRef.current) {
            readerRef.current.scrollBy({ top: readerRef.current.clientHeight * 0.85, behavior: 'smooth' });
          }
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 't':
          setShowTOC(!showTOC);
          break;
        case 'm':
          const modes: ReadingMode[] = ['dark', 'light', 'sepia'];
          const currentIndex = modes.indexOf(readingMode);
          setReadingMode(modes[(currentIndex + 1) % modes.length]);
          break;
        case 'Escape':
          setShowSettings(false);
          setShowTOC(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slug, chapterNum, nextChapter, readingMode, showSettings, showTOC]);

  // Restore progress
  useEffect(() => {
    const saved = localStorage.getItem(`reading-progress-${slug}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.chapter === chapterNum && data.position > 0) {
          setTimeout(() => {
            if (readerRef.current) {
              const maxScroll = readerRef.current.scrollHeight - readerRef.current.clientHeight;
              readerRef.current.scrollTop = (data.position / 100) * maxScroll;
            }
          }, 200);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [slug, chapterNum]);

  // Swipe detection
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStart.current.x;
    const dy = touchEnd.clientY - touchStart.current.y;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx > 0 && prevChapter) {
        window.location.href = `/reader/${slug}/${chapterNum - 1}`;
      } else if (dx < 0 && nextChapter) {
        window.location.href = `/reader/${slug}/${chapterNum + 1}`;
      }
    }
    
    touchStart.current = null;
  };

  return (
    <div className={cn('min-h-screen flex flex-col', modeConfig.bg, modeConfig.text, 'transition-colors duration-300')}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-950/95 to-transparent px-4 py-3 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link 
            href={`/story/${slug}`}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Kembali ke detail cerita"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </Link>
          
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <Badge variant="genre" className="text-xs whitespace-nowrap" style={{ background: `linear-gradient(135deg, ${genreConfig.accentColor}, ${genreConfig.accentHover})` }}>
              {GENRE_LABELS[story.genre] || story.genre}
            </Badge>
            <h1 className="text-sm font-medium truncate text-slate-100">{story.title}</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-400" onClick={() => setShowTOC(true)} aria-label="Daftar isi">
              <BookOpen className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-400" onClick={() => setShowSettings(true)} aria-label="Pengaturan">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-14 left-0 right-0 z-30 h-1 bg-slate-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 origin-left"
          style={{ transform: `scaleX(${readingProgress / 100})` }}
          animate={{ scaleX: readingProgress / 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Reader Content */}
      <main className="flex-1 pt-20 pb-32 px-4" ref={readerRef} onScroll={handleScroll} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="max-w-3xl mx-auto">
          {/* Chapter Header */}
          <div className="mb-10 text-center">
            <Badge variant="genre" className="text-sm mb-4 inline-block" style={{ background: `linear-gradient(135deg, ${genreConfig.accentColor}, ${genreConfig.accentHover})` }}>
              Bab {chapter.chapterNumber} dari {story.chapterCount}
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2 text-slate-100">
              {chapter.title}
            </h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              <span>{formatReadTime(chapter.readTimeMinutes)}</span>
              <span>•</span>
              <span>{paragraphs.length} paragraf</span>
            </p>
          </div>

          {/* Content */}
          <article className="prose-story" style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
            <AnimatePresence mode="popLayout">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="mb-8 text-justify"
                  style={{ 
                    textIndent: index === 0 ? 0 : '2.5em',
                    textAlign: 'justify',
                    hyphens: 'auto',
                  }}
                >
                  {paragraph.trim()}
                </motion.p>
              ))}
            </AnimatePresence>
          </article>

          {/* End of Chapter */}
          <div className="mt-16 mb-12 text-center">
            <Separator className="my-8 mx-auto max-w-xs" />
            <div className="flex items-center justify-center gap-3">
              <span className="text-slate-500 text-sm">— Akhir Bab {chapter.chapterNumber} —</span>
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950/95 to-transparent px-4 py-3 backdrop-blur-sm border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={prevChapter ? `/reader/${slug}/${chapterNum - 1}` : '#'}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              prevChapter 
                ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700' 
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
            )}
            onClick={(e) => { if (!prevChapter) e.preventDefault(); }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Bab Sebelumnya</span>
          </Link>

          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs text-slate-500">
              Bab {chapterNum} / {story.chapterCount}
            </span>
            <Progress value={readingProgress} max={100} className="w-full max-w-xs h-1.5" />
          </div>

          <Link
            href={nextChapter ? `/reader/${slug}/${chapterNum + 1}` : `/story/${slug}`}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              nextChapter
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
            )}
          >
            <span className="hidden sm:inline">{nextChapter ? 'Bab Selanjutnya' : 'Selesai'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Pengaturan baca"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Pengaturan Baca</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} aria-label="Tutup pengaturan">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Tabs defaultValue="display" className="space-y-6">
                <TabsList className="bg-slate-800 p-1">
                  <TabsTrigger value="display">Tampilan</TabsTrigger>
                  <TabsTrigger value="font">Font</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                </TabsList>

                <TabsContent value="display" className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-3">Mode Baca</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(modeConfigs).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setReadingMode(key as ReadingMode)}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-center',
                            readingMode === key
                              ? 'border-amber-500 bg-amber-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          )}
                        >
                          {config.icon}
                          <span className="block text-xs mt-1">{config.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3">Orientasi</label>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => document.documentElement.style.setProperty('--reader-orientation', 'vertical')}
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Vertikal
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => document.documentElement.style.setProperty('--reader-orientation', 'horizontal')}
                      >
                        <RotateCcw className="w-5 h-5 mr-2 rotate-90" />
                        Horizontal
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="font" className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex justify-between">
                      Ukuran Font
                      <span className="text-amber-400">{fontSize}px</span>
                    </label>
                    <Slider
                      min={14}
                      max={26}
                      step={1}
                      value={fontSize}
                      onValueChange={setFontSize}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex justify-between">
                      Jarak Baris
                      <span className="text-amber-400">{lineHeight}</span>
                    </label>
                    <Slider
                      min={1.5}
                      max={2.5}
                      step={0.1}
                      value={lineHeight}
                      onValueChange={setLineHeight}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex justify-between">
                      Lebar Baca
                      <span className="text-amber-400">720px</span>
                    </label>
                    <Slider
                      min={500}
                      max={900}
                      step={50}
                      value={720}
                      onValueChange={(v) => document.documentElement.style.setProperty('--max-content-width', `${v}px`)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Text-to-Speech</p>
                      <p className="text-sm text-slate-500">Dengarkan cerita dibacakan (eksperimental)</p>
                    </div>
                    <Switch 
                      checked={ttsPlaying} 
                      onCheckedChange={setTtsPlaying} 
                      aria-label="Aktifkan text-to-speech"
                    />
                  </div>
                  {ttsPlaying && (
                    <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-sm text-slate-400">Fitur TTS dalam pengembangan. Gunakan fitur baca keras browser (Ctrl+Shift+U di Chrome).</p>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          <VolumeX className="w-4 h-4 mr-1" />
                          Hentikan
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Ulangi Paragraf
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table of Contents */}
      <AnimatePresence>
        {showTOC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowTOC(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Daftar isi"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-md max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Daftar Bab</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowTOC(false)} aria-label="Tutup daftar isi">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {story.chapters.map((ch, index) => (
                  <Link
                    key={ch.id}
                    href={`/reader/${slug}/${ch.chapterNumber}`}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl transition-all',
                      ch.chapterNumber === chapterNum
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-slate-800/50 hover:bg-slate-800'
                    )}
                    onClick={() => setShowTOC(false)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                        ch.chapterNumber === chapterNum
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-700 text-slate-400'
                      )}>
                        {ch.chapterNumber}
                      </span>
                      <div>
                        <p className="font-medium text-slate-100 truncate max-w-[200px]">{ch.title}</p>
                        <p className="text-xs text-slate-500">{formatReadTime(ch.readTimeMinutes)}</p>
                      </div>
                    </div>
                    {ch.chapterNumber === chapterNum && (
                      <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                        Dibaca
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link
                  href={`/story/${slug}`}
                  className="flex items-center justify-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
                  onClick={() => setShowTOC(false)}
                >
                  <Home className="w-4 h-4" />
                  Kembali ke Detail Cerita
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}