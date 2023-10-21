'use client';

import { ContextType, Profile } from '@/utils/interfaces';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const MainContext = createContext<ContextType>({
  chosenRoom: null,
  choosingRoom: () => {},
  profile: { username: '' },
  setProfile: () => {},
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
  user: Profile;
  token: string;
}) {
  const [room, setRoom] = useState<string>('');
  const [profile, setProfile] = useState<Profile>(user);
  const [tok, setTok] = useState<string>(token);

  // refreshToken
  useEffect(() => {
    const refreshTok = setTimeout(
      () =>
        axios
          .post('/api/auth/refreshToken', { username: user.username })
          .then(({ data }) => setTok(data.token)),
      8 * 60 * 1000,
    );

    return () => clearTimeout(refreshTok);
  }, [tok, user.username, token]);

  const choosingRoom = (room: string) => setRoom(room);
  const ctx: ContextType = {
    chosenRoom: room,
    choosingRoom,
    profile,
    setProfile,
  };

  return <MainContext.Provider value={ctx}>{children}</MainContext.Provider>;
}
