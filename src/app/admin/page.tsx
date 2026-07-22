'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Image, BookOpen, Settings, ChevronLeft, ChevronRight, ChevronDown, X, Check, AlertCircle, Download, Upload, RefreshCw, Trash2, Edit, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { getAllGenres, GENRE_LABELS } from '@/lib/genre-config';

const genres = getAllGenres();
const tones = ['epic', 'melankolis', 'misterius', 'seram', 'romantis', 'humoris', 'filosofis', 'action', 'slice_of_life', 'dark'];
const povs = ['third', 'first', 'omniscient'];
const audiences = ['dewasa', 'remaja', 'anak', 'umum'];
const languages = ['id', 'en'];
const styles = ['cinematic', 'illustration', 'minimalist', 'concept_art', 'book_cover', 'anime', 'dark_fantasy', 'sci_fi'];

interface StoryFormData {
  genre: string;
  premise: string;
  tone: string;
  chapterCount: number;
  pov: string;
  targetAudience: string;
  language: string;
  coverStyle: string;
  coverPrompt: string;
}

interface GeneratedStory {
  title: string;
  tagline: string;
  synopsis: string;
  genre: string;
  totalReadTime: number;
  chapters: {
    chapterNumber: number;
    title: string;
    content: string;
    readTimeMinutes: number;
  }[];
}

interface GeneratedCover {
  imageUrl: string;
  prompt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<StoryFormData>({
    genre: 'KOSMOS',
    premise: '',
    tone: 'epic',
    chapterCount: 10,
    pov: 'third',
    targetAudience: 'dewasa',
    language: 'id',
    coverStyle: 'cinematic',
    coverPrompt: '',
  });

  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [generatedCover, setGeneratedCover] = useState<GeneratedCover | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: generate story, 2: generate cover, 3: review, 4: publish

