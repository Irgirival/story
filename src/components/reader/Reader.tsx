'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun, Moon, BookOpen, Menu, X, Type, Settings, Bookmark, Heart, Share2, Download } from 'lucide-react';
import { cn, formatReadTime, getGenreConfig } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ReaderProps {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    content: string;
    readTimeMinutes: number;
  };
  story: {
    id: string;
    title: string;
    slug: string;
    genre: string;
    chapterCount: number;
  };
  prevChapter?: { id: string; chapterNumber: number; title: string } | null;
  nextChapter?: { id: string; chapterNumber: number; title: string } | null;
  userProgress?: { lastPosition: number; currentChapter: number } | null;
  onProgressUpdate: (position: number, chapterNumber: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

type ReadingMode = 'dark' | 'light' | 'sepia';

const modeConfigs: Record<ReadingMode, { bg: string; text: string; name: string; icon: React.ReactNode }> = {
  dark: { bg: 'bg-slate-950', text: 'text-slate-100', name: 'Gelap', icon: <Moon className="w-4 h-4" /> },
  light: { bg: 'bg-slate-50', text: 'text-slate-900', name: 'Terang', icon: <Sun className="w-4 h-4" /> },
  sepia: { bg: 'bg-amber-50', text: 'text-amber-950', name: 'Sepia', icon: <Sun className="w-4 h-4" /> },
};

export function Reader({ 
  chapter, 
  story, 
  prevChapter, 
  nextChapter, 
  userProgress, 
  onProgressUpdate, 
  onNavigate 
}: ReaderProps) {
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [readingMode, setReadingMode] = useState<ReadingMode>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const progressUpdateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const genreConfig = getGenreConfig(story.genre);
  const modeConfig = modeConfigs[readingMode];

  // Save progress to localStorage and call onProgressUpdate
  const saveProgress = useCallback((position: number) => {
    setScrollPosition(position);
    const progress = Math.round((position / 100) * 100);
    setReadingProgress(progress);
    
    if (progressUpdateTimeout.current) {
      clearTimeout(progressUpdateTimeout.current);
    }
    
    progressUpdateTimeout.current = setTimeout(() => {
      onProgressUpdate(position, chapter.chapterNumber);
    }, 1000);
  }, [chapter.chapterNumber, onProgressUpdate]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const position = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    saveProgress(position);
  }, [saveProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (nextChapter) onNavigate('next');
          break;
        case 'ArrowRight':
          if (prevChapter) onNavigate('prev');
          break;
        case ' ':
          e.preventDefault();
          if (readerRef.current) {
            readerRef.current.scrollBy({ top: readerRef.current.clientHeight * 0.8, behavior: 'smooth' });
          }
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 't':
          setShowTOC(!showTOC);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextChapter, prevChapter, onNavigate, showSettings, showTOC]);

  // Restore scroll position
  useEffect(() => {
    if (userProgress?.currentChapter === chapter.chapterNumber && userProgress?.lastPosition > 0) {
      const restorePosition = () => {
        if (readerRef.current) {
          const maxScroll = readerRef.current.scrollHeight - readerRef.current.clientHeight;
          readerRef.current.scrollTop = (userProgress.lastPosition / 100) * maxScroll;
        }
      };
      setTimeout(restorePosition, 100);
    }
  }, [chapter.chapterNumber, userProgress]);

  // Swipe detection for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStartRef.current.x;
    const dy = touchEnd.clientY - touchStartRef.current.y;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0 && prevChapter) {
        onNavigate('prev');
      } else if (dx < 0 && nextChapter) {
        onNavigate('next');
      }
    }
    
    touchStartRef.current = null;
  };

  // Parse content into paragraphs
  const paragraphs = chapter.content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className={cn('min-h-screen flex flex-col', modeConfig.bg, modeConfig.text, 'transition-colors duration-300')}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-950/95 to-transparent px-4 py-3 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-300 hover:text-amber-400"
            onClick={() => onNavigate('prev')}
            disabled={!prevChapter}
            aria-label="Bab sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 text-center">
            <Badge variant="genre" className="text-xs mb-1">
              {story.title}
            </Badge>
            <p className="text-sm font-medium truncate">{chapter.title}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-amber-400"
              onClick={() => setShowTOC(true)}
              aria-label="Daftar isi"
            >
              <BookOpen className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-amber-400"
              onClick={() => setShowSettings(true)}
              aria-label="Pengaturan"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-amber-400"
              onClick={() => onNavigate('next')}
              disabled={!nextChapter}
              aria-label="Bab selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-14 left-0 right-0 z-30 h-1 bg-slate-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          style={{ width: `${readingProgress}%` }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Reader Content */}
      <main className="flex-1 pt-20 pb-32 px-4" ref={readerRef} onScroll={handleScroll}>
        <div 
          ref={contentRef} 
          className="max-w-3xl mx-auto"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: lineHeight,
            fontFamily: '"Cormorant Garamond", Georgia, serif'
          }}
        >
          {/* Chapter Title */}
          <div className="mb-12 text-center">
            <Badge variant="genre" className="text-sm mb-4 inline-block">
              Bab {chapter.chapterNumber}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{chapter.title}</h1>
            <p className="text-slate-400 text-sm">
              {formatReadTime(chapter.readTimeMinutes)} • {paragraphs.length} paragraf
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <AnimatePresence mode="popLayout">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="mb-6 text-justify leading-relaxed"
                  style={{ 
                    textIndent: '2em',
                    textAlign: 'justify',
                    hyphens: 'auto'
                  }}
                >
                  {paragraph.trim()}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          {/* End of Chapter */}
          <div className="mt-16 mb-8 text-center">
            <Separator className="my-8" />
            <p className="text-slate-400 text-sm">— Akhir Bab {chapter.chapterNumber} —</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950/95 to-transparent px-4 py-3 backdrop-blur-sm border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant={prevChapter ? 'outline' : 'ghost'}
            size="sm"
            className="flex-1 sm:flex-none gap-2"
            onClick={() => onNavigate('prev')}
            disabled={!prevChapter}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Bab Sebelumnya</span>
          </Button>

          <div className="flex-1 text-center">
            <span className="text-xs text-slate-500">
              Bab {chapter.chapterNumber} dari {story.chapterCount}
            </span>
          </div>

          <Button
            variant={nextChapter ? 'cosmic' : 'ghost'}
            size="sm"
            className="flex-1 sm:flex-none gap-2 justify-end"
            onClick={() => onNavigate('next')}
            disabled={!nextChapter}
          >
            <span className="hidden sm:inline">Bab Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
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
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Pengaturan Baca</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Tabs defaultValue="display" className="space-y-6">
                <TabsList className="bg-slate-800 p-1">
                  <TabsTrigger value="display">Tampilan</TabsTrigger>
                  <TabsTrigger value="font">Font</TabsTrigger>
                </TabsList>

                <TabsContent value="display" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mode Baca</label>
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
                </TabsContent>

                <TabsContent value="font" className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ukuran Font: {fontSize}px
                    </label>
                    <Slider
                      min={14}
                      max={24}
                      step={1}
                      value={fontSize}
                      onValueChange={setFontSize}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jarak Baris: {lineHeight}
                    </label>
                    <Slider
                      min={1.5}
                      max={2.5}
                      step={0.1}
                      value={lineHeight}
                      onValueChange={setLineHeight}
                    />
                  </div>
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
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-md max-h-[70vh] bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Daftar Isi</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowTOC(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-2">
                {/* This would be populated with actual chapter list */}
                <p className="text-slate-400 text-center py-8">Daftar bab akan ditampilkan di sini</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}