'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, BookOpen, Image as ImageIcon, Edit, Save, Eye, Trash2, Copy, Check, AlertCircle, ChevronDown, ChevronUp, Wand2, Type, Layers, Palette, Music, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { cn, getGenreConfig, GENRE_LABELS, slugify } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const GENRE_OPTIONS = [
  { value: 'KOSMOS', label: 'Kosmos - Alam semesta, bintang, galaksi', icon: '🌌' },
  { value: 'ALAM', label: 'Alam - Hutan, lautan, gunung, satwa', icon: '🌲' },
  { value: 'ROMANCE', label: 'Romance - Cinta, hubungan, perasaan', icon: '💕' },
  { value: 'HOROR', label: 'Horor - Ketegangan, misteri, ketakutan', icon: '👻' },
  { value: 'KONSPIRASI', label: 'Konspirasi - Rahasia, teori, kebenaran gelap', icon: '🕵️' },
];

const TONE_OPTIONS = [
  { value: 'epic', label: 'Epik - Grandiose, heroik, sinematik' },
  { value: 'melankolis', label: 'Melankolis - Sedih, reflektif, mendalam' },
  { value: 'misterius', label: 'Misterius - Rahasia, teka-teki, menegangkan' },
  { value: 'seram', label: 'Seram Mencekam - Horror psikologis, jumpscare' },
  { value: 'romantis', label: 'Romantis - Cinta tulus, hangat, manis' },
  { value: 'humoris', label: 'Humoris - Lucu, ringan,娱乐' },
  { value: 'filosofis', label: 'Filosofis - Pemikiran mendalam, eksistensial' },
  { value: 'action', label: 'Action - Cepat, penuh aksi, adrenaline' },
  { value: 'slice_of_life', label: 'Slice of Life - Kehidupan sehari-hari, relatable' },
  { value: 'dark', label: 'Gelap - Cynical, brutal, no happy ending' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Pendek (3-5 bab, ~5 menit/bab)', chapters: 4 },
  { value: 'medium', label: 'Sedang (8-12 bab, ~7 menit/bab)', chapters: 10 },
  { value: 'long', label: 'Panjang (15-25 bab, ~8 menit/bab)', chapters: 20 },
  { value: 'epic', label: 'Epik (30-50 bab, ~10 menit/bab)', chapters: 40 },
];

const COVER_STYLES = [
  { value: 'cinematic', label: 'Sinematik - Seperti poster film, pencahayaan dramatik' },
  { value: 'illustration', label: 'Ilustrasi - Gaya lukisan digital, artistik' },
  { value: 'minimalist', label: 'Minimalis - Simbolis, bersih, modern' },
  { value: 'concept_art', label: 'Concept Art - Detail, world-building, game-style' },
  { value: 'book_cover', label: 'Cover Buku - Layout profesional, tipografi elegan' },
  { value: 'anime', label: 'Anime/Manga - Gaya Jepang, warna cerah' },
  { value: 'dark_fantasy', label: 'Dark Fantasy - Gelap, mistis, atmospheric' },
  { value: 'sci_fi', label: 'Sci-Fi - Futuristik, teknologi, ruang angkasa' },
];

interface FormData {
  genre: string;
  premise: string;
  tone: string;
  length: string;
  chapterCount: number;
  coverStyle: string;
  customCoverPrompt: string;
  language: string;
  pov: string;
  targetAudience: string;
}

const initialFormData: FormData = {
  genre: 'KOSMOS',
  premise: '',
  tone: 'epic',
  length: 'medium',
  chapterCount: 10,
  coverStyle: 'cinematic',
  customCoverPrompt: '',
  language: 'id',
  pov: 'third',
  targetAudience: 'dewasa',
};

const stylePrompts: Record<string, string> = {
  cinematic: 'cinematic lighting, dramatic composition, movie poster style, 8k resolution, highly detailed',
  illustration: 'digital illustration, artistic, painterly, concept art style, vibrant colors',
  minimalist: 'minimalist design, clean lines, symbolic, negative space, modern aesthetic',
  concept_art: 'concept art, detailed world building, game art style, intricate details',
  book_cover: 'professional book cover layout, elegant typography, publisher quality',
  anime: 'anime style, manga cover art, vibrant colors, Japanese illustration',
  dark_fantasy: 'dark fantasy, atmospheric, mystical, ominous, gothic aesthetic',
  sci_fi: 'science fiction, futuristic, high tech, space, cyberpunk elements',
};

function generateCoverPromptFn(story: any, style: string): string {
  const genre = getGenreConfig(story.genre);
  const basePrompt = `${style} book cover for "${story.title}", ${story.synopsis.substring(0, 200)}`;
  const stylePrompt = stylePrompts[style] || stylePrompts.cinematic;
  return `${basePrompt}, ${stylePrompt}, ${genre.accent} accent colors`;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'library' | 'settings'>('generate');
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'generate' | 'library' | 'settings');
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'story' | 'cover' | 'complete'>('idle');
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverPrompt, setCoverPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const genreConfig = getGenreConfig(formData.genre);
  const selectedLength = LENGTH_OPTIONS.find(l => l.value === formData.length);
  const estimatedChapters = selectedLength?.chapters || 10;

  const handleGenerateStory = async () => {
    if (!formData.premise.trim()) {
      setError('Premis cerita tidak boleh kosong');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('story');
    setError(null);
    setGeneratedStory(null);

    try {
      const response = await fetch('/api/admin/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: formData.genre,
          premise: formData.premise,
          tone: formData.tone,
          chapterCount: formData.chapterCount || estimatedChapters,
          language: formData.language,
          pov: formData.pov,
          targetAudience: formData.targetAudience,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal generate cerita');
      }

      const data = await response.json();
      setGeneratedStory(data.story);
      setGenerationStep('cover');
      
      // Auto-generate cover prompt
      const autoCoverPrompt = generateCoverPromptFn(data.story, formData.coverStyle);
      setCoverPrompt(autoCoverPrompt);
      
    } catch (err: any) {
      setError(err.message);
      setGenerationStep('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!coverPrompt.trim()) {
      setError('Prompt cover tidak boleh kosong');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: coverPrompt,
          style: formData.coverStyle,
          genre: formData.genre,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal generate cover');
      }

      const data = await response.json();
      setCoverUrl(data.imageUrl);
      setGenerationStep('complete');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedStory) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/publish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedStory,
          coverImageUrl: coverUrl,
          coverPrompt: coverPrompt,
        }),
      });

      if (!response.ok) throw new Error('Gagal publish');
      
      alert('Cerita berhasil dipublish!');
      // Reset form
      setGeneratedStory(null);
      setCoverUrl(null);
      setCoverPrompt('');
      setGenerationStep('idle');
      setFormData(prev => ({ ...prev, premise: '', customCoverPrompt: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                  <span className="gradient-text">AI</span> Story Generator
                </h1>
                <p className="text-slate-400">
                  Buat cerita lengkap dengan AI: judul, sinopsis, bab, isi, hingga cover image.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {isGenerating ? 'Generating...' : 'Ready'}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 w-fit">
              <TabsTrigger value="generate" className="gap-2 px-4">
                <Wand2 className="w-4 h-4" />
                Generate Baru
              </TabsTrigger>
              <TabsTrigger value="library" className="gap-2 px-4">
                <BookOpen className="w-4 h-4" />
                Library Saya
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 px-4">
                <Settings className="w-4 h-4" />
                Pengaturan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="generate">
              <GenerateTab 
                formData={formData}
                setFormData={setFormData}
                genreConfig={genreConfig}
                selectedLength={selectedLength}
                estimatedChapters={estimatedChapters}
                generationStep={generationStep}
                isGenerating={isGenerating}
                generatedStory={generatedStory}
                coverUrl={coverUrl}
                coverPrompt={coverPrompt}
                setCoverPrompt={setCoverPrompt}
                error={error}
                setError={setError}
                handleGenerateStory={handleGenerateStory}
                handleGenerateCover={handleGenerateCover}
                handlePublish={handlePublish}
              />
            </TabsContent>
            <TabsContent value="library">
              <LibraryTab />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate Tab Component
function GenerateTab({
  formData,
  setFormData,
  genreConfig,
  selectedLength,
  estimatedChapters,
  generationStep,
  isGenerating,
  generatedStory,
  coverUrl,
  coverPrompt,
  setCoverPrompt,
  error,
  setError,
  handleGenerateStory,
  handleGenerateCover,
  handlePublish,
}: any) {
  return (
    <motion.div
      key="generate"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-950/50 border border-red-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
            Tutup
          </Button>
        </motion.div>
      )}

      {/* Step 1: Story Form */}
      <Card className={cn(
        'border-slate-800/50',
        generationStep !== 'idle' && 'opacity-50 pointer-events-none'
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-amber-500" />
                Step 1: Konfigurasi Cerita
              </CardTitle>
              <CardDescription>
                Isi detail cerita yang ingin di-generate. Semua field wajib diisi.
              </CardDescription>
            </div>
            {generationStep !== 'idle' && (
              <Badge variant="genre" className="text-sm">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Genre */}
            <div>
              <Label htmlFor="genre" className="block mb-2">Genre</Label>
              <Select
                id="genre"
                value={formData.genre}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, genre: v }))}
              >
                {GENRE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Tone */}
            <div>
              <Label htmlFor="tone" className="block mb-2">Tone / Nuansa</Label>
              <Select
                id="tone"
                value={formData.tone}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, tone: v }))}
              >
                {TONE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>

            {/* Length */}
            <div>
              <Label htmlFor="length" className="block mb-2">Panjang Cerita</Label>
              <Select
                id="length"
                value={formData.length}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, length: v }))}
              >
                {LENGTH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>

            {/* Chapter Count Override */}
            <div>
              <Label htmlFor="chapterCount" className="block mb-2">Jumlah Bab (Opsional)</Label>
              <Input
                id="chapterCount"
                type="number"
                min={3}
                max={50}
                value={formData.chapterCount || ''}
                onChange={(e) => setFormData((prev: FormData) => ({ ...prev, chapterCount: parseInt(e.target.value) || estimatedChapters }))}
                placeholder={estimatedChapters.toString()}
              />
              <p className="text-xs text-slate-500 mt-1">Kosongkan untuk pakai default dari panjang cerita</p>
            </div>
          </div>

          <Separator />

          {/* Premise */}
          <div>
            <Label htmlFor="premise" className="block mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Premis / Ide Cerita <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="premise"
              value={formData.premise}
              onChange={(e) => setFormData((prev: FormData) => ({ ...prev, premise: e.target.value }))}
              placeholder="Contoh: Seorang astronaut menemukan sinyal radio dari bintang yang sudah mati 1 juta tahun lalu. Sinyal itu berisi lagu yang hanya dia dan ibunya yang tahu..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Jelaskan ide utama, konflik, setting, dan karakter kunci. Semakin detail, semakin baik hasilnya.
            </p>
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language" className="block mb-2">Bahasa</Label>
              <Select
                id="language"
                value={formData.language}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, language: v }))}
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="pov" className="block mb-2">Point of View</Label>
              <Select
                id="pov"
                value={formData.pov}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, pov: v }))}
              >
                <option value="third">Third Person (Dia/Ia)</option>
                <option value="first">First Person (Aku/Saya)</option>
                <option value="omniscient">Omniscient (All-knowing)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetAudience" className="block mb-2">Target Audiens</Label>
              <Select
                id="targetAudience"
                value={formData.targetAudience}
                onValueChange={(v: string) => setFormData((prev: FormData) => ({ ...prev, targetAudience: v }))}
              >
                <option value="dewasa">Dewasa (17+)</option>
                <option value="remaja">Remaja (13-17)</option>
                <option value="umum">Umum (Semua usia)</option>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateStory}
            disabled={isGenerating || !formData.premise.trim()}
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 text-lg py-3"
          >
            <Wand2 className="w-5 h-5" />
            {isGenerating && generationStep === 'story'
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Sparkles className="w-5 h-5" />}
            {isGenerating && generationStep === 'story' ? 'Membuat Cerita...' : 'Generate Cerita Lengkap'}
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Cover Generation */}
      {(generationStep === 'cover' || generationStep === 'complete') && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              Step 2: Generate Cover Image
            </CardTitle>
            <CardDescription>
              AI akan membuat cover berdasarkan cerita. Anda bisa edit prompt sebelum generate.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="coverPrompt" className="block mb-2">Prompt Cover</Label>
              <Textarea
                id="coverPrompt"
                value={coverPrompt}
                onChange={(e) => setCoverPrompt(e.target.value)}
                rows={3}
                className="resize-none font-mono text-sm"
              />
            </div>

            <div>
              <Label className="block mb-2">Style Cover</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COVER_STYLES.map(style => (
                  <button
                    key={style.value}
                    onClick={() => {
                      setFormData((prev: FormData) => ({ ...prev, coverStyle: style.value }));
                      setCoverPrompt(generateCoverPromptFn(generatedStory, style.value));
                    }}
                    className={cn(
                      'p-3 rounded-lg border-2 text-center transition-all text-sm',
                      formData.coverStyle === style.value
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerateCover}
              disabled={isGenerating || !coverPrompt.trim()}
              className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3"
            >
              <ImageIcon className="w-5 h-5" />
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isGenerating ? 'Membuat Cover...' : 'Generate Cover'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview & Publish */}
      {(generationStep === 'complete' && generatedStory) && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Step 3: Preview & Publish
            </CardTitle>
            <CardDescription>
              Review cerita dan cover sebelum publish ke website.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Story Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cover Preview */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-slate-700">
                {coverUrl ? (
                  <img src={coverUrl} alt={generatedStory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <span className="text-6xl opacity-30">📖</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 to-transparent">
                  <Badge variant="genre" className="mb-2" style={{ background: `linear-gradient(135deg, ${genreConfig.accent}, ${genreConfig.accent})` }}>
                    {GENRE_LABELS[generatedStory.genre] || generatedStory.genre}
                  </Badge>
                  <h3 className="font-bold text-lg">{generatedStory.title}</h3>
                </div>
              </div>

              {/* Story Details */}
              <div className="space-y-4">
                <div>
                  <Label className="block mb-1">Judul</Label>
                  <Input 
                    value={generatedStory.title} 
                    onChange={(e) => setGeneratedStory((prev: any) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="block mb-1">Tagline</Label>
                  <Input 
                    value={generatedStory.tagline || ''} 
                    onChange={(e) => setGeneratedStory((prev: any) => ({ ...prev, tagline: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="block mb-1">Sinopsis</Label>
                  <Textarea
                    value={generatedStory.synopsis}
                    onChange={(e) => setGeneratedStory((prev: any) => ({ ...prev, synopsis: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {generatedStory.chapters?.length || 0} bab
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{generatedStory.totalReadTime || 0} menit
                  </span>
                </div>
              </div>
            </div>

            {/* Chapters Preview */}
            <div>
              <Label className="block mb-3">Daftar Bab (klik untuk lihat isi)</Label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedStory.chapters?.map((ch: any, i: number) => (
                  <details key={ch.id || i} className="group bg-slate-800/50 rounded-lg border border-slate-700">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                          {ch.chapterNumber}
                        </span>
                        <div>
                          <p className="font-medium">{ch.title}</p>
                          <p className="text-xs text-slate-500">{ch.readTimeMinutes} menit</p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 border-t border-slate-700 text-slate-300 text-sm leading-relaxed">
                      {ch.content?.substring(0, 300)}...
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700">
              <Button 
                onClick={handlePublish}
                disabled={isGenerating}
                className="flex-1 min-w-[200px] gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 py-3"
              >
                <Save className="w-5 h-5" />
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isGenerating ? 'Publishing...' : 'Publish ke Website'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setGeneratedStory(null);
                  setCoverUrl(null);
                  setCoverPrompt('');
                  setGenerationStep('idle');
                }}
                className="flex-1 min-w-[200px]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Buat Cerita Baru
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// Library Tab Component
function LibraryTab() {
  return (
    <motion.div
      key="library"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Library Cerita Saya
          </CardTitle>
          <CardDescription>
            Kelola semua cerita yang telah di-generate dan dipublish.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <p className="text-lg font-medium mb-2">Belum ada cerita</p>
            <p className="mb-6">Cerita yang di-generate dan dipublish akan muncul di sini.</p>
            <Button onClick={() => {}}>
              <Sparkles className="w-4 h-4 mr-2" />
              Buat Cerita Pertama
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            Pengaturan AI
          </CardTitle>
          <CardDescription>
            Konfigurasi model dan parameter generasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block mb-2">Model Teks (Claude)</Label>
              <Select defaultValue="claude-3-5-sonnet">
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Terbaik)</option>
                <option value="claude-3-opus">Claude 3 Opus (Paling Cerdas)</option>
                <option value="claude-3-haiku">Claude 3 Haiku (Paling Cepat)</option>
              </Select>
            </div>
            <div>
              <Label className="block mb-2">Model Gambar</Label>
              <Select defaultValue="dall-e-3">
                <option value="dall-e-3">DALL-E 3 (OpenAI)</option>
                <option value="sdxl">Stable Diffusion XL</option>
                <option value="ideogram">Ideogram 2.0</option>
                <option value="midjourney">Midjourney v6 (via API)</option>
              </Select>
            </div>
            <div>
              <Label className="block mb-2 flex justify-between">
                Temperature (Kreativitas)
                <span className="text-amber-400">0.8</span>
              </Label>
              <Slider min={0} max={1} step={0.1} value={0.8} />
            </div>
            <div>
              <Label className="block mb-2 flex justify-between">
                Max Tokens per Chapter
                <span className="text-amber-400">4000</span>
              </Label>
              <Slider min={1000} max={8000} step={500} value={4000} />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="block mb-2">Default Settings</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Switch id="autoCover" checked={true} />
                <Label htmlFor="autoCover">Auto-generate cover prompt</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="autoChapters" checked={true} />
                <Label htmlFor="autoChapters">Auto-split chapters</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="enhancePrompts" checked={true} />
                <Label htmlFor="enhancePrompts">Enhance prompts with genre context</Label>
              </div>
            </div>
          </div>

          <Button className="w-full max-w-xs">Simpan Pengaturan</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            Genre Customization
          </CardTitle>
          <CardDescription>
            Kustomisasi warna aksen, partikel, dan nuansa per genre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GENRE_OPTIONS.map(opt => {
              const config = getGenreConfig(opt.value);
              return (
                <div key={opt.value} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: config.accent + '20' }}>
                      <span style={{ color: config.accent }}>{opt.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{opt.label.split(' - ')[0]}</p>
                      <p className="text-xs text-slate-500">{opt.label.split(' - ')[1]}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs block mb-1">Aksen Warna</Label>
                      <input type="color" defaultValue={config.accent} className="w-8 h-8 rounded border-0 cursor-pointer" />
                    </div>
                    <div>
                      <Label className="text-xs block mb-1">Partikel</Label>
                      <Select defaultValue={config.particle}>
                        <option value="stars">Bintang ✨</option>
                        <option value="leaves">Daun 🍃</option>
                        <option value="petals">Kelopak 🌸</option>
                        <option value="mist">Kabut 🌫️</option>
                        <option value="particles">Partikel ⚡</option>
                        <option value="none">Tidak ada</option>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper components
function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RotateCcw({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 109-9.97L7 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v6h6" />
    </svg>
  );
}