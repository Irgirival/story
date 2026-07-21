import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGenreConfig, getAllGenres, GENRE_LABELS, GENRE_DESCRIPTIONS } from '@/lib/genre-config';
import { StoryGrid } from '@/components/story/StoryGrid';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface GenrePageProps {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { genre } = await params;
  const genreUpper = genre.toUpperCase();
  const config = getGenreConfig(genreUpper as any);
  
  return {
    title: `${config.label} | CeritaKosmos`,
    description: `Baca cerita ${config.label.toLowerCase()} terbaik di CeritaKosmos. ${config.description}`,
    openGraph: {
      title: `${config.label} | CeritaKosmos`,
      description: config.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return getAllGenres().map((genre) => ({
    genre: genre.key.toLowerCase(),
  }));
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { genre } = await params;
  const genreUpper = genre.toUpperCase();
  const config = getGenreConfig(genreUpper as any);
  
  if (!config) {
    notFound();
  }

  // Mock data - in production, fetch from database
  const mockStories = Array.from({ length: 12 }, (_, i) => ({
    id: `story-${genre}-${i}`,
    title: `${config.label} Story ${i + 1}: ${['Bintang', 'Galaksi', 'Nebula', 'Planet', 'Matahari', 'Bulan', 'Asteroid', 'Kometa', 'Kosmonot', 'Alien', 'Wormhole', 'Supernova'][i]}`,
    slug: `${genre}-story-${i + 1}`,
    tagline: `Petualangan ${config.label.toLowerCase()} yang menakjubkan`,
    synopsis: `Dalam galaksi yang jauh, seorang penjelajah menemukan rahasia kuno yang bisa mengubah nasib seluruh umat manusia. Cerita ${config.label.toLowerCase()} penuh misteri dan keajaiban.`,
    genre: genreUpper,
    coverImageUrl: null,
    chapterCount: Math.floor(Math.random() * 20) + 5,
    totalReadTime: Math.floor(Math.random() * 120) + 30,
    viewCount: Math.floor(Math.random() * 10000) + 500,
    likeCount: Math.floor(Math.random() * 500) + 50,
    status: 'PUBLISHED',
  }));

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-16">
        {/* Genre Hero */}
        <section className={`relative min-h-[400px] flex items-end ${config.gradientFrom} ${config.gradientTo}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute inset-0 star-field" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
            
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Genre: {config.label}
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 mb-4">
                {config.label}
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 mb-8">
                {config.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {mockStories.length} Cerita
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {mockStories.reduce((sum, s) => sum + s.chapterCount, 0)} Bab
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z" />
                  </svg>
                  {mockStories.reduce((sum, s) => sum + s.viewCount, 0).toLocaleString()} Dilihat
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-12 sm:py-16 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StoryGrid
              stories={mockStories}
              title={`Semua Cerita ${config.label}`}
              subtitle={`Temukan ${mockStories.length} cerita ${config.label.toLowerCase()} yang menunggu dibaca`}
              showViewAll={false}
            />
          </div>
        </section>

        {/* Other Genres */}
        <section className="py-12 sm:py-16 bg-slate-900/50 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">Jelajahi Genre Lainnya</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getAllGenres()
                .filter(g => g.key !== genreUpper)
                .map((otherGenre) => (
                  <Link
                    key={otherGenre.key}
                    href={`/genre/${otherGenre.key.toLowerCase()}`}
                    className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${otherGenre.gradientFrom}, ${otherGenre.gradientTo})` }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: otherGenre.accentColor + '20' }}>
                      <span className="text-2xl" style={{ color: otherGenre.accentColor }}>
                        {otherGenre.label.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">{otherGenre.label}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{otherGenre.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}