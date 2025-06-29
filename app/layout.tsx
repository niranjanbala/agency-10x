import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '10x Development Agency | Build Faster with AI',
  description: 'AI-scoped development agency by Devesh Verma. Get your MVP, app, or automation built 10x faster with expert AI-powered workflows.',
  keywords: 'AI development, MVP development, rapid prototyping, Next.js, React, automation',
  openGraph: {
    title: '10x Development Agency | Build Faster with AI',
    description: 'AI-scoped development agency by Devesh Verma. Get your MVP, app, or automation built 10x faster.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}