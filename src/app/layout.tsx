
import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Orbitron } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from './providers';

const sansFont = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const monoFont = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const titleFont = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Prompt Pavilion: AI Engineering Showcase',
  description: 'Discover the art of AI prompt engineering at our interactive Product Pavilion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sansFont.variable} ${monoFont.variable} ${titleFont.variable} antialiased font-sans`}>
        <AppProviders>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
