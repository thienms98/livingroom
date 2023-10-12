'use client';

import { SessionProvider } from 'next-auth/react';

const Page = (props: React.PropsWithChildren) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};

export default Page;
