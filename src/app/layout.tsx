import type {Metadata} from 'next';
import { Bebas_Neue, Lexend } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fancode BD | Live Cricket & Sports',
  description: 'Live scores, streaming, and updates for your favorite matches in Bangladesh. Watch cricket, football, and more on Fancode BD.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${bebasNeue.variable} ${lexend.variable}`}>
      <head>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js" async></script>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
