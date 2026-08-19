import type { Metadata } from 'next';
import { Anton, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { siteConfig } from '@/lib/supabase/site-config';
import StructuredData from '@/components/seo/StructuredData';
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-street',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,

  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.owner }],
  creator: siteConfig.owner,
  publisher: siteConfig.legalName,
  category: 'Photography',

  keywords: [
    'wedding photographer India',
    'wedding photographer Odisha',
    'luxury wedding photographer India',
    'candid wedding photographer India',
    'cinematic wedding films India',
    'wedding filmmaker India',
    'destination wedding photographer India',
    'wedding photographer Rairangpur',
  ],

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Luxury Wedding Photography & Films`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className={`${anton.variable} ${inter.variable} font-body antialiased`}>
        {/* Structured data — fetches real business info server-side,
            never fabricates anything not already in the CMS */}
        <StructuredData />

        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}