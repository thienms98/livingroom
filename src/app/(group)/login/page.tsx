'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Auth = () => {
  // const { update, data, status } = useSession();
  // console.log(data);
  const session = useSession();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session.data ? (
        <>
          <div>You are logged in!</div>
          <button onClick={() => signOut()}>Log out</button>
        </>
      ) : (
        <>
          <div onClick={() => signIn('google')}>Log in with Google</div>
          <div onClick={() => signIn('github')}>Log in with Github</div>
        </>
      )}
    </main>
  );
};

export default Auth;
