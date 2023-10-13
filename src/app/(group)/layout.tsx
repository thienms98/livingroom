'use client';

import SessionProvider from '@/components/SessionProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
