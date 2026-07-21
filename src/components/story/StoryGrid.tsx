'use client';

import { motion } from 'framer-motion';
import { StoryCard } from './StoryCard';

interface StoryGridProps {
  stories: StoryCardProps['story'][];
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'featured' | 'compact';
  showViewAll?: boolean;
  viewAllHref?: string;
}

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

export function StoryGrid({ 
  stories, 
  title, 
  subtitle, 
  variant = 'default', 
  showViewAll = false, 
  viewAllHref 
}: StoryGridProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Belum ada cerita di kategori ini.</p>
      </div>
    );
  }

  const gridStyles = {
    default: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    featured: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    compact: 'flex flex-col gap-3',
  };

  return (
    <section className="py-6">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {showViewAll && viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1"
            >
              Lihat semua
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}
      <motion.div
        className={gridStyles[variant]}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            variant={variant}
            priority={index < 4}
          />
        ))}
      </motion.div>
    </section>
  );
}