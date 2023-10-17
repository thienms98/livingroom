'use client';

import { createContext, useContext, useState } from 'react';

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
}: {
  children: React.ReactNode;
  user: AccountType;
}) {
  const [room, setRoom] = useState<string>('');

  const choosingRoom = (room: string) => setRoom(room);
  const ctx: ContextType = {
    user,
    chosenRoom: room,
    choosingRoom,
  };

  return <MainContext.Provider value={ctx}>{children}</MainContext.Provider>;
}
