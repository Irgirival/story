'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Loader2,
  AlertCircle,
  Check,
  X,
  Plus,
  Trash2,
  RefreshCw,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllGenres } from '@/lib/genre-config';

const genres = getAllGenres();

interface ChapterInput {
  title: string;
  content: string;
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('KOSMOS');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [chapters, setChapters] = useState<ChapterInput[]>([{ title: '', content: '' }]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalReadTime = chapters.reduce((sum, ch) => sum + estimateReadTime(ch.content), 0);

  const addChapter = () => {
    setChapters(prev => [...prev, { title: '', content: '' }]);
  };

  const removeChapter = (index: number) => {
    setChapters(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const updateChapter = (index: number, field: keyof ChapterInput, value: string) => {
    setChapters(prev => prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch)));
  };

  const resetForm = () => {
    setTitle('');
    setTagline('');
    setSynopsis('');
    setGenre('KOSMOS');
    setCoverImageUrl('');
    setChapters([{ title: '', content: '' }]);
    setError(null);
    setSuccess(null);
  };

  const handlePublish = async () => {
    setError(null);
    setSuccess(null);

    if (!title.trim()) return setError('Judul cerita tidak boleh kosong');
    if (!synopsis.trim()) return setError('Sinopsis tidak boleh kosong');
    if (!coverImageUrl.trim()) return setError('URL gambar cover tidak boleh kosong');

    for (let i = 0; i < chapters.length; i++) {
      if (!chapters[i].title.trim()) return setError(`Judul Bab ${i + 1} tidak boleh kosong`);
      if (!chapters[i].content.trim()) return setError(`Isi Bab ${i + 1} tidak boleh kosong`);
    }

    setIsPublishing(true);
    try {
      const response = await fetch('/api/admin/publish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          tagline: tagline.trim(),
          synopsis: synopsis.trim(),
          genre,
          coverImageUrl: coverImageUrl.trim(),
          chapters: chapters.map((ch, index) => ({
            chapterNumber: index + 1,
            title: ch.title.trim(),
            content: ch.content.trim(),
            readTimeMinutes: estimateReadTime(ch.content),
          })),
          chapterCount: chapters.length,
          totalReadTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal publish cerita');
      }

      setSuccess(`Cerita "${title}" berhasil dipublish!`);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-500" />
              Tambah Cerita Manual
            </h1>
            <p className="text-slate-400 mt-1">Isi detail cerita dan bab secara langsung, lalu publish ke platform.</p>
          </div>
          <Button variant="ghost" onClick={resetForm} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </motion.div>

        {/* Error/Success */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                  <Button variant="ghost" size="icon" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-950/50 border border-green-500/30 rounded-xl text-green-300">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Story Details Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Detail Cerita</CardTitle>
                <CardDescription className="text-slate-400">Informasi utama yang akan tampil di halaman cerita</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="genre" className="text-slate-300">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger id="genre" className="mt-2 bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      {genres.map(g => (
                        <SelectItem key={g.key} value={g.key}>
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.accentColor }} />
                            {g.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-slate-300 flex items-center gap-1">
                    Judul Cerita <span className="text-amber-500 text-sm">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Contoh: Sinyal dari Bintang Mati"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-slate-300">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="1-2 kalimat pemikat (opsional)"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label htmlFor="synopsis" className="text-slate-300 flex items-center gap-1">
                    Sinopsis <span className="text-amber-500 text-sm">*</span>
                  </Label>
                  <Textarea
                    id="synopsis"
                    value={synopsis}
                    onChange={e => setSynopsis(e.target.value)}
                    placeholder="Ringkasan cerita, tanpa spoiler ending..."
                    className="mt-2 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 min-h-[140px] resize-none"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="coverImageUrl" className="text-slate-300 flex items-center gap-1">
                    URL Gambar Cover <span className="text-amber-500 text-sm">*</span>
                  </Label>
                  <Input
                    id="coverImageUrl"
                    value={coverImageUrl}
                    onChange={e => setCoverImageUrl(e.target.value)}
                    placeholder="https://... (link gambar yang sudah kamu upload)"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Upload gambar ke layanan hosting gambar (mis. Imgur, Cloudinary) lalu tempel link-nya di sini.
                  </p>
                  {coverImageUrl.trim() && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 aspect-[3/4] max-w-[200px] bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImageUrl}
                        alt="Preview cover"
                        className="w-full h-full object-cover"
                        onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardContent className="py-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Bab</span>
                <span className="text-slate-100 font-semibold">{chapters.length}</span>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800/50 -mt-4">
              <CardContent className="py-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">Estimasi Waktu Baca</span>
                <span className="text-slate-100 font-semibold">{totalReadTime} menit</span>
              </CardContent>
            </Card>

            <Button
              variant="cosmic"
              size="lg"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mempublish...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Publish Cerita
                </>
              )}
            </Button>
          </motion.div>

          {/* Chapters Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-slate-100">Bab Cerita</CardTitle>
                  <CardDescription className="text-slate-400">Tambahkan bab satu per satu secara manual</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addChapter} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Bab
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <GripVertical className="w-4 h-4" />
                        Bab {index + 1}
                        <span className="text-xs text-slate-500 font-normal">
                          · ~{estimateReadTime(chapter.content)} menit baca
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChapter(index)}
                        disabled={chapters.length === 1}
                        className="text-red-400 hover:text-red-300 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Input
                      value={chapter.title}
                      onChange={e => updateChapter(index, 'title', e.target.value)}
                      placeholder={`Judul Bab ${index + 1}`}
                      className="bg-slate-900 border-slate-700"
                    />

                    <Textarea
                      value={chapter.content}
                      onChange={e => updateChapter(index, 'content', e.target.value)}
                      placeholder="Tulis isi bab di sini..."
                      className="bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 min-h-[180px] resize-y"
                      rows={8}
                    />
                  </div>
                ))}

                <Button variant="outline" onClick={addChapter} className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Tambah Bab Lagi
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
