import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'HairHub India | Premium Human Hair Marketplace',
  description: 'Buy and sell human hair in India. Connect directly with buyers and sellers via WhatsApp. Browse straight, wavy, curly, and virgin hair.',
  keywords: 'human hair, hair extensions, virgin hair, buy hair India, sell hair online, hair seller, hair buyer',
  authors: [{ name: 'HairHub India' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'HairHub India | Premium Human Hair Marketplace',
    description: 'India\'s trusted marketplace for buying and selling human hair.',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
