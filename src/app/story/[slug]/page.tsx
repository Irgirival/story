import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, BookOpen, Clock, Eye, Heart, Star, ChevronRight, Bookmark, Share2, Download } from 'lucide-react';
import { getGenreConfig, GENRE_LABELS, formatNumber, formatReadTime } from '@/lib/utils';
import { StoryDetail } from '@/components/story/StoryDetail';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  // In production, fetch from database
  return {
    title: `Cerita ${slug} | CeritaKosmos`,
    description: `Baca cerita ${slug} di CeritaKosmos. Pengalaman baca seperti buku fisik dengan mode gelap/terang/sepia.`,
    openGraph: {
      title: `Cerita ${slug} | CeritaKosmos`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  // Mock static params for demo
  return [
    { slug: 'kosmos-petualangan-bintang' },
    { slug: 'alam-hutan-tersembunyi' },
    { slug: 'romance-cinta-di-ujung-waktu' },
    { slug: 'horor-rumah-antu-di-gunung' },
    { slug: 'konspirasi-rahasia-pemerintahan' },
  ];
}

const genreColors: Record<string, string> = {
  KOSMOS: 'from-amber-500 to-orange-500',
  ALAM: 'from-green-500 to-emerald-500',
  ROMANCE: 'from-pink-500 to-rose-500',
  HOROR: 'from-red-500 to-red-600',
  KONSPIRASI: 'from-yellow-500 to-amber-600',
};

function getMockStory(slug: string) {
  const stories: Record<string, any> = {
    'kosmos-petualangan-bintang': {
      id: '1',
      title: 'Petualangan di Ujung Bintang',
      slug: 'kosmos-petualangan-bintang',
      tagline: 'Di antara nebula dan keabadian, dia menemukan rumah',
      synopsis: 'Kapten Aria Voss tidak pernah berharap menemukan kehidupan di sistem Kepler-442. Tapi sinyal yang diterima dari planet ke-3 mengubah segalanya—suara manusia, tua ratusan tahun, menyanyikan lagu ibu kandungnya. Petualangan melintasi wormhole, bertemu peradaban kuno, dan memilih antara menjaga janji atau menyelamatkan seluruh galaksi.',
      genre: 'KOSMOS',
      coverImageUrl: null,
      coverPrompt: 'Epic space opera book cover, nebula background, spaceship approaching mysterious planet, cinematic lighting, vibrant blues and purples with gold accents, highly detailed, 8k',
      chapterCount: 24,
      totalReadTime: 180,
      viewCount: 12500,
      likeCount: 890,
      status: 'PUBLISHED',
      createdAt: new Date('2024-01-15'),
      chapters: Array.from({ length: 24 }, (_, i) => ({
        id: `ch-${i + 1}`,
        chapterNumber: i + 1,
        title: `Bab ${i + 1}: ${['Pertemuan di Kepler', 'Sinyal dari Masa Lalu', 'Wormhole Terbuka', 'Peradaban Tersembunyi', 'Pilihan Kapten', 'Akhir yang Baru'][i % 6] || `Petualangan ${i + 1}`}`,
        readTimeMinutes: Math.floor(Math.random() * 8) + 5,
      })),
    },
    'alam-hutan-tersembunyi': {
      id: '2',
      title: 'Hutan Tersembunyi di Balik Kabut',
      slug: 'alam-hutan-tersembunyi',
      tagline: 'Di mana pohon-pohon berbisik dan air mengingat',
      synopsis: 'Maya pulang ke desa neneknya setelah 10 tahun pergi. Hutan di belakang rumah ternyata menyimpan portal ke dunia di mana pohon-pohon memiliki memori, sungai mengalir ke arah yang salah, dan makhluk-makhluk mitologi ternyata nyata. Dia harus memutuskan: tinggal di dunia modern yang tenang, atau jadi penjaga hutan leluhur.',
      genre: 'ALAM',
      coverImageUrl: null,
      coverPrompt: 'Mystical forest book cover, ancient trees with glowing runes, misty atmosphere, hidden portal in tree trunk, bioluminescent plants, ethereal green and gold lighting, fantasy art style',
      chapterCount: 18,
      totalReadTime: 135,
      viewCount: 8200,
      likeCount: 645,
      status: 'PUBLISHED',
      createdAt: new Date('2024-02-20'),
      chapters: Array.from({ length: 18 }, (_, i) => ({
        id: `ch-${i + 1}`,
        chapterNumber: i + 1,
        title: `Bab ${i + 1}: ${['Pulang ke Desa', 'Kabut yang Menipu', 'Pohon yang Berbicara', 'Sungai Terbalik', 'Penjaga Hutan', 'Warisan Nenek'][i % 6] || `Rahasia ${i + 1}`}`,
        readTimeMinutes: Math.floor(Math.random() * 7) + 5,
      })),
    },
    'romance-cinta-di-ujung-waktu': {
      id: '3',
      title: 'Cinta di Ujung Waktu',
      slug: 'romance-cinta-di-ujung-waktu',
      tagline: 'Mereka bertemu di masa lalu, berpisah di masa depan',
      synopsis: 'Elara dan Julian bertemu di perpustakaan kuno Paris, 1923. Tapi Julian adalah penjelajah waktu dari tahun 3045, tugasnya hanya mengamati—bukan mencintai. Ketika aturan waktu melarang mereka bersamaan, Elara menemukan cara menukar nyawanya dengan detik-detik kehidupan Julian. Cinta yang melanggar hukum fisika, berakhir di ujung waktu.',
      genre: 'ROMANCE',
      coverImageUrl: null,
      coverPrompt: 'Romantic book cover, vintage Paris library 1920s, couple reading together, clock melting in background, time travel elements, warm golden lighting, dust motes dancing, elegant serif typography, art nouveau style',
      chapterCount: 30,
      totalReadTime: 225,
      viewCount: 15800,
      likeCount: 1200,
      status: 'PUBLISHED',
      createdAt: new Date('2024-03-10'),
      chapters: Array.from({ length: 30 }, (_, i) => ({
        id: `ch-${i + 1}`,
        chapterNumber: i + 1,
        title: `Bab ${i + 1}: ${['Pertemuan di Perpustakaan', 'Rahasia Julian', 'Cinta Terlarang', 'Mesin Waktu', 'Pertukaran Nyawa', 'Ujung Waktu'][i % 6] || `Detik ${i + 1}`}`,
        readTimeMinutes: Math.floor(Math.random() * 6) + 5,
      })),
    },
    'horor-rumah-antu-di-gunung': {
      id: '4',
      title: 'Rumah Hantu di Puncak Gunung',
      slug: 'horor-rumah-antu-di-gunung',
      tagline: 'Beberapa pintu sebaiknya tidak pernah dibuka',
      synopsis: 'Kelompok teman hiking menemukan rumah tua di puncak gunung yang tidak ada di peta. Malam pertama, mereka mendengar anak-anak tertawa di dapur—padahal rumah itu kosong sejak 50 tahun. Satu per satu, mereka hilang. Yang tersisa menemukan kamera lama dengan foto-foto mereka... diambil dari dalam rumah, malam ini.',
      genre: 'HOROR',
      coverImageUrl: null,
      coverPrompt: 'Horror book cover, isolated old house on mountain peak, stormy night, lightning illuminating, dark windows with faint glow inside, fog creeping, ominous atmosphere, dark red and black color palette, terrifying',
      chapterCount: 15,
      totalReadTime: 112,
      viewCount: 9500,
      likeCount: 720,
      status: 'PUBLISHED',
      createdAt: new Date('2024-04-05'),
      chapters: Array.from({ length: 15 }, (_, i) => ({
        id: `ch-${i + 1}`,
        chapterNumber: i + 1,
        title: `Bab ${i + 1}: ${['Tiba di Puncak', 'Tawa di Malam', 'Pintu Terkunci', 'Foto di Kamera', 'Yang Pertama Hilang', 'Kebenaran di Lantai Bawah'][i % 6] || `Ketakutan ${i + 1}`}`,
        readTimeMinutes: Math.floor(Math.random() * 6) + 5,
      })),
    },
    'konspirasi-rahasia-pemerintahan': {
      id: '5',
      title: 'Rahasia di Balik Layar',
      slug: 'konspirasi-rahasia-pemerintahan',
      tagline: 'Kebenaran paling berbahaya adalah yang disembunyikan di depan mata',
      synopsis: 'Jurnalis investigasi Lena Marlowe menemukan dokumen bocor: program "Proyek Aurora" mengontrol media sosial, memanipulasi pemilu, dan memprediksi perilaku massa dengan akurasi 99.7%. Saat dia mengejar kebenaran, dia menyadari—dia sendiri adalah subjek uji coba nomor 7. Konspirasi yang tidak hanya mengubah dunia, tapi mengubah dirinya.',
      genre: 'KONSPIRASI',
      coverImageUrl: null,
      coverPrompt: 'Conspiracy thriller book cover, shadowy figure in front of wall of screens showing data, government building silhouette, redacted documents floating, yellow/amber warning lights, grid patterns, paranoid atmosphere, modern thriller aesthetic',
      chapterCount: 22,
      totalReadTime: 165,
      viewCount: 11200,
      likeCount: 980,
      status: 'PUBLISHED',
      createdAt: new Date('2024-05-12'),
      chapters: Array.from({ length: 22 }, (_, i) => ({
        id: `ch-${i + 1}`,
        chapterNumber: i + 1,
        title: `Bab ${i + 1}: ${['Dokumen Bocor', 'Proyek Aurora', 'Subjek Uji Coba 7', 'Jaringan Kebenaran', 'Pemburu dan Mangsa', 'Rahasia Terakhir'][i % 6] || `Kode ${i + 1}`}`,
        readTimeMinutes: Math.floor(Math.random() * 7) + 5,
      })),
    },
  };
  
  return stories[slug];
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getMockStory(slug);
  
  if (!story) {
    notFound();
  }

  const genreConfig = getGenreConfig(story.genre);
  const gradientClass = genreColors[story.genre] || 'from-amber-500 to-orange-500';

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Cover */}
        <section className="relative min-h-[500px] sm:min-h-[600px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />
          
          {story.coverImageUrl ? (
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ 
              background: `linear-gradient(135deg, ${genreConfig.gradientFrom}, ${genreConfig.gradientTo})` 
            }}>
              <div className="text-center px-8">
                <span className="text-8xl opacity-30 mb-4 block">📖</span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 mb-4">
                  {story.title}
                </h1>
                {story.tagline && (
                  <p className="text-xl text-amber-400 font-medium mb-6">{story.tagline}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Cover Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 pb-16 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="genre" className="text-sm px-3 py-1" style={{ background: `linear-gradient(135deg, ${genreConfig.accentColor}, ${genreConfig.accentHover})` }}>
                  {GENRE_LABELS[story.genre as keyof typeof GENRE_LABELS] || story.genre}
                </Badge>
                {story.status === 'PUBLISHED' && (
                  <Badge variant="secondary" className="text-xs">Published</Badge>
                )}
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-3">
                {story.title}
              </h1>
              
              {story.tagline && (
                <p className="text-lg sm:text-xl text-amber-400 font-medium mb-6 max-w-2xl">
                  {story.tagline}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {story.chapterCount} bab
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatReadTime(story.totalReadTime)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(story.viewCount)} dilihat
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {formatNumber(story.likeCount)} suka
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link href={`/reader/${story.slug}/1`}>
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 px-8">
                    <BookOpen className="w-5 h-5" />
                    Mulai Baca
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2 border-slate-700 hover:border-amber-500 hover:text-amber-400">
                  <Bookmark className="w-5 h-5" />
                  Simpan
                </Button>
                <Button variant="ghost" size="lg" className="gap-2 text-slate-300 hover:text-amber-400">
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Story Detail */}
        <section className="py-12 sm:py-16 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <StoryDetail 
              story={story} 
              userProgress={null} 
            />
          </div>
        </section>

        {/* Related Stories */}
        <section className="py-12 sm:py-16 bg-slate-900/50 border-t border-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">Mungkin Kamu Suka</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values({
                'kosmos-petualangan-bintang': getMockStory('kosmos-petualangan-bintang'),
                'alam-hutan-tersembunyi': getMockStory('alam-hutan-tersembunyi'),
                'romance-cinta-di-ujung-waktu': getMockStory('romance-cinta-di-ujung-waktu'),
                'horor-rumah-antu-di-gunung': getMockStory('horor-rumah-antu-di-gunung'),
                'konspirasi-rahasia-pemerintahan': getMockStory('konspirasi-rahasia-pemerintahan'),
              })
                .filter(s => s.slug !== slug)
                .slice(0, 3)
                .map((relatedStory) => (
                  <Link 
                    key={relatedStory.id} 
                    href={`/story/${relatedStory.slug}`}
                    className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] transition-all duration-300"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {relatedStory.coverImageUrl ? (
                        <Image
                          src={relatedStory.coverImageUrl}
                          alt={relatedStory.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ 
                          background: `linear-gradient(135deg, ${getGenreConfig(relatedStory.genre).gradientFrom}, ${getGenreConfig(relatedStory.genre).gradientTo})` 
                        }}>
                          <span className="text-6xl opacity-30">📖</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="genre" className="mb-2" style={{ background: `linear-gradient(135deg, ${getGenreConfig(relatedStory.genre).accentColor}, ${getGenreConfig(relatedStory.genre).accentHover})` }}>
                        {GENRE_LABELS[relatedStory.genre as keyof typeof GENRE_LABELS] || relatedStory.genre}
                      </Badge>
                      <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                        {relatedStory.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{relatedStory.synopsis}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {relatedStory.chapterCount} bab
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatReadTime(relatedStory.totalReadTime)}
                        </span>
                      </div>
                    </div>
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