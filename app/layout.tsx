import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';

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
      <body className={inter.className}>
        {children}
        
        {/* Bolt.new Badge - Fixed position bottom-right */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 transition-transform duration-200 hover:scale-110"
          aria-label="Built with Bolt.new"
        >
          <Image
            src="/bolt-badge-black-circle.png"
            alt="Built with Bolt.new"
            width={48}
            height={48}
            className="w-12 h-12 md:w-14 md:h-14"
            priority
          />
        </a>
      </body>
    </html>
  );
}