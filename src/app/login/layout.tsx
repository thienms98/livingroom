import jwt from '@/lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const token = cookies().get('token')?.value;
  try {
    const data = jwt.verify(token || '');
    if (data) redirect('/dashboard');
  } catch (err) {}

  return <>{children}</>;
};

export default Layout;
