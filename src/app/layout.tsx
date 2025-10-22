import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: 'Fancode Lite',
  description: 'Live scores and streaming for your favorite matches.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js" async></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr-level-selector-plugin@latest/dist/level-selector.min.js" async></script>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
