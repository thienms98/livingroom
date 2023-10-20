'use client';

import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

export type AccountType = {
  username: string;
  email?: string;
  metadata?: string;
  displayName?: string;
};

type ContextType = {
  user: AccountType;
  chosenRoom: string | null;
  choosingRoom: (room: string) => void;
};

const MainContext = createContext<ContextType>({
  user: {
    username: '',
  },
  chosenRoom: null,
  choosingRoom: () => {},
});

export const useMainContext = () => {
  return useContext(MainContext);
};

export default function Context({
  children,
  user,
  token,
}: {
  children: React.ReactNode;
  user: AccountType;
  token: string;
}) {
  const [room, setRoom] = useState<string>('');
  const [tok, setTok] = useState<string>(token);

  // refreshToken
  useEffect(() => {
    const refreshTok = setTimeout(
      () =>
        axios
          .post('/api/auth/refreshToken', { username: user.username })
          .then(({ data }) => setTok(data.token)),
      9 * 60 * 1000,
    );

    return () => clearTimeout(refreshTok);
  }, [tok, user.username, token]);

  const choosingRoom = (room: string) => setRoom(room);
  const ctx: ContextType = {
    user,
    chosenRoom: room,
    choosingRoom,
  };

  return <MainContext.Provider value={ctx}>{children}</MainContext.Provider>;
}
