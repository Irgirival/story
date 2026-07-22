'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Star, Clock, Eye, Heart } from 'lucide-react';
import { cn, formatNumber, formatReadTime, GENRE_LABELS } from '@/lib/utils';
import { getGenreConfig } from '@/lib/genre-config';
import { Badge } from '@/components/ui/badge';

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    slug: string;
    tagline?: string | null;
    synopsis: string;
    genre: string;
    coverImageUrl?: string | null;
    chapterCount: number;
    totalReadTime: number;
    viewCount: number;
    likeCount: number;
    status: string;
  };
  variant?: 'default' | 'featured' | 'compact';
  priority?: boolean;
}

export function StoryCard({ story, variant = 'default', priority = false }: StoryCardProps) {
  const genreConfig = getGenreConfig(story.genre as any);
  const isFeatured = variant === 'featured';

  const cardStyles = {
    default: 'group relative flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] hover:-translate-y-1',
    featured: 'group relative flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.15)] hover:-translate-y-1',
    compact: 'group relative flex flex-row h-auto min-h-[120px] bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-amber-500/30',
  };

  const imageStyles = {
    default: 'aspect-[2/3] w-full object-cover transition-transform duration-700 group-hover:scale-105',
    featured: 'aspect-[2/3] w-full object-cover transition-transform duration-700 group-hover:scale-105',
    compact: 'aspect-square w-32 flex-shrink-0 object-cover',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.2 }}
      className={cn(cardStyles[variant])}
    >
      <Link href={`/story/${story.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
        <div className="relative overflow-hidden">
          {story.coverImageUrl ? (
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              fill
              className={cn(imageStyles[variant])}
              sizes={isFeatured ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : '(max-width: 768px) 100vw, 33vw'}
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className={cn('w-full', isFeatured ? 'aspect-[2/3]' : variant === 'compact' ? 'aspect-square' : 'aspect-[2/3]', `bg-gradient-to-br from-[${genreConfig.gradientFrom}] to-[${genreConfig.gradientTo}]`)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-50">📖</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3">
            <Badge variant="genre" className="text-xs px-2 py-1">
              {GENRE_LABELS[story.genre as keyof typeof GENRE_LABELS] || story.genre}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 flex gap-1">
            <button className="p-2 rounded-full bg-slate-950/80 backdrop-blur-sm text-slate-300 hover:text-amber-400 hover:bg-slate-950 transition-colors" aria-label="Bookmark">
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 gap-3">
          <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
            {story.title}
          </h3>
          
          {story.tagline && (
            <p className="text-sm text-amber-400/80 font-medium line-clamp-1">{story.tagline}</p>
          )}

          <p className="text-sm text-slate-400 line-clamp-3 flex-1">
            {story.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-800 pt-3">
            <span className="flex items-center gap-1" title="Bab">
              <BookOpen className="w-3.5 h-3.5" />
              {story.chapterCount} bab
            </span>
            <span className="flex items-center gap-1" title="Waktu baca">
              <Clock className="w-3.5 h-3.5" />
              {formatReadTime(story.totalReadTime)}
            </span>
            <span className="flex items-center gap-1" title="Dilihat">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(story.viewCount)}
            </span>
            <span className="flex items-center gap-1" title="Disukai">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(story.likeCount)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}