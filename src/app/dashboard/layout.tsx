import type { Metadata } from 'next';
import React from 'react';
import '@livekit/components-styles';
import MainContext, { AccountType } from '@/components/MainContext';
import jwt from '@/lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Liveroom Dashboard',
};

type LayoutProps = {
  children: React.ReactNode;
  // room: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const token = cookies().get('token')?.value;
  let user;
  try {
    user = jwt.verify<AccountType>(token || '');
  } catch (err) {
    // redirect('/login');
  }
  if (!user) redirect('/login');

  return (
    user && (
      <div>
        <MainContext user={user} token={token}>
          {props.children}
        </MainContext>
      </div>
    )
  );
};

export default Layout;
