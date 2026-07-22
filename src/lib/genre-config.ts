import { Genre } from '@/generated/prisma';

export const GENRE_CONFIG: Record<Genre, {
  label: string;
  description: string;
  accentColor: string;
  accentHover: string;
  bgPattern: string;
  particleType: string;
  gradientFrom: string;
  gradientTo: string;
}> = {
  KOSMOS: {
    label: 'Kosmos',
    description: 'Alam semesta, bintang, galaksi, dan misteri angkasa',
    accentColor: '#fbbf24', // amber-400
    accentHover: '#f59e0b', // amber-500
    bgPattern: 'stars',
    particleType: 'stars',
    gradientFrom: '#0f172a', // slate-900
    gradientTo: '#1e1b4b', // indigo-950
  },
  ALAM: {
    label: 'Alam',
    description: 'Kisah indah tentang alam, hutan, lautan, dan makhluk hidup',
    accentColor: '#34d399', // emerald-400
    accentHover: '#10b981', // emerald-500
    bgPattern: 'leaves',
    particleType: 'leaves',
    gradientFrom: '#022c22', // emerald-950
    gradientTo: '#064e3b', // emerald-900
  },
  ROMANCE: {
    label: 'Romance',
    description: 'Cinta, perasaan, dan hubungan yang mendalam',
    accentColor: '#f472b6', // pink-400
    accentHover: '#ec4899', // pink-500
    bgPattern: 'petals',
    particleType: 'petals',
    gradientFrom: '#4a044e', // pink-950
    gradientTo: '#831843', // pink-900
  },
  HOROR: {
    label: 'Horor',
    description: 'Ketegangan, misteri, dan rasa takut yang menggugah',
    accentColor: '#ef4444', // red-500
    accentHover: '#dc2626', // red-600
    bgPattern: 'fog',
    particleType: 'fog',
    gradientFrom: '#450a0a', // red-950
    gradientTo: '#1f2937', // gray-900
  },
  KONSPIRASI: {
    label: 'Konspirasi',
    description: 'Rahasia tersembunyi, teori, dan kebenaran gelap',
    accentColor: '#eab308', // yellow-500
    accentHover: '#ca8a04', // yellow-600
    bgPattern: 'grid',
    particleType: 'particles',
    gradientFrom: '#422006', // yellow-950
    gradientTo: '#1f2937', // gray-900
  },
};

export const GENRE_LABELS: Record<Genre, string> = {
  KOSMOS: 'Kosmos',
  ALAM: 'Alam',
  ROMANCE: 'Romance',
  HOROR: 'Horor',
  KONSPIRASI: 'Konspirasi',
};

export const GENRE_DESCRIPTIONS: Record<Genre, string> = {
  KOSMOS: 'Alam semesta, bintang, galaksi, dan misteri angkasa',
  ALAM: 'Kisah indah tentang alam, hutan, lautan, dan makhluk hidup',
  ROMANCE: 'Cinta, perasaan, dan hubungan yang mendalam',
  HOROR: 'Ketegangan, misteri, dan rasa takut yang menggugah',
  KONSPIRASI: 'Rahasia tersembunyi, teori, dan kebenaran gelap',
};

export function getGenreConfig(genre: Genre) {
  return GENRE_CONFIG[genre] || GENRE_CONFIG.KOSMOS;
}

export function getAllGenres() {
  return Object.entries(GENRE_CONFIG).map(([key, value]) => ({
    key: key as Genre,
    ...value,
  }));
}