  const handleInputChange = (field: keyof StoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const generateStory = async () => {
    if (!formData.premise.trim()) {
      setError('Premis cerita tidak boleh kosong');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal generate cerita');
      }

      setGeneratedStory(data.story);
      setCurrentStep(2);
      setSuccess('Cerita berhasil digenerate! Sekarang generate cover.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCover = async () => {
    if (!generatedStory) {
      setError('Generate cerita terlebih dahulu');
      return;
    }

    setIsGeneratingCover(true);
    setError(null);

    const coverPrompt = formData.coverPrompt || `${generatedStory.title}, ${GENRE_LABELS[formData.genre] || formData.genre} genre, ${formData.tone} tone, professional book cover`;

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal generate cover');
      }

      setGeneratedCover({ imageUrl: data.imageUrl, prompt: data.prompt });
      setCurrentStep(3);
      setSuccess('Cover berhasil digenerate! Silakan review dan publish.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const publishStory = async () => {
    if (!generatedStory || !generatedCover) {
      setError('Generate cerita dan cover terlebih dahulu');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/publish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedStory.title,
          tagline: generatedStory.tagline,
          synopsis: generatedStory.synopsis,
          genre: generatedStory.genre,
          coverImageUrl: generatedCover.imageUrl,
          coverPrompt: generatedCover.prompt,
          chapters: generatedStory.chapters,
          chapterCount: generatedStory.chapters.length,
          totalReadTime: generatedStory.totalReadTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal publish cerita');
      }

      setSuccess(`Cerita "${generatedStory.title}" berhasil dipublish!`);
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      genre: 'KOSMOS',
      premise: '',
      tone: 'epic',
      chapterCount: 10,
      pov: 'third',
      targetAudience: 'dewasa',
      language: 'id',
      coverStyle: 'cinematic',
      coverPrompt: '',
    });
    setGeneratedStory(null);
    setGeneratedCover(null);
    setCurrentStep(1);
    setError(null);
    setSuccess(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Disalin ke clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed top-16 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                  Admin Generator
                </h1>
                <p className="text-slate-400 mt-1">Buat cerita AI lengkap dengan cover, review, dan publish dalam sekali klik</p>
              </div>
              <div className="flex items-center gap-2">
                {generatedStory && (
                  <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(generatedStory, null, 2))} className="gap-2">
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </Button>
                )}
                <Button variant="ghost" onClick={resetForm} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { num: 1, label: 'Generate Story', icon: BookOpen },
                { num: 2, label: 'Generate Cover', icon: Image },
                { num: 3, label: 'Review', icon: Settings },
                { num: 4, label: 'Publish', icon: Check },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all',
                    currentStep >= step.num
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                  )}>
                    {currentStep > step.num ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      React.createElement(step.icon, { className: "w-5 h-5" })
                    )}
                  </div>
                  {index < 3 && (
                    <div className={cn(
                      'w-24 h-1 rounded hidden sm:block transition-all',
                      currentStep > step.num
                        ? 'bg-amber-500'
                        : 'bg-slate-800'
                    )} />
                  )}
                  <span className={cn(
                    'hidden sm:block text-xs font-medium',
                    currentStep >= step.num ? 'text-amber-400' : 'text-slate-500'
                  )}>{step.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Error/Success Messages */}
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
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

          {/* Tab Content */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-900/50 border border-slate-800/50 gap-1 p-1">
              <TabsTrigger value="generate" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="review" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950" disabled={!generatedStory}>
                <Settings className="w-4 h-4 mr-2" />
                Review
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab */}
            <TabsContent value="generate" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Panel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-slate-900/50 border-slate-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Parameter Cerita
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Isi parameter di bawah untuk generate cerita baru
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Genre */}
                      <div>
                        <Label htmlFor="genre" className="text-slate-300">Genre</Label>
                        <Select value={formData.genre} onValueChange={v => handleInputChange('genre', v)}>
                          <SelectTrigger id="genre" className="mt-2 bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800">
                            {genres.map(g => (
                              <SelectItem key={g.key} value={g.key} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.accentColor }} />
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Premise */}
                      <div>
                        <Label htmlFor="premise" className="text-slate-300 flex items-center gap-1">
                          Premis Cerita <span className="text-amber-500 text-sm">*</span>
                        </Label>
                        <Textarea
                          id="premise"
                          value={formData.premise}
                          onChange={e => handleInputChange('premise', e.target.value)}
                          placeholder="Contoh: Seorang kapten antariksa menemukan sinyal misterius dari bintang neutron yang seharusnya sudah mati jutaan tahun lalu..."
                          className="mt-2 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 min-h-[120px] resize-none"
                          rows={5}
                        />
                        <p className="text-xs text-slate-500 mt-1">Deskripsikan ide utama cerita, konflik utama, dan setting. Lebih detail = hasil lebih baik.</p>
                      </div>

                      {/* Tone & Chapter Count */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tone" className="text-slate-300">Tone</Label>
                          <Select value={formData.tone} onValueChange={v => handleInputChange('tone', v)}>
                            <SelectTrigger id="tone" className="mt-2 bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                              {tones.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="chapterCount" className="text-slate-300">Jumlah Bab</Label>
                          <Input
                            id="chapterCount"
                            type="number"
                            min={3}
                            max={50}
                            value={formData.chapterCount}
                            onChange={e => handleInputChange('chapterCount', parseInt(e.target.value) || 3)}
                            className="mt-2 bg-slate-800 border-slate-700"
                          />
                        </div>
                      </div>

                      {/* POV & Audience */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pov" className="text-slate-300">POV</Label>
                          <Select value={formData.pov} onValueChange={v => handleInputChange('pov', v)}>
                            <SelectTrigger id="pov" className="mt-2 bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                              {povs.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="targetAudience" className="text-slate-300">Target Audiens</Label>
                          <Select value={formData.targetAudience} onValueChange={v => handleInputChange('targetAudience', v)}>
                            <SelectTrigger id="targetAudience" className="mt-2 bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                              {audiences.map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <Label htmlFor="language" className="text-slate-300">Bahasa</Label>
                        <Select value={formData.language} onValueChange={v => handleInputChange('language', v)}>
                          <SelectTrigger id="language" className="mt-2 bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800">
                            {languages.map(l => <SelectItem key={l} value={l}>{l === 'id' ? 'Indonesia' : 'English'}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Generate Button */}
                      <Button
                        onClick={generateStory}
                        disabled={isGenerating || !formData.premise.trim()}
                        className="w-full py-4 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Cerita...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Cerita Lengkap
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Cover Settings */}
                  <Card className="bg-slate-900/50 border-slate-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Image className="w-5 h-5 text-amber-500" />
                        Pengaturan Cover
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="coverStyle" className="text-slate-300">Style Cover</Label>
                        <Select value={formData.coverStyle} onValueChange={v => handleInputChange('coverStyle', v)}>
                          <SelectTrigger id="coverStyle" className="mt-2 bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800">
                            {styles.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="coverPrompt" className="text-slate-300">Custom Cover Prompt (opsional)</Label>
                        <Textarea
                          id="coverPrompt"
                          value={formData.coverPrompt}
                          onChange={e => handleInputChange('coverPrompt', e.target.value)}
                          placeholder="Biarkan kosong untuk auto-generate dari judul & genre cerita"
                          className="mt-2 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preview Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {generatedStory && (
                    <>
                      {/* Story Preview */}
                      <Card className="bg-slate-900/50 border-slate-800/50">
                        <CardHeader>
                          <CardTitle className="text-slate-100">Preview Cerita</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-slate-100">{generatedStory.title}</h3>
                            <p className="text-amber-400 italic">{generatedStory.tagline}</p>
                            <Badge variant="genre" className="text-sm" style={{ background: `linear-gradient(135deg, ${genres.find(g => g.key === generatedStory?.genre)?.accentColor || '#fbbf24'}, ${genres.find(g => g.key === generatedStory?.genre)?.accentHover || '#f59e0b'})` }}>
                              {GENRE_LABELS[generatedStory.genre] || generatedStory.genre}
                            </Badge>
                          </div>

                          <div className="prose max-w-none text-slate-300">
                            <p>{generatedStory.synopsis}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-slate-800/50 rounded-xl">
                              <p className="text-2xl font-bold text-amber-400">{generatedStory.chapters.length}</p>
                              <p className="text-xs text-slate-500">Bab</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-xl">
                              <p className="text-2xl font-bold text-amber-400">{generatedStory.totalReadTime} min</p>
                              <p className="text-xs text-slate-500">Waktu Baca</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-xl">
                              <p className="text-2xl font-bold text-amber-400">{generatedStory.chapters.reduce((sum, ch) => sum + (ch.content?.split(' ').length || 0), 0).toLocaleString()}</p>
                              <p className="text-xs text-slate-500">Kata</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Daftar Bab</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {generatedStory.chapters.map((ch, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                                  <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-amber-400">{ch.chapterNumber}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-slate-100 truncate">{ch.title}</p>
                                    <p className="text-xs text-slate-500">{ch.readTimeMinutes} min baca</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cover Preview */}
                      {generatedCover && (
                        <Card className="bg-slate-900/50 border-slate-800/50">
                          <CardHeader>
                            <CardTitle className="text-slate-100">Preview Cover</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 relative">
                              <img
                                src={generatedCover.imageUrl}
                                alt={generatedStory.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4 text-slate-100">
                                <p className="text-lg font-bold">{generatedStory.title}</p>
                                <p className="text-sm text-amber-400">{generatedStory.tagline}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 truncate">{generatedCover.prompt}</p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {!generatedStory && (
                    <Card className="bg-slate-900/50 border-slate-800/50 border-dashed h-[500px] flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Belum ada cerita yang digenerate</p>
                        <p className="text-sm mt-1">Isi form di sebelah kiri dan klik Generate</p>
                      </div>
                    </Card>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="mt-6">
              {generatedStory ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Story Details */}
                    <Card className="bg-slate-900/50 border-slate-800/50">
                      <CardHeader>
                        <CardTitle className="text-slate-100">Detail Cerita</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-sm">Judul</Label>
                          <Input value={generatedStory.title} readOnly className="bg-slate-800 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-sm">Tagline</Label>
                          <Input value={generatedStory.tagline} readOnly className="bg-slate-800 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-sm">Sinopsis</Label>
                          <Textarea value={generatedStory.synopsis} readOnly className="bg-slate-800 border-slate-700 min-h-[120px]" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-slate-400 text-sm">Genre</Label>
                            <Input value={GENRE_LABELS[generatedStory.genre] || generatedStory.genre} readOnly className="bg-slate-800 border-slate-700" />
                          </div>
                          <div>
                            <Label className="text-slate-400 text-sm">Total Bab</Label>
                            <Input value={generatedStory.chapters.length.toString()} readOnly className="bg-slate-800 border-slate-700" />
                          </div>
                          <div>
                            <Label className="text-slate-400 text-sm">Waktu Baca</Label>
                            <Input value={`${generatedStory.totalReadTime} menit`} readOnly className="bg-slate-800 border-slate-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chapter List */}
                    <Card className="bg-slate-900/50 border-slate-800/50 lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-slate-100">Daftar Bab (klik untuk edit)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                          {generatedStory.chapters.map((ch, i) => (
                            <details key={i} className="group bg-slate-800/50 rounded-xl border border-slate-700/50">
                              <summary className="flex items-center gap-4 p-4 cursor-pointer list-none">
                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
                                  {ch.chapterNumber}
                                </span>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-100">{ch.title}</p>
                                  <p className="text-sm text-slate-500">{ch.readTimeMinutes} min baca • ~{Math.round(ch.content.split(' ').length)} kata</p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                              </summary>
                              <div className="px-4 pb-4 border-t border-slate-700/50">
                                <Textarea
                                  value={ch.content}
                                  onChange={e => {
                                    const newChapters = [...generatedStory.chapters];
                                    newChapters[i] = { ...newChapters[i], content: e.target.value };
                                    setGeneratedStory({ ...generatedStory, chapters: newChapters });
                                  }}
                                  className="bg-slate-900 border-slate-700 text-slate-100 min-h-[200px] font-mono text-sm"
                                />
                              </div>
                            </details>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cover Review */}
                  {generatedCover && (
                    <Card className="bg-slate-900/50 border-slate-800/50">
                      <CardHeader>
                        <CardTitle className="text-slate-100">Cover Review</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col sm:flex-row gap-8 items-start">
                        <div className="aspect-[2/3] w-full max-w-xs rounded-xl overflow-hidden bg-slate-800 relative flex-shrink-0">
                          <img
                            src={generatedCover.imageUrl}
                            alt={generatedStory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <Label className="text-slate-400 text-sm">Prompt yang Digunakan</Label>
                            <Textarea
                              value={generatedCover.prompt}
                              readOnly
                              className="bg-slate-800 border-slate-700 min-h-[80px]"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={generateCover}
                              disabled={isGeneratingCover}
                              className="gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Regenerate Cover
                            </Button>
                            <Button variant="cosmic" onClick={publishStory} disabled={isPublishing} className="gap-2">
                              {isPublishing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Publishing...
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  Publish Cerita
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Publish Button if no cover yet */}
                  {!generatedCover && generatedStory && (
                    <Card className="bg-slate-900/50 border-slate-800/50">
                      <CardContent className="text-center py-12">
                        <Image className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">Belum Ada Cover</h3>
                        <p className="text-slate-500 mb-6">Generate cover terlebih dahulu sebelum publish</p>
                        <Button
                          variant="cosmic"
                          onClick={generateCover}
                          disabled={isGeneratingCover}
                          className="gap-2"
                          size="lg"
                        >
                          {isGeneratingCover ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Generating Cover...
                            </>
                          ) : (
                            <>
                              <Image className="w-5 h-5" />
                              Generate Cover & Lanjutkan
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <Card className="bg-slate-900/50 border-slate-800/50 border-dashed h-[300px] flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Settings className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Generate cerita terlebih dahulu di tab Generate</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-2xl"
              >
                <Card className="bg-slate-900/50 border-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Default Settings</CardTitle>
                    <CardDescription className="text-slate-400">
                      Pengaturan default untuk generate cerita baru
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <Switch id="autoCover" checked={true} onCheckedChange={() => {}} />
                        <Label htmlFor="autoCover" className="text-slate-300 cursor-pointer">Auto-generate cover prompt</Label>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <Switch id="autoChapters" checked={true} onCheckedChange={() => {}} />
                        <Label htmlFor="autoChapters" className="text-slate-300 cursor-pointer">Auto-split chapters</Label>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <Switch id="enhancePrompts" checked={true} onCheckedChange={() => {}} />
                        <Label htmlFor="enhancePrompts" className="text-slate-300 cursor-pointer">Enhance prompts with genre context</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">API Configuration</CardTitle>
                    <CardDescription className="text-slate-400">
                      Konfigurasi API key (disimpan di .env)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400 text-sm">Anthropic API Key</Label>
                        <Input
                          type="password"
                          placeholder="sk-ant-..."
                          readOnly
                          className="mt-2 bg-slate-800 border-slate-700"
                          value={process.env.ANTHROPIC_API_KEY ? '••••••••' : 'Belum diset'}
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400 text-sm">OpenAI API Key</Label>
                        <Input
                          type="password"
                          placeholder="sk-..."
                          readOnly
                          className="mt-2 bg-slate-800 border-slate-700"
                          value={process.env.OPENAI_API_KEY ? '••••••••' : 'Belum diset'}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Edit file <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono">.env</code> untuk mengubah API key. Restart server setelah perubahan.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Model Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-400 text-sm">Claude Model</Label>
                      <Select defaultValue="claude-3-5-sonnet-20241022">
                        <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Latest)</SelectItem>
                          <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Faster)</SelectItem>
                          <SelectItem value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">DALL-E Model</Label>
                      <Select defaultValue="dall-e-3">
                        <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          <SelectItem value="dall-e-3">DALL-E 3 (HD Quality)</SelectItem>
                          <SelectItem value="dall-e-2">DALL-E 2 (Faster, Cheaper)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm flex items-center justify-between">
                        Temperature
                        <span className="text-amber-400 font-mono">0.8</span>
                      </Label>
                      <Slider
                        defaultValue={80}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm flex items-center justify-between">
                        Max Tokens
                        <span className="text-amber-400 font-mono">8192</span>
                      </Label>
                      <Slider
                        defaultValue={[8192]}
                        min={1000}
                        max={8192}
                        step={500}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}