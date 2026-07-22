import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) return '< 1 menit baca';
  if (minutes < 60) return `${minutes} menit baca`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} jam ${mins} menit baca` : `${hours} jam baca`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Re-export from genre-config for compatibility
export { getGenreConfig, GENRE_LABELS, GENRE_DESCRIPTIONS, getAllGenres } from './genre-config';

// Legacy getGenreConfig for components still using the old shape
export function getGenreConfigLegacy(genre: string) {
  const configs: Record<string, { accent: string; bg: string; particle: string }> = {
    KOSMOS: {
      accent: '#fbbf24', // amber-400
      bg: 'bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950',
      particle: 'stars',
    },
    ALAM: {
      accent: '#22c55e', // green-500
      bg: 'bg-gradient-to-br from-slate-950 via-green-950/30 to-slate-950',
      particle: 'leaves',
    },
    ROMANCE: {
      accent: '#f43f5e', // rose-500
      bg: 'bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950',
      particle: 'hearts',
    },
    HOROR: {
      accent: '#dc2626', // red-600
      bg: 'bg-gradient-to-br from-slate-950 via-red-950/30 to-slate-950',
      particle: 'mist',
    },
    KONSPIRASI: {
      accent: '#eab308', // yellow-500
      bg: 'bg-gradient-to-br from-slate-950 via-yellow-950/30 to-slate-950',
      particle: 'particles',
    },
  };
  return configs[genre] || configs.KOSMOS;
}