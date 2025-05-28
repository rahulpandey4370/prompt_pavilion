
import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Orbitron } from 'next/font/google'; // Changed from GeistSans, GeistMono
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from './providers';

const sansFont = Inter({ // Changed from GeistSans to Inter
  variable: '--font-geist-sans', // Kept original CSS variable name
  subsets: ['latin'],
});

const monoFont = Roboto_Mono({ // Changed from GeistMono to Roboto_Mono
  variable: '--font-geist-mono', // Kept original CSS variable name
  subsets: ['latin'],
});

const titleFont = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700'], // Include weights you might need
});

export const metadata: Metadata = {
  title: 'PromptCraft Studio',
  description: 'Where AI Magic Meets Engineering Precision. Interactive AI Prompt Engineering Showcase.',
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
