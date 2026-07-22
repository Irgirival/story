'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, Heart, Star, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatNumber, formatReadTime, GENRE_LABELS } from '@/lib/utils';
import { getGenreConfig } from '@/lib/genre-config';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface StoryDetailProps {
  story: {
    id: string;
    title: string;
    slug: string;
    tagline?: string | null;
    synopsis: string;
    genre: string;
    coverImageUrl?: string | null;
    coverPrompt?: string | null;
    chapterCount: number;
    totalReadTime: number;
    viewCount: number;
    likeCount: number;
    status: string;
    createdAt: Date;
    chapters: {
      id: string;
      chapterNumber: number;
      title: string;
      readTimeMinutes: number;
    }[];
  };
  userProgress?: {
    currentChapter: number;
    lastPosition: number;
  } | null;
}

export function StoryDetail({ story, userProgress }: StoryDetailProps) {
  const genreConfig = getGenreConfig(story.genre as any);
  const continueChapter = userProgress?.currentChapter || 1;

  return (
    <div className="relative">
      <div className={cn('relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden', `bg-gradient-to-br from-[${genreConfig.gradientFrom}] to-[${genreConfig.gradientTo}]`)}>
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-30">📖</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="genre" className="text-sm px-3 py-1">
                {GENRE_LABELS[story.genre as keyof typeof GENRE_LABELS] || story.genre}
              </Badge>
              {story.status === 'PUBLISHED' && (
                <Badge variant="secondary" className="text-xs">
                  Published
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight mb-3">
              {story.title}
            </h1>

            {story.tagline && (
              <p className="text-lg text-amber-400 font-medium mb-4">{story.tagline}</p>
            )}

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-6">
              {story.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-400">
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
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">Daftar Bab</h2>
          <Link
            href={`/reader/${story.slug}/1`}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
              userProgress ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            )}
          >
            {userProgress ? 'Lanjutkan Baca' : 'Mulai Baca'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-2 max-w-2xl">
          {story.chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              onClick={() => window.location.href = `/reader/${story.slug}/${chapter.chapterNumber}`}
              className={cn(
                'w-full text-left p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-4',
                userProgress && index + 1 === userProgress.currentChapter && 'border-amber-500/50 bg-amber-500/10'
              )}
              whileHover={{ x: 4 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={cn(
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
                userProgress && index + 1 === userProgress.currentChapter
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              )}>
                {chapter.chapterNumber}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-100 truncate">{chapter.title}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatReadTime(chapter.readTimeMinutes)}
                </p>
              </div>
              {userProgress && index + 1 === userProgress.currentChapter && (
                <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                  Lanjutkan
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}