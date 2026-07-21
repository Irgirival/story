import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STYLE_PROMPTS: Record<string, string> = {
  cinematic: 'cinematic lighting, dramatic composition, movie poster style, 8k resolution, highly detailed, professional photography lighting',
  illustration: 'digital illustration, artistic, painterly, concept art style, vibrant colors, detailed artwork',
  minimalist: 'minimalist design, clean lines, symbolic, negative space, modern aesthetic, simple but powerful',
  concept_art: 'concept art, detailed world building, game art style, intricate details, environment design',
  book_cover: 'professional book cover layout, elegant typography, publisher quality, bestseller aesthetic',
  anime: 'anime style, manga cover art, vibrant colors, Japanese illustration, cel shaded',
  dark_fantasy: 'dark fantasy, atmospheric, mystical, ominous, gothic aesthetic, grimdark',
  sci_fi: 'science fiction, futuristic, high tech, space, cyberpunk elements, advanced technology',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, genre } = body;

    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { message: 'Prompt terlalu pendek' },
        { status: 400 }
      );
    }

    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.cinematic;
    const genreColors: Record<string, string> = {
      KOSMOS: 'deep blues, purples, gold accents, nebula colors',
      ALAM: 'earthy greens, browns, natural lighting, organic tones',
      ROMANCE: 'warm pinks, roses, soft golds, romantic lighting',
      HOROR: 'deep reds, blacks, shadows, ominous lighting, blood tones',
      KONSPIRASI: 'yellows, ambers, dark grays, grid patterns, warning colors',
    };

    const fullPrompt = `${prompt}, ${stylePrompt}, color palette: ${genreColors[genre] || genreColors.KOSMOS}, masterpiece, best quality, ultra high res`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1536', // Portrait orientation for book covers
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // In production, download and upload to your storage (Cloudinary/S3)
    // For now, return the OpenAI URL directly (expires in 1 hour)
    return NextResponse.json({ imageUrl, prompt: fullPrompt });
  } catch (error: any) {
    console.error('Generate cover error:', error);
    return NextResponse.json(
      { message: error.message || 'Gagal generate cover' },
      { status: 500 }
    );
  }
}