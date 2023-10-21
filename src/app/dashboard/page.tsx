'use client';

import Rooms from '@/components/common/Rooms';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  LayoutContextProvider,
} from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useMainContext } from '@/components/MainContext';
import axios from 'axios';
import { VideoPresets } from 'livekit-client';
import CustomVideoConference from '@/components/CustomVideoConference';
import Account from '@/components/common/Account';
import type { PinState } from '@livekit/components-core';
import { AiOutlineMenu } from 'react-icons/ai';
import Drawer from '@/components/common/Drawer';
import supabase from '@/lib/supabase';
import { Room } from 'livekit-server-sdk';
import type { Profile } from '@/utils/interfaces';

const Page = () => {
  const { chosenRoom, choosingRoom, profile, setProfile } = useMainContext();
  const [token, setToken] = useState<string>(chosenRoom || '');
  const [focusTrack, setFocusTrack] = useState<PinState>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onlines, setOnlines] = useState<{ valid: string[]; amount: number }>({
    valid: [],
    amount: 0,
  });

  useEffect(() => {
    (async () => {
      await getRooms();
      await getOnlinesAmount();
    })();

    // Listen to changes from db
    if (!supabase) return;
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          // table: 'room',
        },
        async (payload) => {
          if (payload.table === 'Room') await getRooms();
          if (payload.table === 'Account') await getOnlinesAmount();
          if (payload.table === 'Profile') await getProfile();
        },
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
        // supabase.removeChannel(onlinesWatcher);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get data realtime
  const getOnlinesAmount = async () => {
    const { data } = await axios.post('/api/online-users');
    setOnlines(data as { valid: string[]; amount: number });
  };
  const getRooms = async () => {
    const { data } = await axios.get('/api/rooms');
    setRooms((data as Room[]) || []);
  };
  const getProfile = async () => {
    const { data } = await axios(`/api/profile?username=${profile.username}`);
    setProfile(data.profile as Profile);
  };

  useEffect(() => {
    if (!chosenRoom) return;
    (async () => {
      try {
        const { data } = await axios(
          `/api/auth/getParticipantToken?room=${chosenRoom}&username=${profile.username}`,
        );
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenRoom]);

  return (
    <div className="h-screen max-h-screen overflow-hidden">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        // Use the default LiveKit theme for nice styles.
        options={{
          publishDefaults: {
            red: false,
            dtx: false,
            videoSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
            screenShareSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
          },
          adaptiveStream: { pixelDensity: 'screen' },
          dynacast: true,
        }}
        video={false}
        audio={true}
        // connectOptions={{ autoSubscribe: false }}
        data-lk-theme="default"
        style={{ height: '100dvh' }}
        key={token}
        onDisconnected={async () => {
          if (!chosenRoom) return;
          const temp = chosenRoom || '';
          const { data } = await axios.delete(`/api/participants`, {
            data: { room: chosenRoom, username: profile.username },
          });
          choosingRoom('');

          // if (data && !data.success) choosingRoom(temp);
        }}
      >
        <LayoutContextProvider onPinChange={(state) => setFocusTrack(state)}>
          <div className="grid grid-cols-1 grid-rows-[50px_auto] sm:grid-rows-1 sm:grid-cols-[200px_auto] h-full">
            <div className="hidden sm:grid grid-rows-[auto_100px] p-2 pr-0 gap-2">
              <Rooms rooms={rooms} onlines={onlines} />
              <Account />
            </div>
            <div className="block sm:hidden rounded-md bg-[#1e1e1e] m-1 p-1">
              <div
                className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#3e3e3e] hover:bg-[#5e5e5e] text-white relative cursor-pointer"
                onClick={() => setShowDrawer((prev) => !prev)}
              >
                <AiOutlineMenu className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
              </div>
            </div>
            <div>
              <CustomVideoConference focusTrack={focusTrack[0]} />
              <RoomAudioRenderer />
            </div>
            <Drawer
              visible={showDrawer}
              className="sm:hidden grid grid-rows-[auto_90px] gap-2 px-2 pb-2"
              onClose={() => setShowDrawer((prev) => !prev)}
            >
              <Rooms rooms={rooms} onlines={onlines} />
              <Account />
            </Drawer>
          </div>
        </LayoutContextProvider>
      </LiveKitRoom>
    </div>
  );
};

export default Page;
