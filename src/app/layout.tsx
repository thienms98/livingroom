import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta property="og:image" content="/livingroom.jpeg" />
        <meta property="og:image:alt" content="Livingroom" />

        <meta name="twitter:image" content="/livingroom.jpeg" />
        <meta property="twitter:image:alt" content="Livingroom" />
      </head>
      <body className={inter.className}>
        {children}
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}
