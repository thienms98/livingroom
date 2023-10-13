'use client';

import { useRouter } from 'next/navigation';

const Auth = () => {
  const router = useRouter();
  router.push('http://localhost:3000');
};

export default Auth;
