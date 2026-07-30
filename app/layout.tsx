import type { Metadata } from 'next';
import { Anton, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-street',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'The Lovable Times | Photography by Sangram AJ',
  description:
    'Raw, urban, soulful photography by Sangram AJ — based in Rairangpur, Mayurbhanj, Odisha.',
  keywords: [
    'photography',
    'Rairangpur',
    'Mayurbhanj',
    'Odisha',
    'Sangram AJ',
    'The Lovable Times',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${inter.variable} font-body antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}