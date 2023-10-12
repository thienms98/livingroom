import Auth from './Auth';
import SessionProvider from '@/components/SessionProvider';

export default function Home() {
  return (
    <SessionProvider>
      <Auth />
    </SessionProvider>
  );
}
