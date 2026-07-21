import { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CeritaKosmos - Platform Cerita Digital AI-First',
  description: 'Baca cerita fiksi berkualitas dengan pengalaman seperti buku fisik. Genre: Kosmos, Alam, Romance, Horor, Konspirasi. Dibuat sepenuhnya oleh AI.',
  keywords: ['cerita', 'novel', 'fiksi', 'AI', 'baca online', 'wattpad', 'webtoon'],
  authors: [{ name: 'CeritaKosmos' }],
  openGraph: {
    title: 'CeritaKosmos - Platform Cerita Digital AI-First',
    description: 'Baca cerita fiksi berkualitas dengan pengalaman seperti buku fisik.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'CeritaKosmos',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${playfair.className} min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}