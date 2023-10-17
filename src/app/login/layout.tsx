import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const token = cookies().get('token')?.value;
  if (token) redirect('/dashboard');

  return <>{children}</>;
};

export default Layout;
