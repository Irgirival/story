import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Anda adalah penulis cerita fiksi profesional yang menulis dalam Bahasa Indonesia. 
Tulis cerita yang immersif, berkualitas tinggi, dengan karakter yang hidup, dialog natural, dan plot yang menarik.
Gaya penulisan: show don't tell, sensory details, emotional depth, pacing yang baik.
Format output: JSON ketat sesuai schema yang diberikan.`;

function buildUserPrompt(params: {
  genre: string;
  premise: string;
  tone: string;
  chapterCount: number;
  language: string;
  pov: string;
  targetAudience: string;
}) {
  const genreContext: Record<string, string> = {
    KOSMOS: 'Alam semesta, bintang, galaksi, planet, wormhole, peradaban alien, teknologi futuristik, eksplorasi ruang angkasa, misteri kosmos',
    ALAM: 'Hutan, lautan, gunung, sungai, satwa liar, ekosistem, alam liar, keindahan alam, konservasi, petualangan outdoor',
    ROMANCE: 'Cinta, pertemuan, perpisahan, kesalahpahaman, kedekatan emosional, hubungan jarak jauh, second chance, enemies to lovers',
    HOROR: 'Ketakutan, misteri, supernatural, hantu, psikologis horror, jump scare, slow burn, ketegangan mendebarkan',
    KONSPIRASI: 'Rahasia, teori, kebenaran gelap, manipulasi, kekuatan tersembunyi, whistleblower, investigasi',
  };

  const toneGuidance: Record<string, string> = {
    epic: 'Grandiose, heroik, sinematik, skala besar, inspiratif',
    melankolis: 'Sedih, reflektif, mendalam, nostalgia, bittersweet',
    misterius: 'Rahasia, teka-teki, menegangkan, twist, unreliable narrator',
    seram: 'Horor psikologis, jumpscare, dread, uncanny, disturbing',
    romantis: 'Cinta tulus, hangat, manis, fluff, emotional payoff',
    humoris: 'Lucu, ringan, entertaining, witty, comedic timing',
    filosofis: 'Pemikiran mendalam, eksistensial, thought-provoking, allegorical',
    action: 'Cepat, penuh aksi, adrenaline, combat, chase sequences',
    slice_of_life: 'Kehidupan sehari-hari, relatable, mundane beauty, character-driven',
    dark: 'Cynical, brutal, no happy ending, moral ambiguity, grimdark',
  };

  const povGuidance: Record<string, string> = {
    third: 'Third person limited (Dia/Ia) - fokus pada satu karakter per scene',
    first: 'First person (Aku/Saya) - intimate, subjective, limited knowledge',
    omniscient: 'Omniscient (All-knowing) - bisa masuk ke pikiran semua karakter',
  };

  return `TUGAS: Tulis cerita fiksi lengkap dalam Bahasa Indonesia.

PARAMETER:
- Genre: ${params.genre} (${genreContext[params.genre] || ''})
- Premis: ${params.premise}
- Tone: ${params.tone} (${toneGuidance[params.tone] || ''})
- Jumlah Bab: ${params.chapterCount}
- POV: ${params.pov} (${povGuidance[params.pov] || ''})
- Target Audiens: ${params.targetAudience}
- Bahasa: ${params.language}

REQUIREMENTS:
1. Judul yang menarik, unik, dan relevan (max 60 char)
2. Tagline 1-2 kalimat yang hook (max 160 char)
3. Sinopsis 3-5 paragraf, no spoiler ending
4. ${params.chapterCount} bab dengan:
   - Judul bab yang menarik
   - Isi bab minimal 800 kata, maksimal 3000 kata
   - Estimasi waktu baca per bab (berdasarkan ~200 wpm)
   - Cliffhanger di akhir bab (kecuali bab terakhir)
5. Karakter utama yang berkembang (character arc)
6. World-building yang konsisten
7. Dialog natural dengan subtext
8. Sensory details di setiap scene
9. Pacing: act 1 (setup), act 2 (confrontation), act 3 (resolution)

OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
{
  "title": "string",
  "tagline": "string",
  "synopsis": "string",
  "genre": "${params.genre}",
  "totalReadTime": number,
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "string",
      "content": "string (full chapter text with \\n\\n paragraph breaks)",
      "readTimeMinutes": number
    }
  ]
}

IMPORTANT: 
- Escape newlines as \\n in JSON strings
- Escape quotes as \\"
- Content harus plain text, NO markdown formatting
- Setiap paragraf dipisah \\n\\n

- Output HANYA JSON, tidak ada teks tambahan`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { genre, premise, tone, chapterCount, language, pov, targetAudience } = body;

    if (!premise || !premise.trim()) {
      return NextResponse.json(
        { message: 'Premis cerita tidak boleh kosong' },
        { status: 400 }
      );
    }

    const prompt = buildUserPrompt({
      genre: genre || 'KOSMOS',
      premise: premise.trim(),
      tone: tone || 'epic',
      chapterCount: chapterCount || 10,
      language: language || 'id',
      pov: pov || 'third',
      targetAudience: targetAudience || 'dewasa',
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      temperature: 0.8,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON response
    let storyData;
    try {
      storyData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return NextResponse.json(
        { message: 'Gagal memproses respons AI, coba lagi' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!storyData.title || !storyData.chapters || !Array.isArray(storyData.chapters)) {
      return NextResponse.json(
        { message: 'Format respons AI tidak valid' },
        { status: 500 }
      );
    }

    return NextResponse.json({ story: storyData });
  } catch (error: any) {
    console.error('Generate story error:', error);

    if (error.status === 429) {
      return NextResponse.json(
        { message: 'Rate limit tercapai, tunggu sebentar' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Gagal generate cerita' },
      { status: 500 }
    );
  }
}