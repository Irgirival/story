import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      tagline, 
      synopsis, 
      genre, 
      coverImageUrl, 
      coverPrompt, 
      chapters, 
      chapterCount, 
      totalReadTime 
    } = body;

    // Validation
    if (!title || !synopsis || !genre || !chapters || !Array.isArray(chapters)) {
      return NextResponse.json(
        { message: 'Data tidak lengkap: title, synopsis, genre, chapters required' },
        { status: 400 }
      );
    }

    if (chapters.length === 0) {
      return NextResponse.json(
        { message: 'Minimal 1 chapter diperlukan' },
        { status: 400 }
      );
    }

    // Generate slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slug
    while (await prisma.story.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create story with chapters in transaction
    const story = await prisma.$transaction(async (tx) => {
      const newStory = await tx.story.create({
        data: {
          title,
          slug,
          tagline,
          synopsis,
          genre: genre as any,
          coverImageUrl,
          coverPrompt,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          chapterCount: chapters.length,
          totalReadTime: totalReadTime || chapters.reduce((sum: number, ch: any) => sum + (ch.readTimeMinutes || 7), 0),
          chapters: {
            create: chapters.map((ch: any, index: number) => ({
              chapterNumber: ch.chapterNumber || index + 1,
              title: ch.title,
              content: ch.content,
              readTimeMinutes: ch.readTimeMinutes || Math.ceil((ch.content?.length || 0) / 200),
            })),
          },
        },
        include: {
          chapters: true,
        },
      });

      return newStory;
    });

    return NextResponse.json({ 
      story,
      message: 'Cerita berhasil dipublish!' 
    });
  } catch (error: any) {
    console.error('Publish story error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Judul sudah digunakan, coba judul lain' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Gagal mempublish cerita' },
      { status: 500 }
    );
  }
}