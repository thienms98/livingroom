import Link from 'next/link';
import io from 'socket.io-client';

export default function Home() {
  return (
    <>
      <Link href="/login">Login</Link>
    </>
  );
}
